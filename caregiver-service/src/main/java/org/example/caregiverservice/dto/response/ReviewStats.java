package org.example.caregiverservice.dto.response;

public record ReviewStats(
        Long caregiverId,
        Double averageRating,
        Long reviewCount) {
    // Constructor to ensure null-safety
    public ReviewStats {
        if (averageRating == null)
            averageRating = 0.0;
        if (reviewCount == null)
            reviewCount = 0L;
    }
}
