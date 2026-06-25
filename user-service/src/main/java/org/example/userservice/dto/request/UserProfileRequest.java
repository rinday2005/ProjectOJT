package org.example.userservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UserProfileRequest(
    @NotBlank(message = "Full Name cannot be empty")
    String fullName,

    @NotBlank(message = "Phone Number cannot be empty")
    @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Invalid phone number")
    String phone,

    String address,

    String avatar
) {}
