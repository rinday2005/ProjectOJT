package org.example.caregiverservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/caregiver")
public class CaregiverController {

    @GetMapping("/profile")
    public ResponseEntity<String> getCaregiverProfile(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(401).body("Không tìm thấy thông tin xác thực!");
        }

        String userId = jwt.getSubject();
        return ResponseEntity.ok("Chào Caregiver, ID của bạn là: " + userId);
    }
}