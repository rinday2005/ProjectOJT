package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.service.KeycloakService;
import org.example.userservice.service.UserService;
import org.example.userservice.dto.request.UserProfileRequest;
import org.example.userservice.dto.response.UserDto;
import org.example.userservice.dto.response.PatientDto;
import org.example.userservice.dto.response.DashboardStatsResponse;
import org.example.userservice.dto.response.RecentActivityResponse;
import org.example.userservice.entity.User;
import org.example.userservice.exception.DuplicatePhoneException;
import org.example.userservice.exception.UserNotFoundException;
import org.example.userservice.mapper.UserMapper;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.repository.PatientRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PatientRepository patientRepository;
    private final KeycloakService keycloakService;

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfileByKeycloakId(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(String keycloakId, UserProfileRequest request) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));

        // Validation rule: check duplicate phone number (excluding the current user)
        if (request.phone() != null && !request.phone().trim().isEmpty()) {
            boolean duplicatePhone = userRepository.existsByPhoneAndKeycloakIdNot(request.phone(), keycloakId);
            if (duplicatePhone) {
                throw new DuplicatePhoneException("This phone number is already in use by another user!");
            }
        }

        userMapper.updateEntityFromRequest(request, user);
        User updatedUser = userRepository.save(user);
        log.info("Updated profile in DB for Keycloak ID: {}", keycloakId);

        // Sync details to Keycloak via Account API
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuthToken) {
            updateKeycloakProfile(jwtAuthToken.getToken(), request.fullName());
        }

        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto updateAvatar(String keycloakId, String avatarData) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));
        user.setAvatar(avatarData);
        User saved = userRepository.save(user);
        log.info("Updated avatar in DB for Keycloak ID: {}", keycloakId);
        return userMapper.toDto(saved);
    }

    private void updateKeycloakProfile(Jwt jwt, String fullName) {
        try {
            String issuer = jwt.getClaimAsString("iss");
            String accountUrl = issuer + "/account";
            String token = jwt.getTokenValue();

            String name = fullName.trim();
            String firstName = name;
            String lastName = "";
            int lastSpace = name.lastIndexOf(' ');
            if (lastSpace > 0) {
                firstName = name.substring(0, lastSpace);
                lastName = name.substring(lastSpace + 1);
            }

            String jsonBody = String.format(
                "{\"username\":\"%s\",\"email\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\"}",
                jwt.getClaimAsString("preferred_username"),
                jwt.getClaimAsString("email"),
                firstName.replace("\"", "\\\""),
                lastName.replace("\"", "\\\"")
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(accountUrl))
                    .header("Authorization", "Bearer " + token)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Successfully updated profile in Keycloak for user: {}", jwt.getSubject());
            } else {
                log.warn("Failed to update profile in Keycloak. Status: {}, Body: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Error updating profile in Keycloak", e);
        }
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userDto.email() == null || userDto.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống!");
        }
        if (userDto.role() == null || userDto.role().trim().isEmpty()) {
            throw new IllegalArgumentException("Vai trò không được để trống!");
        }
        if (userDto.password() == null || userDto.password().trim().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống!");
        }

        // Validate uniqueness of phone
        if (userDto.phone() != null && !userDto.phone().trim().isEmpty()) {
            userRepository.findByPhone(userDto.phone()).ifPresent(u -> {
                throw new DuplicatePhoneException("Số điện thoại đã được sử dụng!");
            });
        }
        // Validate email uniqueness
        if (userDto.email() != null && !userDto.email().trim().isEmpty()) {
            userRepository.findByEmail(userDto.email()).ifPresent(u -> {
                throw new DuplicatePhoneException("Email đã được sử dụng!");
            });
        }

        // Normalize role
        String normalizedRole = userDto.role().toUpperCase();
        if ("OPERATIONADMIN".equals(normalizedRole)) {
            normalizedRole = "OPERATOR";
        }

        // 1. Create in Keycloak
        String keycloakId = keycloakService.createUser(
                userDto.email().trim(),
                userDto.password(),
                userDto.fullName(),
                userDto.phone(),
                normalizedRole
        );

        // 2. Insert into DB
        try {
            User user = userMapper.toEntity(userDto);
            user.setKeycloakId(keycloakId);
            user.setRole(normalizedRole);
            if (user.getStatus() == null) {
                user.setStatus("ACTIVE");
            }
            User saved = userRepository.save(user);
            log.info("Created new user with ID: {} and Keycloak ID: {}", saved.getId(), keycloakId);
            return userMapper.toDto(saved);
        } catch (Exception e) {
            log.error("Database save failed. Rolling back Keycloak user {}", keycloakId, e);
            try {
                keycloakService.deleteUser(keycloakId);
            } catch (Exception ex) {
                log.error("Failed to rollback Keycloak user {}", keycloakId, ex);
            }
            throw e;
        }
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));

        // Validate unique phone
        if (userDto.phone() != null && !userDto.phone().trim().isEmpty()) {
            boolean duplicatePhone = userRepository.existsByPhoneAndKeycloakIdNot(userDto.phone(), user.getKeycloakId());
            if (duplicatePhone) {
                throw new DuplicatePhoneException("Số điện thoại đã được sử dụng!");
            }
        }

        user.setFullName(userDto.fullName());
        user.setPhone(userDto.phone());
        user.setAddress(userDto.address());
        user.setRole(userDto.role());
        user.setStatus(userDto.status());

        User saved = userRepository.save(user);
        log.info("Updated user with ID: {}", saved.getId());
        return userMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));
        
        // This triggers Hibernate Soft Delete as configured via @SQLDelete on User entity class
        userRepository.delete(user);
        log.info("Soft-deleted user with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDto> getPatientsByKeycloakId(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));
        return user.getPatients().stream()
                .map(patient -> new PatientDto(
                        patient.getId(),
                        patient.getName(),
                        patient.getDob(),
                        patient.getGender(),
                        patient.getMedicalHistory(),
                        patient.getAddress(),
                        patient.getLatitude(),
                        patient.getLongitude()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto toggleUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));
        user.setStatus(active ? "ACTIVE" : "INACTIVE");
        User saved = userRepository.save(user);
        log.info("Toggled status for user with ID: {} to {}", id, user.getStatus());
        return userMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalCaregivers = userRepository.countByRole("CAREGIVER");
        long totalFamilies = userRepository.countByRole("FAMILY");

        // The remaining stats are returned as placeholders
        return new DashboardStatsResponse(
                totalPatients,
                totalCaregivers,
                totalFamilies,
                0L, // activeContracts
                0L, // todaySchedules
                0L, // completedToday
                0.0, // monthlyRevenue
                0L  // pendingPayments
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentActivityResponse> getRecentActivities(int limit) {
        // Return a placeholder activity feed representing database status
        RecentActivityResponse activity = new RecentActivityResponse(
                "System Initialized",
                "Backend service user synchronization initialized successfully",
                "completed",
                java.time.LocalDateTime.now().minusHours(1).toString()
        );
        return List.of(activity);
    }
}
