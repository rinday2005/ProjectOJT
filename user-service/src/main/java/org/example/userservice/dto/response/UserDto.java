package org.example.userservice.dto.response;

public record UserDto(
                Long id,
                String keycloakId,
                String email,
                String fullName,
                String phone,
                String role,
                String status,
                String address,
                String avatar,
                String password) {
}
