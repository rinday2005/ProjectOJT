package org.example.bookingservice.dto.response;

import java.time.LocalDate;

public record CaregiverAvailabilityDto(
        Long caregiverId,
        LocalDate date,
        boolean available,
        String conflictReason) {
}
