package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.response.DashboardStatsResponse;
import org.example.userservice.dto.response.RecentActivityResponse;
import org.example.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/admin-dashboard")
    public ResponseEntity<String> getAdminDashboard(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok("Chào " + username + " (" + email + "), bạn là Admin!");
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(userService.getDashboardStats());
    }

    @GetMapping("/activities")
    public ResponseEntity<List<RecentActivityResponse>> getRecentActivities(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(userService.getRecentActivities(limit));
    }
}