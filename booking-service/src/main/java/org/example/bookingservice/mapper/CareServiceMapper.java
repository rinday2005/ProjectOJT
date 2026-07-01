package org.example.bookingservice.mapper;

import org.example.bookingservice.dto.response.CareServiceDto;
import org.example.bookingservice.entity.CareService;

public class CareServiceMapper {
    public static CareServiceDto toDto(CareService s) {
        if (s == null)
            return null;
        return new CareServiceDto(
                s.getId(),
                s.getName(),
                s.getDescription(),
                s.getBasePrice() != null ? s.getBasePrice().doubleValue() : null,
                s.getTier(),
                s.getImage(),
                s.getCategory(),
                s.getSkillLevel(),
                s.getDurationAllowed(),
                s.getBookingType());
    }
}
