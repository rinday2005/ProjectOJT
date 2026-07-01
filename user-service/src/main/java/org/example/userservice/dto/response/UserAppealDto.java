package org.example.userservice.dto.response;

import java.time.LocalDateTime;

public record UserAppealDto(
                Long id,
                Long userId,
                String userFullName,
                String email,
                String message,
                String status,
                String replyContent,
                LocalDateTime createdAt) {
}
