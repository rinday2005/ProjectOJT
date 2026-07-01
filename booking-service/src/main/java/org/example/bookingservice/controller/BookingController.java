package org.example.bookingservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.bookingservice.dto.request.*;
import org.example.bookingservice.dto.response.*;
import org.example.bookingservice.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/services")
    public ResponseEntity<List<CareServiceDto>> getAllServices() {
        return ResponseEntity.ok(bookingService.getAllServices());
    }

    @PostMapping("/care-requests")
    public ResponseEntity<CareRequestDto> createCareRequest(
            @RequestHeader("Authorization") String token,
            @jakarta.validation.Valid @RequestBody CreateCareRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createCareRequest(token, request));
    }

    @GetMapping("/care-requests/my")
    public ResponseEntity<List<CareRequestDto>> getFamilyRequests(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(bookingService.getFamilyRequests(token));
    }

    @GetMapping("/care-requests")
    public ResponseEntity<List<CareRequestDto>> getAllRequests(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(bookingService.getAllRequests(token));
    }

    @GetMapping("/care-requests/{id}")
    public ResponseEntity<CareRequestDto> getRequestById(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getRequestById(token, id));
    }

    @PutMapping("/care-requests/{id}/status")
    public ResponseEntity<CareRequestDto> updateRequestStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateRequestStatus(token, id, status));
    }

    @PutMapping("/care-requests/{id}/assign")
    public ResponseEntity<CareRequestDto> assignCaregiver(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestParam Long caregiverId) {
        return ResponseEntity.ok(bookingService.assignCaregiver(token, id, caregiverId));
    }

    @GetMapping("/caregivers/{id}/availability")
    public ResponseEntity<CaregiverAvailabilityDto> checkCaregiverAvailability(
            @PathVariable Long id,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        return ResponseEntity.ok(bookingService.checkCaregiverAvailability(id, date, startTime, endTime));
    }

    @GetMapping("/contracts/my")
    public ResponseEntity<List<ContractDto>> getFamilyContracts(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(bookingService.getFamilyContracts(token));
    }

    @GetMapping("/contracts")
    public ResponseEntity<List<ContractDto>> getAllContracts(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(bookingService.getAllContracts(token));
    }

    @PutMapping("/contracts/{id}/sign")
    public ResponseEntity<ContractDto> signContract(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.signContract(token, id));
    }

    @PutMapping("/contracts/{id}/approve")
    public ResponseEntity<ContractDto> approveContract(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveContract(token, id));
    }

    @GetMapping(value = "/contracts/{id}/html", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getContractHtml(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getContractHtml(token, id));
    }
}
