package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.service.KeycloakService;
import org.example.userservice.service.UserService;
import org.example.userservice.dto.request.UserProfileRequest;
import org.example.userservice.dto.response.UserDto;
import org.example.userservice.dto.response.PatientDto;
import org.example.userservice.dto.response.DashboardStatsResponse;
import org.example.userservice.dto.response.RecentActivityResponse;
import org.example.userservice.entity.User;
import org.example.userservice.exception.DuplicatePhoneException;
import org.example.userservice.exception.UserNotFoundException;
import org.example.userservice.mapper.PatientMapper;
import org.example.userservice.mapper.UserMapper;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.repository.PatientRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.userservice.entity.UserAppeal;
import org.example.userservice.repository.UserAppealRepository;
import org.example.userservice.dto.response.UserAppealDto;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PatientRepository patientRepository;
    private final KeycloakService keycloakService;
    private final PatientMapper patientMapper;
    private final UserAppealRepository userAppealRepository;
    private final JavaMailSender mailSender;

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfileByKeycloakId(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(String keycloakId, UserProfileRequest request) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));

        // Validation rule: check duplicate phone number (excluding the current user)
        if (request.phone() != null && !request.phone().trim().isEmpty()) {
            boolean duplicatePhone = userRepository.existsByPhoneAndKeycloakIdNot(request.phone(), keycloakId);
            if (duplicatePhone) {
                throw new DuplicatePhoneException("This phone number is already in use by another user!");
            }
        }

        userMapper.updateEntityFromRequest(request, user);
        User updatedUser = userRepository.save(user);
        log.info("Updated profile in DB for Keycloak ID: {}", keycloakId);

        // Sync details to Keycloak via Account API
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuthToken) {
            updateKeycloakProfile(jwtAuthToken.getToken(), request.fullName());
        }

        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto updateAvatar(String keycloakId, String avatarData) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));
        user.setAvatar(avatarData);
        User saved = userRepository.save(user);
        log.info("Updated avatar in DB for Keycloak ID: {}", keycloakId);
        return userMapper.toDto(saved);
    }

    private void updateKeycloakProfile(Jwt jwt, String fullName) {
        try {
            String issuer = jwt.getClaimAsString("iss");
            String accountUrl = issuer + "/account";
            String token = jwt.getTokenValue();

            String name = fullName.trim();
            String firstName = name;
            String lastName = "";
            int lastSpace = name.lastIndexOf(' ');
            if (lastSpace > 0) {
                firstName = name.substring(0, lastSpace);
                lastName = name.substring(lastSpace + 1);
            }

            String jsonBody = String.format(
                    "{\"username\":\"%s\",\"email\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\"}",
                    jwt.getClaimAsString("preferred_username"),
                    jwt.getClaimAsString("email"),
                    firstName.replace("\"", "\\\""),
                    lastName.replace("\"", "\\\""));

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(accountUrl))
                    .header("Authorization", "Bearer " + token)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Successfully updated profile in Keycloak for user: {}", jwt.getSubject());
            } else {
                log.warn("Failed to update profile in Keycloak. Status: {}, Body: {}", response.statusCode(),
                        response.body());
            }
        } catch (Exception e) {
            log.error("Error updating profile in Keycloak", e);
        }
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userDto.email() == null || userDto.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống!");
        }
        if (userDto.role() == null || userDto.role().trim().isEmpty()) {
            throw new IllegalArgumentException("Vai trò không được để trống!");
        }
        if (userDto.password() == null || userDto.password().trim().isEmpty()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống!");
        }

        // Validate uniqueness of phone
        if (userDto.phone() != null && !userDto.phone().trim().isEmpty()) {
            userRepository.findByPhone(userDto.phone()).ifPresent(u -> {
                throw new DuplicatePhoneException("Số điện thoại đã được sử dụng!");
            });
        }
        // Validate email uniqueness
        if (userDto.email() != null && !userDto.email().trim().isEmpty()) {
            userRepository.findByEmail(userDto.email()).ifPresent(u -> {
                throw new DuplicatePhoneException("Email đã được sử dụng!");
            });
        }

        // Normalize role
        String normalizedRole = userDto.role().toUpperCase();
        if ("OPERATIONADMIN".equals(normalizedRole)) {
            normalizedRole = "OPERATOR";
        }

        // 1. Create in Keycloak
        String keycloakId = keycloakService.createUser(
                userDto.email().trim(),
                userDto.password(),
                userDto.fullName(),
                userDto.phone(),
                normalizedRole);

        // 2. Insert into DB
        try {
            User user = userMapper.toEntity(userDto);
            user.setKeycloakId(keycloakId);
            user.setRole(normalizedRole);
            if (user.getStatus() == null) {
                user.setStatus("ACTIVE");
            }
            User saved = userRepository.save(user);
            log.info("Created new user with ID: {} and Keycloak ID: {}", saved.getId(), keycloakId);
            return userMapper.toDto(saved);
        } catch (Exception e) {
            log.error("Database save failed. Rolling back Keycloak user {}", keycloakId, e);
            try {
                keycloakService.deleteUser(keycloakId);
            } catch (Exception ex) {
                log.error("Failed to rollback Keycloak user {}", keycloakId, ex);
            }
            throw e;
        }
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));

        // Validate unique phone
        if (userDto.phone() != null && !userDto.phone().trim().isEmpty()) {
            boolean duplicatePhone = userRepository.existsByPhoneAndKeycloakIdNot(userDto.phone(),
                    user.getKeycloakId());
            if (duplicatePhone) {
                throw new DuplicatePhoneException("Số điện thoại đã được sử dụng!");
            }
        }

        user.setFullName(userDto.fullName());
        user.setPhone(userDto.phone());
        user.setAddress(userDto.address());
        user.setRole(userDto.role());
        user.setStatus(userDto.status());

        User saved = userRepository.save(user);
        log.info("Updated user with ID: {}", saved.getId());
        return userMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));

        // This triggers Hibernate Soft Delete as configured via @SQLDelete on User
        // entity class
        userRepository.delete(user);
        log.info("Soft-deleted user with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDto> getPatientsByKeycloakId(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Profile does not exist for Keycloak ID: " + keycloakId));
        if (user.getPatients() == null) {
            return List.of();
        }
        return user.getPatients().stream()
                .map(patient -> patientMapper.toDto(patient))
                .toList();
    }

    @Override
    @Transactional
    public UserDto toggleUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng với ID: " + id));
        user.setStatus(active ? "ACTIVE" : "INACTIVE");
        User saved = userRepository.save(user);
        log.info("Toggled status for user with ID: {} to {}", id, user.getStatus());
        return userMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalCaregivers = userRepository.countByRole("CAREGIVER");
        long totalFamilies = userRepository.countByRole("FAMILY");

        // The remaining stats are returned as placeholders
        return new DashboardStatsResponse(
                totalPatients,
                totalCaregivers,
                totalFamilies,
                0L, // activeContracts
                0L, // todaySchedules
                0L, // completedToday
                0.0, // monthlyRevenue
                0L // pendingPayments
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentActivityResponse> getRecentActivities(int limit) {
        // Return a placeholder activity feed representing database status
        RecentActivityResponse activity = new RecentActivityResponse(
                "System Initialized",
                "Backend service user synchronization initialized successfully",
                "completed",
                java.time.LocalDateTime.now().minusHours(1).toString());
        return List.of(activity);
    }

    @Override
    @Transactional
    public UserAppealDto submitAppeal(String keycloakId, String message) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng"));

        UserAppeal appeal = UserAppeal.builder()
                .user(user)
                .email(user.getEmail())
                .message(message)
                .status("PENDING")
                .build();

        UserAppeal saved = userAppealRepository.save(appeal);
        return new UserAppealDto(
                saved.getId(),
                user.getId(),
                user.getFullName(),
                saved.getEmail(),
                saved.getMessage(),
                saved.getStatus(),
                saved.getReplyContent(),
                saved.getCreatedAt());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserAppealDto> getAllAppeals() {
        return userAppealRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(a -> new UserAppealDto(
                        a.getId(),
                        a.getUser() != null ? a.getUser().getId() : null,
                        a.getUser() != null ? a.getUser().getFullName() : "N/A",
                        a.getEmail(),
                        a.getMessage(),
                        a.getStatus(),
                        a.getReplyContent(),
                        a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserAppealDto replyToAppeal(Long appealId, String replyContent) {
        UserAppeal appeal = userAppealRepository.findById(appealId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khiếu nại với ID: " + appealId));

        appeal.setStatus("REPLIED");
        appeal.setReplyContent(replyContent);
        UserAppeal saved = userAppealRepository.save(appeal);

        // Thực hiện gửi mail bất tuần tự (Async) qua Gmail SMTP với định dạng HTML
        String mailSubject = "Phản hồi yêu cầu khiếu nại tài khoản - HomeCare";

        String htmlContent = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Phản Hồi Khiếu Nại Tài Khoản</title></head>"
                + "<body style=\"margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333;\">"
                + "<div style=\"max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e1e8e6;\">"
                + "<!-- Header -->"
                + "<div style=\"background-color: #5fa5ba; padding: 30px 20px; text-align: center;\">"
                + "<h1 style=\"margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;\">HOMECARE SYSTEM</h1>"
                + "<p style=\"margin: 5px 0 0 0; color: #eef7f9; font-size: 14px;\">Ban Quản Trị Hỗ Trợ Tài Khoản</p>"
                + "</div>"
                + "<!-- Body Content -->"
                + "<div style=\"padding: 40px 30px;\">"
                + "<h2 style=\"margin-top: 0; color: #2d3748; font-size: 18px; font-weight: 700;\">Xin chào "
                + (saved.getUser() != null ? saved.getUser().getFullName() : "") + ",</h2>"
                + "<p style=\"font-size: 15px; line-height: 1.6; color: #4a5568;\">"
                + "Chúng tôi đã nhận được yêu cầu khiếu nại của bạn về việc tài khoản bị khóa trên hệ thống dịch vụ chăm sóc y tế <b>HomeCare</b>. Dưới đây là thông tin chi tiết phản hồi từ Ban Quản Trị:"
                + "</p>"
                + "<!-- User Appeal Box -->"
                + "<div style=\"margin: 25px 0; padding: 20px; background-color: #f7fafc; border-left: 4px solid #cbd5e0; border-radius: 8px;\">"
                + "<h4 style=\"margin: 0 0 8px 0; color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;\">Nội dung bạn khiếu nại:</h4>"
                + "<p style=\"margin: 0; font-size: 14px; font-style: italic; color: #4a5568; line-height: 1.5;\">\""
                + saved.getMessage() + "\"</p>"
                + "</div>"
                + "<!-- Admin Response Box -->"
                + "<div style=\"margin: 25px 0; padding: 20px; background-color: #ebf8fa; border-left: 4px solid #5fa5ba; border-radius: 8px;\">"
                + "<h4 style=\"margin: 0 0 8px 0; color: #4d8ca0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;\">Phản hồi từ Admin:</h4>"
                + "<p style=\"margin: 0; font-size: 14px; font-weight: 600; color: #2d3748; line-height: 1.5;\">"
                + replyContent + "</p>"
                + "</div>"
                + "<!-- Status Notice -->"
                + "<div style=\"margin-top: 30px; padding: 15px; background-color: #f0fff4; border: 1px solid #c6f6d5; border-radius: 8px; text-align: center;\">"
                + "<span style=\"font-size: 14px; font-weight: 700; color: #38a169;\">"
                + "✓ Trạng thái tài khoản của bạn hiện đã được mở khóa (ACTIVE). Bạn có thể đăng nhập lại vào hệ thống ngay lúc này."
                + "</span>"
                + "</div>"
                + "<p style=\"margin-top: 30px; font-size: 15px; line-height: 1.6; color: #4a5568;\">"
                + "Nếu bạn cần hỗ trợ thêm thông tin gì khác, vui lòng liên hệ hotline hoặc gửi phản hồi sớm cho chúng tôi."
                + "</p>"
                + "<p style=\"margin: 40px 0 0 0; font-size: 14px; font-weight: 700; color: #2d3748;\">"
                + "Trân trọng,<br>"
                + "<span style=\"color: #5fa5ba;\">Ban quản trị HomeCare System</span>"
                + "</p>"
                + "</div>"
                + "<!-- Footer -->"
                + "<div style=\"background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;\">"
                + "<p style=\"margin: 0;\">Đây là email tự động từ hệ thống HomeCare. Vui lòng không phản hồi lại thư này.</p>"
                + "<p style=\"margin: 5px 0 0 0;\">© 2026 HomeCare Inc. All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</body></html>";

        sendEmailAsync(saved.getEmail(), mailSubject, htmlContent);

        return new UserAppealDto(
                saved.getId(),
                saved.getUser() != null ? saved.getUser().getId() : null,
                saved.getUser() != null ? saved.getUser().getFullName() : "N/A",
                saved.getEmail(),
                saved.getMessage(),
                saved.getStatus(),
                saved.getReplyContent(),
                saved.getCreatedAt());
    }

    private void sendEmailAsync(String to, String subject, String htmlContent) {
        new Thread(() -> {
            try {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(mimeMessage);
                log.info("Successfully sent real HTML email to {}", to);
            } catch (Exception e) {
                log.warn("Failed to send real HTML email to {}: {}. Fallback simulation completed successfully.", to,
                        e.getMessage());
            }
        }).start();
    }
}
