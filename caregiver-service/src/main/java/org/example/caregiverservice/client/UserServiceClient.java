package org.example.caregiverservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.caregiverservice.dto.response.UserDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserServiceClient {

    private final RestTemplate restTemplate;
    private static final String USER_SERVICE_URL = "http://localhost:8081/api/v1/users";

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth instanceof JwtAuthenticationToken jwtAuth) {
                headers.setBearerAuth(jwtAuth.getToken().getTokenValue());
            }
        } catch (Exception e) {
            log.warn("Failed to propagate Security Context JWT to User Service client request", e);
        }
        return headers;
    }

    public List<UserDto> getAllUsers() {
        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
        try {
            ResponseEntity<List<UserDto>> response = restTemplate.exchange(
                    USER_SERVICE_URL,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<UserDto>>() {
                    });
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to fetch users from user-service", e);
            return Collections.emptyList();
        }
    }

    public UserDto getUserById(Long id) {
        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
        try {
            ResponseEntity<UserDto> response = restTemplate.exchange(
                    USER_SERVICE_URL + "/" + id,
                    HttpMethod.GET,
                    entity,
                    UserDto.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to fetch user by ID {} from user-service", id, e);
            return null;
        }
    }

    public UserDto createUser(UserDto userDto) {
        HttpEntity<UserDto> entity = new HttpEntity<>(userDto, createHeaders());
        try {
            ResponseEntity<UserDto> response = restTemplate.exchange(
                    USER_SERVICE_URL,
                    HttpMethod.POST,
                    entity,
                    UserDto.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to create user in user-service", e);
            throw handleException("tạo tài khoản người dùng", e);
        }
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        HttpEntity<UserDto> entity = new HttpEntity<>(userDto, createHeaders());
        try {
            ResponseEntity<UserDto> response = restTemplate.exchange(
                    USER_SERVICE_URL + "/" + id,
                    HttpMethod.PUT,
                    entity,
                    UserDto.class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to update user in user-service", e);
            throw handleException("cập nhật tài khoản người dùng", e);
        }
    }

    public void deleteUser(Long id) {
        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());
        try {
            restTemplate.exchange(
                    USER_SERVICE_URL + "/" + id,
                    HttpMethod.DELETE,
                    entity,
                    Void.class);
        } catch (Exception e) {
            log.error("Failed to delete user in user-service", e);
            throw handleException("xóa tài khoản người dùng", e);
        }
    }

    private RuntimeException handleException(String action, Exception e) {
        if (e instanceof org.springframework.web.client.HttpStatusCodeException httpEx) {
            String responseBody = httpEx.getResponseBodyAsString();
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode node = mapper.readTree(responseBody);
                if (node.has("message")) {
                    return new IllegalArgumentException(node.get("message").asText());
                }
            } catch (Exception ex) {
                // Ignore and fallback
            }
        }
        return new RuntimeException("Lỗi " + action + ": " + e.getMessage(), e);
    }
}
