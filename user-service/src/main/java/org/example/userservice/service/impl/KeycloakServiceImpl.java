package org.example.userservice.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.example.userservice.service.KeycloakService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class KeycloakServiceImpl implements KeycloakService {

    private final Keycloak keycloak;
    private final String realmTarget;

    public KeycloakServiceImpl(
            @Value("${keycloak.admin.server-url}") String serverUrl,
            @Value("${keycloak.admin.realm}") String realm,
            @Value("${keycloak.admin.username}") String username,
            @Value("${keycloak.admin.password}") String password,
            @Value("${keycloak.admin.client-id}") String clientId,
            @Value("${keycloak.admin.realm-target}") String realmTarget) {
        this.realmTarget = realmTarget;
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .username(username)
                .password(password)
                .clientId(clientId)
                .build();
    }

    @Override
    public String createUser(String email, String password, String fullName, String phone, String role) {
        String targetRealm = this.realmTarget;
        log.info("Creating user in Keycloak: email={}, role={}, targetRealm={}", email, role, targetRealm);

        // 1. Prepare User Representation
        UserRepresentation userRep = new UserRepresentation();
        userRep.setUsername(email);
        userRep.setEmail(email);
        userRep.setEmailVerified(true);
        userRep.setEnabled(true);

        // Split Full Name into First and Last Name
        String name = fullName != null ? fullName.trim() : "";
        String firstName = name;
        String lastName = "";
        int lastSpace = name.lastIndexOf(' ');
        if (lastSpace > 0) {
            firstName = name.substring(0, lastSpace);
            lastName = name.substring(lastSpace + 1);
        }
        userRep.setFirstName(firstName);
        userRep.setLastName(lastName);

        if (phone != null && !phone.isEmpty()) {
            userRep.setAttributes(Map.of("phone", List.of(phone)));
        }

        // Set Password
        if (password != null && !password.isEmpty()) {
            CredentialRepresentation cred = new CredentialRepresentation();
            cred.setType(CredentialRepresentation.PASSWORD);
            cred.setValue(password);
            cred.setTemporary(false);
            userRep.setCredentials(List.of(cred));
        }

        // 2. Call Keycloak Admin API
        Response response;
        try {
            response = keycloak.realm(targetRealm).users().create(userRep);
        } catch (Exception e) {
            log.error("Failed to connect to Keycloak Server", e);
            throw new RuntimeException("Không thể kết nối tới Keycloak Server: " + e.getMessage());
        }

        int status = response.getStatus();
        log.info("Keycloak user creation HTTP status: {}", status);

        if (status == 201) {
            String keycloakId = CreatedResponseUtil.getCreatedId(response);
            log.info("Keycloak user created successfully with ID: {}", keycloakId);

            // 3. Assign Role to User
            try {
                String normalizedRole = role.toUpperCase();
                if ("OPERATIONADMIN".equals(normalizedRole)) {
                    normalizedRole = "OPERATOR";
                }

                RoleRepresentation roleRep = keycloak.realm(targetRealm)
                        .roles()
                        .get(normalizedRole)
                        .toRepresentation();

                keycloak.realm(targetRealm)
                        .users()
                        .get(keycloakId)
                        .roles()
                        .realmLevel()
                        .add(List.of(roleRep));
                log.info("Assigned role {} to Keycloak user {}", normalizedRole, keycloakId);
            } catch (Exception e) {
                log.error("Failed to assign role {} to Keycloak user {}", role, keycloakId, e);
                // Rollback: delete the created Keycloak user to keep consistency
                try {
                    keycloak.realm(targetRealm).users().get(keycloakId).remove();
                    log.info("Rollback: Removed Keycloak user {} due to role assignment failure", keycloakId);
                } catch (Exception ex) {
                    log.error("Failed to rollback Keycloak user {}", keycloakId, ex);
                }
                throw new RuntimeException("Không thể gán vai trò cho tài khoản trên Keycloak: " + e.getMessage());
            }

            return keycloakId;
        } else if (status == 409) {
            log.warn("Conflict creating Keycloak user: email={} already exists", email);
            throw new IllegalArgumentException("Email hoặc tên đăng nhập đã tồn tại trên hệ thống xác thực Keycloak!");
        } else {
            String body = response.readEntity(String.class);
            log.error("Failed to create Keycloak user. Status: {}, Body: {}", status, body);
            throw new RuntimeException("Lỗi tạo tài khoản trên Keycloak: status=" + status + ", body=" + body);
        }
    }

    @Override
    public void deleteUser(String keycloakId) {
        String targetRealm = this.realmTarget;
        log.info("Deleting user from Keycloak: keycloakId={}, targetRealm={}", keycloakId, targetRealm);
        try {
            keycloak.realm(targetRealm).users().get(keycloakId).remove();
            log.info("Successfully deleted user from Keycloak with ID: {}", keycloakId);
        } catch (Exception e) {
            log.error("Failed to delete user {} from Keycloak", keycloakId, e);
        }
    }
}
