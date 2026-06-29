package org.example.caregiverservice.mapper;

import org.example.caregiverservice.dto.response.CaregiverDto;
import org.example.caregiverservice.dto.response.UserDto;
import org.example.caregiverservice.entity.Caregiver;
import org.springframework.stereotype.Component;

@Component
public class CaregiverMapper {

    public CaregiverDto toDto(Caregiver cg, UserDto u, String skillsStr, String certsStr) {
        return CaregiverDto.builder()
                .id(cg.getId())
                .userId(cg.getUserId())
                .keycloakId(u != null ? u.keycloakId() : null)
                .email(u != null ? u.email() : null)
                .phone(u != null ? u.phone() : null)
                .fullName(u != null ? u.fullName() : null)
                .imageUrl(u != null ? u.avatar() : null)
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
