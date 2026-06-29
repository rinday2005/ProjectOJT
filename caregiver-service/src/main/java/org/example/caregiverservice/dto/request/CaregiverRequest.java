package org.example.caregiverservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CaregiverRequest(
    @NotBlank(message = "Họ và tên không được để trống")
    String fullName,

    @Email(message = "Email không hợp lệ")
    String email,

    String password, // Mật khẩu (bắt buộc khi tạo mới)

    @NotBlank(message = "Số điện thoại không được để trống")
    String phone,

    String specialization,
    Integer experienceYears,
    Double hourlyRate,
    String imageUrl,
    String bio,
    Boolean isAvailable,
    String status, // 'Online', 'On-Duty', 'Offline'
    String skills,
    String certifications,
    Boolean certificationsVerified
) {}
