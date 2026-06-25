package org.example.userservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.response.UserDto;
import org.example.userservice.service.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
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

    @PutMapping("/{id}/status")
    public ResponseEntity<UserDto> toggleUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        return ResponseEntity.ok(userService.toggleUserStatus(id, active));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public/avatar/{keycloakId}")
    public ResponseEntity<byte[]> getAvatarByKeycloakId(@PathVariable String keycloakId) {
        UserDto profile = userService.getProfileByKeycloakId(keycloakId);
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
}

