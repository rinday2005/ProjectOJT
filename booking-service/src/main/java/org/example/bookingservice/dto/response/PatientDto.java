package org.example.bookingservice.dto.response;

import java.time.LocalDate;

public record PatientDto(
                Long id,
                String name,
                String fullName,
                LocalDate dob,
                LocalDate dateOfBirth,
                String gender,
                String relation,
                Long familyId,
                String familyName) {
}
