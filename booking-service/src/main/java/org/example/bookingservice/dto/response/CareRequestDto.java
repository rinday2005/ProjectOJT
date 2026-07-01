package org.example.bookingservice.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public record CareRequestDto(
                Long id,
                Long familyId,
                Long patientId,
                String patientName,
                Long serviceId,
                String serviceName,
                LocalDate startDate,
                LocalDate endDate,
                LocalTime startTime,
                LocalTime endTime,
                String notes,
                String type,
                String address,
                Double totalPrice,
                String status,
                Long caregiverId,
                String assignedCaregiverName,
                LocalDateTime createdAt,
                Long contractId,
                String contractStatus) {
}
