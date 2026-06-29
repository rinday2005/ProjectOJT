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
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UserProfileRequest request) {

        UserDto updated = userService.updateProfile(jwt.getSubject(), request);
        return ResponseEntity.ok(updated);
    }
}
