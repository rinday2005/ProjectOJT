package org.example.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.request.UserProfileRequest;
import org.example.userservice.dto.response.UserDto;
import org.example.userservice.service.AuthSyncService;
import org.example.userservice.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import org.example.userservice.dto.response.PatientDto;

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

    @PostMapping("/avatar")
    public ResponseEntity<UserDto> uploadAvatar(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(null);
        }
        
        String base64Prefix = "data:" + contentType + ";base64,";
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
        String avatarData = base64Prefix + base64Image;
        
        UserDto updated = userService.updateAvatar(jwt.getSubject(), avatarData);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/avatar")
    public ResponseEntity<byte[]> getMyAvatar(@AuthenticationPrincipal Jwt jwt) {
        UserDto profile = userService.getProfileByKeycloakId(jwt.getSubject());
        String avatar = profile.avatar();
        if (avatar == null || avatar.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (avatar.startsWith("data:")) {
            int commaIndex = avatar.indexOf(",");
            if (commaIndex > 0) {
                String header = avatar.substring(0, commaIndex);
                String base64Data = avatar.substring(commaIndex + 1);
                String contentType = header.substring(5, header.indexOf(";"));
                byte[] imageBytes = Base64.getDecoder().decode(base64Data);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(imageBytes);
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<PatientDto>> getMyPatients(@AuthenticationPrincipal Jwt jwt) {
        List<PatientDto> patients = userService.getPatientsByKeycloakId(jwt.getSubject());
        return ResponseEntity.ok(patients);
    }
}

