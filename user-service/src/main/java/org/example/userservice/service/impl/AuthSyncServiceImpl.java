package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.entity.User;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.AuthSyncService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthSyncServiceImpl implements AuthSyncService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void syncUser(Jwt jwt) {
        String keycloakId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");

        // 1. Check if user already exists by keycloakId
        if (userRepository.findByKeycloakId(keycloakId).isPresent()) {
            return;
        }

        log.info("Synchronizing user with Keycloak ID: {}", keycloakId);

        // 2. Check if user already exists by email (created by Admin but not bound to
        // Keycloak yet)
        if (email != null) {
            var userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent()) {
                User user = userByEmail.get();
                user.setKeycloakId(keycloakId);
                userRepository.save(user);
                log.info("Linked existing user email {} to Keycloak ID {}", email, keycloakId);
                return;
            }
        }

        // 3. Extract role from realm_access roles
        String role = "FAMILY"; // default role
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.get("roles") != null) {
            try {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) realmAccess.get("roles");
                if (roles.contains("ADMIN")) {
                    role = "ADMIN";
                } else if (roles.contains("OPERATOR")) {
                    role = "OPERATOR";
                } else if (roles.contains("CAREGIVER")) {
                    role = "CAREGIVER";
                } else if (roles.contains("FAMILY")) {
                    role = "FAMILY";
                }
            } catch (Exception e) {
                log.error("Failed to parse realm roles from JWT", e);
            }
        }

        // 4. Create a new user profile stub
        String fullName = jwt.getClaimAsString("name");
        if (fullName == null || fullName.trim().isEmpty()) {
            fullName = jwt.getClaimAsString("preferred_username");
        }
        if (fullName == null || fullName.trim().isEmpty()) {
            fullName = "New User";
        }

        User newUser = User.builder()
                .keycloakId(keycloakId)
                .email(email != null ? email : (jwt.getClaimAsString("preferred_username") + "@homecare.com"))
                .fullName(fullName)
                .phone("")
                .address("")
                .role(role)
                .status("ACTIVE")
                .build();

        userRepository.save(newUser);
        log.info("Created new user stub for email {} with role {}", newUser.getEmail(), role);
    }
}
