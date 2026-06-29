package org.example.userservice.service;

import org.example.userservice.dto.request.PatientRequest;
import org.example.userservice.dto.response.PatientDto;

import java.util.List;

public interface PatientService {
    PatientDto createPatient(String keycloakId, PatientRequest request);

    PatientDto updatePatient(String keycloakId, Long id, PatientRequest request);

    PatientDto getPatientById(String keycloakId, Long id);

    List<PatientDto> getPatients(String keycloakId, String name, String status, String currentCondition, Long familyId);

    void deletePatient(String keycloakId, Long id);
}
