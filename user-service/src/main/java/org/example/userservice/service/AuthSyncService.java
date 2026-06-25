package org.example.userservice.service;

import org.springframework.security.oauth2.jwt.Jwt;

public interface AuthSyncService {
    void syncUser(Jwt jwt);
}
