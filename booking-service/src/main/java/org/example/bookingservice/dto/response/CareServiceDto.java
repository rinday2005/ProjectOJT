package org.example.bookingservice.dto.response;

public record CareServiceDto(
                Long id,
                String name,
                String description,
                Double basePrice,
                String tier,
                String image,
                String category,
                String skillLevel,
                String durationAllowed,
                String bookingType) {
}
