package org.example.userservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record PatientRequest(
        String name,
        String fullName,

        LocalDate dob,
        LocalDate dateOfBirth,

        @NotBlank(message = "Gender cannot be blank") String gender,

        String medicalHistory,
        String medicalConditions,

        String relation,
        String status,
        String currentCondition,

        @NotBlank(message = "Address cannot be blank") String address,

        Double latitude,
        Double longitude,

        Long familyId) {
    // Utility methods to resolve alternative field names
    public String getResolvedName() {
        return fullName != null ? fullName : name;
    }

    public LocalDate getResolvedDob() {
        return dateOfBirth != null ? dateOfBirth : dob;
    }

    public String getResolvedMedicalHistory() {
        return medicalHistory != null ? medicalHistory : medicalConditions;
    }
}
