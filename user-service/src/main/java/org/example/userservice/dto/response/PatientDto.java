package org.example.userservice.dto.response;

import java.time.LocalDate;

public record PatientDto(
    Long id,
    String name,
    LocalDate dob,
    String gender,
    String medicalHistory,
    String address,
    Double latitude,
    Double longitude
) {}
