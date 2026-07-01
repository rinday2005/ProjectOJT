package org.example.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.example.userservice.dto.response.UserDto;
import org.example.userservice.dto.request.UserProfileRequest;
import org.example.userservice.service.AuthSyncService;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final AuthSyncService authSyncService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        // Sync user in database if it is their first time logging in
        authSyncService.syncUser(jwt);

        UserDto profile = userService.getProfileByKeycloakId(jwt.getSubject());
        if ("INACTIVE".equalsIgnoreCase(profile.status())) {
            throw new org.example.userservice.exception.UserBlockedException("Tài khoản của bạn đã bị khóa.");
        }
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/appeal")
    public ResponseEntity<org.example.userservice.dto.response.UserAppealDto> submitAppeal(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody java.util.Map<String, String> body) {
        String message = body.get("message");
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung khiếu nại không được để trống");
        }
        return ResponseEntity.ok(userService.submitAppeal(jwt.getSubject(), message));
    }

    @PutMapping
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserProfileRequest request) {

        UserDto updated = userService.updateProfile(jwt.getSubject(), request);
        return ResponseEntity.ok(updated);
    }
}
