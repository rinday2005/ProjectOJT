package org.example.caregiverservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.caregiverservice.dto.request.CaregiverRequest;
import org.example.caregiverservice.dto.response.CaregiverDto;
import org.example.caregiverservice.service.CaregiverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/caregiver")
@RequiredArgsConstructor
public class CaregiverController {

    private final CaregiverService caregiverService;

    @GetMapping
    public ResponseEntity<List<CaregiverDto>> getCaregivers() {
        return ResponseEntity.ok(caregiverService.getCaregivers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CaregiverDto> getCaregiverById(@PathVariable Long id) {
        return ResponseEntity.ok(caregiverService.getCaregiverById(id));
    }

    @PostMapping
    public ResponseEntity<CaregiverDto> createCaregiver(@Valid @RequestBody CaregiverRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(caregiverService.createCaregiver(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CaregiverDto> updateCaregiver(
            @PathVariable Long id,
            @Valid @RequestBody CaregiverRequest request) {
        return ResponseEntity.ok(caregiverService.updateCaregiver(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCaregiver(@PathVariable Long id) {
        caregiverService.deleteCaregiver(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/verify-certifications")
    public ResponseEntity<CaregiverDto> verifyCertifications(
            @PathVariable Long id,
            @RequestParam boolean verified) {
        return ResponseEntity.ok(caregiverService.verifyCertifications(id, verified));
    }

    @PutMapping("/{id}/operator-update")
    public ResponseEntity<CaregiverDto> updateSkillsAndAvailability(
            @PathVariable Long id,
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(caregiverService.updateSkillsAndAvailability(id, skills, status));
    }

    @GetMapping("/{id}/ranking")
    public ResponseEntity<Double> getCaregiverRanking(@PathVariable Long id) {
        return ResponseEntity.ok(caregiverService.calculateCaregiverRanking(id));
    }
}