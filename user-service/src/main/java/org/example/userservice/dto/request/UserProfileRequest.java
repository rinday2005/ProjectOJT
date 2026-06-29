package org.example.userservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserProfileRequest(
        @NotBlank(message = "Họ và tên không được để trống") String fullName,

        @NotBlank(message = "Số điện thoại không được để trống") @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không hợp lệ") String phone,

        String address) {
}
