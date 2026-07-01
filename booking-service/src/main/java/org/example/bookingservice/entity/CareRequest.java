package org.example.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "care_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "family_id", nullable = false)
    private Long familyId; // ID logic nối sang user-service

    @Column(name = "patient_id", nullable = false)
    private Long patientId; // ID logic nối sang user-service

    @Column(name = "caregiver_id")
    private Long caregiverId; // ID logic nối sang caregiver-service

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private CareService careService;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 50)
    private String type; // 'One-time', 'Recurring'

    @Column(length = 255)
    private String address;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private java.math.BigDecimal totalPrice;

    @Column(nullable = false, length = 20)
    private String status; // 'Pending', 'Approved', 'Rejected', 'AwaitingPayment', 'Paid', 'Completed',
                           // 'Cancelled'

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Version
    @Column(nullable = false)
    private Long version;

    // Mối quan hệ 1-1 với Contract
    @OneToOne(mappedBy = "careRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Contract contract;

    // Mối quan hệ 1-N với Schedules
    @OneToMany(mappedBy = "careRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Schedule> schedules;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null)
            this.status = "Pending";
        if (this.version == null)
            this.version = 0L;
    }
}
