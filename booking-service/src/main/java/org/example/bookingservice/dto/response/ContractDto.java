package org.example.bookingservice.dto.response;

import java.time.LocalDateTime;

public record ContractDto(
                Long id,
                Long careRequestId,
                String status,
                String contractUrl,
                LocalDateTime createdAt,
                LocalDateTime signedAt,
                String patientName,
                String serviceName,
                Double totalPrice) {
}
