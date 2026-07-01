package org.example.bookingservice.dto.response;

public record CaregiverDto(
                Long id,
                Long userId,
                String fullName,
                String phone,
                String email,
                String status,
                Double hourlyRate) {
}
