package org.example.bookingservice.dto.response;

public record UserDto(
                Long id,
                String keycloakId,
                String email,
                String fullName,
                String phone,
                String role,
                String status,
                String address) {
}
