package org.example.caregiverservice.dto.response;

import lombok.Builder;

@Builder
public record CaregiverDto(
    Long id,
    Long userId,
    String keycloakId,
    String email,
    String phone,
    String fullName,
    String specialization,
    Integer experienceYears,
    Double hourlyRate,
    String imageUrl,
    String bio,
    String status, // 'Online', 'On-Duty', 'Offline'
    Double rating,
    Integer reviewCount,
    String skills,
    String certifications,
    boolean certificationsVerified
) {}
