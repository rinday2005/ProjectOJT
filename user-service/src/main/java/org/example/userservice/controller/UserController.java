package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;

import org.example.userservice.dto.response.UserDto;
import org.example.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(userDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(id, userDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UserDto> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(userService.toggleUserStatus(id, active));
    }

    @GetMapping("/appeals")
    public ResponseEntity<List<org.example.userservice.dto.response.UserAppealDto>> getAllAppeals() {
        return ResponseEntity.ok(userService.getAllAppeals());
    }

    @PostMapping("/appeals/{id}/reply")
    public ResponseEntity<org.example.userservice.dto.response.UserAppealDto> replyToAppeal(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        String replyContent = body.get("replyContent");
        if (replyContent == null || replyContent.trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung phản hồi không được để trống");
        }
        return ResponseEntity.ok(userService.replyToAppeal(id, replyContent));
    }
}
