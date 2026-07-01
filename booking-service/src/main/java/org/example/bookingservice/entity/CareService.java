package org.example.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "care_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal basePrice;

    @Column(nullable = false, length = 20)
    private String tier;

    @Column(length = 500)
    private String image;

    @Column(length = 100)
    private String category;

    @Column(name = "skill_level", length = 50)
    private String skillLevel;

    @Column(name = "duration_allowed", length = 100)
    private String durationAllowed;

    @Column(name = "booking_type", nullable = false, length = 50)
    private String bookingType;
}
