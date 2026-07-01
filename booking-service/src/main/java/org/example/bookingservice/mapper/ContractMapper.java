package org.example.bookingservice.mapper;

import org.example.bookingservice.dto.response.ContractDto;
import org.example.bookingservice.entity.Contract;
import org.example.bookingservice.entity.CareRequest;

public class ContractMapper {
    public static ContractDto toDto(Contract c, String patientName) {
        if (c == null)
            return null;
        CareRequest r = c.getCareRequest();
        return new ContractDto(
                c.getId(),
                r.getId(),
                c.getStatus(),
                c.getContractUrl(),
                c.getCreatedAt(),
                c.getSignedAt(),
                patientName,
                r.getCareService().getName(),
                r.getTotalPrice() != null ? r.getTotalPrice().doubleValue() : null);
    }
}
