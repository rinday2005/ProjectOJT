package org.example.bookingservice.mapper;

import org.example.bookingservice.dto.response.CareRequestDto;
import org.example.bookingservice.entity.CareRequest;

public class CareRequestMapper {
    public static CareRequestDto toDto(CareRequest r, String patientName, String caregiverName) {
        if (r == null)
            return null;
        return new CareRequestDto(
                r.getId(),
                r.getFamilyId(),
                r.getPatientId(),
                patientName,
                r.getCareService().getId(),
                r.getCareService().getName(),
                r.getStartDate(),
                r.getEndDate(),
                r.getStartTime(),
                r.getEndTime(),
                r.getNotes(),
                r.getType(),
                r.getAddress(),
                r.getTotalPrice() != null ? r.getTotalPrice().doubleValue() : null,
                r.getStatus(),
                r.getCaregiverId(),
                caregiverName,
                r.getCreatedAt(),
                r.getContract() != null ? r.getContract().getId() : null,
                r.getContract() != null ? r.getContract().getStatus() : null);
    }
}
