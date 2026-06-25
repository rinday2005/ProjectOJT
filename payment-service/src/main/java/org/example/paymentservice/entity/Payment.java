package org.example.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId; // ID logic nối sang booking-service

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 20)
    private String status; // 'UNPAID', 'PAID', 'FAILED', 'REFUNDED'

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // 'VNPAY', 'MOMO', 'BANK_TRANSFER'

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Version
    @Column(nullable = false)
    private Long version;

    // Mối quan hệ 1-N vật lý với các Giao dịch nhỏ
    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PaymentTransaction> transactions;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "UNPAID";
        if (this.version == null) this.version = 0L;
    }
}
