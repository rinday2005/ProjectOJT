package org.example.userservice.dto.response;

import java.time.LocalDate;

public record PatientDto(
        Long id,
        String name,
        String fullName,
        LocalDate dob,
        LocalDate dateOfBirth,
        String gender,
        String medicalHistory,
        String medicalConditions,
        String relation,
        String status,
        String currentCondition,
        String address,
        Double latitude,
        Double longitude,
        Long familyId,
        String familyName) {
}
