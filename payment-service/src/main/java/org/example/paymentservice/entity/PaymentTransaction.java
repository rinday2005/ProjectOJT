package org.example.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mối quan hệ N-1 vật lý ngược về bảng Payment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(name = "transaction_id", length = 100)
    private String transactionId; // Mã giao dịch trả về từ cổng thanh toán (VNPAY/MOMO)

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 20)
    private String status; // 'SUCCESS', 'FAILED'

    @Column(name = "response_code", length = 20)
    private String responseCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
