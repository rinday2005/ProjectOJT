package org.example.userservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.request.PatientRequest;
import org.example.userservice.dto.response.PatientDto;
import org.example.userservice.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<PatientDto> createPatient(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody PatientRequest request) {
        PatientDto created = patientService.createPatient(jwt.getSubject(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDto> updatePatient(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {
        PatientDto updated = patientService.updatePatient(jwt.getSubject(), id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDto> getPatientById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        PatientDto patient = patientService.getPatientById(jwt.getSubject(), id);
        return ResponseEntity.ok(patient);
    }

    @GetMapping
    public ResponseEntity<List<PatientDto>> getPatients(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String currentCondition,
            @RequestParam(required = false) Long familyId) {
        List<PatientDto> patients = patientService.getPatients(jwt.getSubject(), name, status, currentCondition,
                familyId);
        return ResponseEntity.ok(patients);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {
        patientService.deletePatient(jwt.getSubject(), id);
        return ResponseEntity.noContent().build();
    }
}
