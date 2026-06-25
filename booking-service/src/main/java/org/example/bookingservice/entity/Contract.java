package org.example.bookingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ 1-1 vật lý ngược về CareRequest
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "care_request_id", nullable = false, unique = true)
    private CareRequest careRequest;

    @Column(name = "contract_url", length = 500)
    private String contractUrl;

    @Column(nullable = false, length = 20)
    private String status; // 'PENDING', 'SIGNED', 'VOIDED'

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "PENDING";
    }
}
