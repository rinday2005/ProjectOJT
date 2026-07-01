package org.example.caregiverservice.service;

import org.example.caregiverservice.dto.request.CaregiverRequest;
import org.example.caregiverservice.dto.response.CaregiverDto;
import java.util.List;

public interface CaregiverService {
    List<CaregiverDto> getCaregivers();

    CaregiverDto getCaregiverById(Long id);

    CaregiverDto createCaregiver(CaregiverRequest request);

    CaregiverDto updateCaregiver(Long id, CaregiverRequest request);

    void deleteCaregiver(Long id);

    CaregiverDto verifyCertifications(Long id, boolean verified);

    CaregiverDto updateSkillsAndAvailability(Long id, String skills, String status);

    Double calculateCaregiverRanking(Long id);
}
