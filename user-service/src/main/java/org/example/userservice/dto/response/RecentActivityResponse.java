package org.example.userservice.dto.response;

public record RecentActivityResponse(
    String type,
    String description,
    String status,
    String timestamp
) {}
