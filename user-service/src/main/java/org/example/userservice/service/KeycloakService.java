package org.example.userservice.service;

public interface KeycloakService {
    String createUser(String email, String password, String fullName, String phone, String role);

    void deleteUser(String keycloakId);
}
