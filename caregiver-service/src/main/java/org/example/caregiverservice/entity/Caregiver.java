package org.example.caregiverservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "caregivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Caregiver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;

    private String specialization;

    @Column(name = "experience_years", nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    @Column(name = "hourly_rate", nullable = false)
    @Builder.Default
    private java.math.BigDecimal hourlyRate = java.math.BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private String status = "Offline"; // 'Online', 'On-Duty', 'Offline'

    @Column(name = "average_rating", nullable = false)
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(name = "total_reviews", nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "certifications_verified", nullable = false)
    @Builder.Default
    private boolean certificationsVerified = false;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;
}
