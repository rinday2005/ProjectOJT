package org.example.caregiverservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.caregiverservice.client.UserServiceClient;
import org.example.caregiverservice.dto.response.UserDto;
import org.example.caregiverservice.dto.request.CaregiverRequest;
import org.example.caregiverservice.dto.response.CaregiverDto;
import org.example.caregiverservice.entity.Caregiver;
import org.example.caregiverservice.entity.CaregiverSkill;
import org.example.caregiverservice.entity.Certificate;
import org.example.caregiverservice.dto.response.ReviewStats;
import org.example.caregiverservice.repository.CaregiverRepository;
import org.example.caregiverservice.repository.CaregiverReviewRepository;
import org.example.caregiverservice.repository.CaregiverSkillRepository;
import org.example.caregiverservice.repository.CertificateRepository;
import org.example.caregiverservice.service.CaregiverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CaregiverServiceImpl implements CaregiverService {

    private final CaregiverRepository caregiverRepository;
    private final CaregiverSkillRepository caregiverSkillRepository;
    private final CertificateRepository certificateRepository;
    private final UserServiceClient userServiceClient;
    private final CaregiverReviewRepository caregiverReviewRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CaregiverDto> getCaregivers() {
        // Fetch all users with role 'CAREGIVER' via User Service
        List<UserDto> users = userServiceClient.getAllUsers().stream()
                .filter(u -> "CAREGIVER".equalsIgnoreCase(u.role()))
                .collect(Collectors.toList());

        List<Caregiver> localCaregivers = caregiverRepository.findAll();
        Map<Long, Caregiver> localMap = localCaregivers.stream()
                .collect(Collectors.toMap(Caregiver::getUserId, c -> c, (c1, c2) -> c1));

        List<ReviewStats> statsList = caregiverReviewRepository.getAverageRatingAndCountForAllCaregivers();
        Map<Long, ReviewStats> statsMap = statsList.stream()
                .collect(Collectors.toMap(ReviewStats::caregiverId, s -> s));

        return users.stream()
                .map(u -> {
                    Caregiver cg = localMap.get(u.id());
                    if (cg == null) {
                        // Transient initialization for out-of-sync profiles
                        cg = Caregiver.builder()
                                .userId(u.id())
                                .status("Offline")
                                .specialization("General Care")
                                .experienceYears(0)
                                .hourlyRate(java.math.BigDecimal.ZERO)
                                .averageRating(0.0)
                                .totalReviews(0)
                                .build();
                    } else {
                        ReviewStats stats = statsMap.get(cg.getId());
                        if (stats != null) {
                            cg.setAverageRating(stats.averageRating());
                            cg.setTotalReviews(stats.reviewCount().intValue());
                        } else {
                            cg.setAverageRating(0.0);
                            cg.setTotalReviews(0);
                        }
                    }
                    return convertToDto(cg, u);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CaregiverDto getCaregiverById(Long id) {
        Caregiver cg = caregiverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người chăm sóc với ID: " + id));

        UserDto u = userServiceClient.getUserById(cg.getUserId());
        if (u == null) {
            throw new IllegalArgumentException("Không tìm thấy thông tin tài khoản người dùng tương ứng!");
        }

        ReviewStats stats = caregiverReviewRepository.getAverageRatingAndCountByCaregiverId(id)
                .orElse(new ReviewStats(id, 0.0, 0L));
        cg.setAverageRating(stats.averageRating());
        cg.setTotalReviews(stats.reviewCount().intValue());

        return convertToDto(cg, u);
    }

    @Override
    @Transactional
    public CaregiverDto createCaregiver(CaregiverRequest request) {
        // 1. Post to user-service to register in Keycloak & local users table
        UserDto creationDto = new UserDto(
                null,
                null,
                request.email().trim(),
                request.fullName().trim(),
                request.phone().trim(),
                "CAREGIVER",
                "ACTIVE",
                "",
                request.imageUrl(),
                request.password());

        UserDto createdUser = userServiceClient.createUser(creationDto);

        // 2. Create local Caregiver record
        try {
            String defaultStatus = (request.isAvailable() != null && request.isAvailable()) ? "Online" : "Offline";
            Caregiver cg = Caregiver.builder()
                    .userId(createdUser.id())
                    .specialization(request.specialization())
                    .experienceYears(request.experienceYears() != null ? request.experienceYears() : 0)
                    .hourlyRate(request.hourlyRate() != null ? java.math.BigDecimal.valueOf(request.hourlyRate())
                            : java.math.BigDecimal.ZERO)
                    .bio(request.bio())
                    .status(request.status() != null ? request.status() : defaultStatus)
                    .averageRating(0.0)
                    .totalReviews(0)
                    .certificationsVerified(
                            request.certificationsVerified() != null ? request.certificationsVerified() : false)
                    .build();

            Caregiver savedCg = caregiverRepository.save(cg);

            // Save skills
            saveSkillsForCaregiver(savedCg, request.skills());

            // Save certifications
            saveCertificationsForCaregiver(savedCg, request.certifications());

            log.info("Caregiver profile successfully created under ID: {}", savedCg.getId());
            return convertToDto(savedCg, createdUser);
        } catch (Exception e) {
            log.error("Rolling back User Creation in user-service for UserId: {}", createdUser.id(), e);
            try {
                userServiceClient.deleteUser(createdUser.id());
            } catch (Exception ex) {
                log.error("Failed to delete user during rollback", ex);
            }
            throw e;
        }
    }

    @Override
    @Transactional
    public CaregiverDto updateCaregiver(Long id, CaregiverRequest request) {
        Caregiver cg = caregiverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người chăm sóc với ID: " + id));

        UserDto u = userServiceClient.getUserById(cg.getUserId());
        if (u == null) {
            throw new IllegalArgumentException("Không tìm thấy thông tin tài khoản người dùng tương ứng!");
        }

        // Update user properties in user-service
        UserDto updateDto = new UserDto(
                u.id(),
                u.keycloakId(),
                u.email(),
                request.fullName().trim(),
                request.phone().trim(),
                u.role(),
                u.status(),
                u.address(),
                request.imageUrl() != null ? request.imageUrl() : u.avatar(),
                null);
        UserDto updatedUser = userServiceClient.updateUser(u.id(), updateDto);

        // Update local caregiver properties
        if (request.specialization() != null)
            cg.setSpecialization(request.specialization());
        if (request.experienceYears() != null)
            cg.setExperienceYears(request.experienceYears());
        if (request.hourlyRate() != null)
            cg.setHourlyRate(java.math.BigDecimal.valueOf(request.hourlyRate()));
        if (request.bio() != null)
            cg.setBio(request.bio());

        if (request.isAvailable() != null) {
            cg.setStatus(request.isAvailable() ? "Online" : "Offline");
        } else if (request.status() != null) {
            cg.setStatus(request.status());
        }

        Caregiver savedCg = caregiverRepository.save(cg);

        if (request.skills() != null) {
            saveSkillsForCaregiver(savedCg, request.skills());
        }
        if (request.certifications() != null) {
            saveCertificationsForCaregiver(savedCg, request.certifications());
        }

        log.info("Caregiver profile updated for ID: {}", id);
        return convertToDto(savedCg, updatedUser);
    }

    @Override
    @Transactional
    public void deleteCaregiver(Long id) {
        Caregiver cg = caregiverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người chăm sóc với ID: " + id));

        // Delete from user-service (triggers Keycloak de-registration + soft delete)
        userServiceClient.deleteUser(cg.getUserId());

        // Delete local caregiver profile record
        caregiverRepository.delete(cg);
        log.info("Caregiver profile record deleted successfully for ID: {}", id);
    }

    @Override
    @Transactional
    public CaregiverDto verifyCertifications(Long id, boolean verified) {
        Caregiver cg = caregiverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người chăm sóc với ID: " + id));

        cg.setCertificationsVerified(verified);
        Caregiver savedCg = caregiverRepository.save(cg);

        UserDto u = userServiceClient.getUserById(cg.getUserId());
        return convertToDto(savedCg, u);
    }

    @Override
    @Transactional
    public CaregiverDto updateSkillsAndAvailability(Long id, String skills, String status) {
        Caregiver cg = caregiverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người chăm sóc với ID: " + id));

        if (status != null) {
            cg.setStatus(status);
        }
        Caregiver savedCg = caregiverRepository.save(cg);

        if (skills != null) {
            saveSkillsForCaregiver(savedCg, skills);
        }

        UserDto u = userServiceClient.getUserById(cg.getUserId());
        return convertToDto(savedCg, u);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateCaregiverRanking(Long id) {
        Caregiver cg = caregiverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người chăm sóc với ID: " + id));

        ReviewStats stats = caregiverReviewRepository.getAverageRatingAndCountByCaregiverId(id)
                .orElse(new ReviewStats(id, 0.0, 0L));

        double ratingScore = stats.averageRating() * 20.0;
        double experienceScore = cg.getExperienceYears() * 2.0;

        return ratingScore + experienceScore;
    }

    private void saveSkillsForCaregiver(Caregiver caregiver, String skills) {
        caregiverSkillRepository.deleteByCaregiverId(caregiver.getId());
        if (skills != null && !skills.trim().isEmpty()) {
            for (String s : skills.split(",")) {
                if (!s.trim().isEmpty()) {
                    caregiverSkillRepository.save(CaregiverSkill.builder()
                            .caregiver(caregiver)
                            .skillName(s.trim())
                            .level("BASIC")
                            .build());
                }
            }
        }
    }

    private void saveCertificationsForCaregiver(Caregiver caregiver, String certifications) {
        certificateRepository.deleteByCaregiverId(caregiver.getId());
        if (certifications != null && !certifications.trim().isEmpty()) {
            for (String c : certifications.split(",")) {
                if (!c.trim().isEmpty()) {
                    certificateRepository.save(Certificate.builder()
                            .caregiver(caregiver)
                            .name(c.trim())
                            .organization("Verification Authority")
                            .issueDate(LocalDate.now())
                            .build());
                }
            }
        }
    }

    private CaregiverDto convertToDto(Caregiver cg, UserDto u) {
        List<CaregiverSkill> skills = caregiverSkillRepository.findByCaregiverId(cg.getId());
        String skillsStr = skills.stream()
                .map(CaregiverSkill::getSkillName)
                .collect(Collectors.joining(", "));

        List<Certificate> certs = certificateRepository.findByCaregiverId(cg.getId());
        String certsStr = certs.stream()
                .map(Certificate::getName)
                .collect(Collectors.joining(", "));

        return CaregiverDto.builder()
                .id(cg.getId())
                .userId(cg.getUserId())
                .keycloakId(u.keycloakId())
                .email(u.email())
                .phone(u.phone())
                .fullName(u.fullName())
                .imageUrl(u.avatar())
                .specialization(cg.getSpecialization())
                .experienceYears(cg.getExperienceYears())
                .hourlyRate(cg.getHourlyRate() != null ? cg.getHourlyRate().doubleValue() : 0.0)
                .bio(cg.getBio())
                .status(cg.getStatus())
                .rating(cg.getAverageRating())
                .reviewCount(cg.getTotalReviews())
                .skills(skillsStr)
                .certifications(certsStr)
                .certificationsVerified(cg.isCertificationsVerified())
                .build();
    }
}
