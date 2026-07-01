package org.example.bookingservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.bookingservice.client.CaregiverServiceClient;
import org.example.bookingservice.client.UserServiceClient;
import org.example.bookingservice.dto.request.*;
import org.example.bookingservice.dto.response.*;
import org.example.bookingservice.entity.CareRequest;
import org.example.bookingservice.entity.CareService;
import org.example.bookingservice.entity.Contract;
import org.example.bookingservice.entity.Schedule;
import org.example.bookingservice.exception.CaregiverConflictException;
import org.example.bookingservice.exception.ResourceNotFoundException;
import org.example.bookingservice.mapper.CareRequestMapper;
import org.example.bookingservice.mapper.CareServiceMapper;
import org.example.bookingservice.mapper.ContractMapper;
import org.example.bookingservice.repository.CareRequestRepository;
import org.example.bookingservice.repository.CareServiceRepository;
import org.example.bookingservice.repository.ContractRepository;
import org.example.bookingservice.repository.ScheduleRepository;
import org.example.bookingservice.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final CareServiceRepository careServiceRepository;
    private final CareRequestRepository careRequestRepository;
    private final ContractRepository contractRepository;
    private final ScheduleRepository scheduleRepository;

    private final UserServiceClient userServiceClient;
    private final CaregiverServiceClient caregiverServiceClient;

    @Override
    public List<CareServiceDto> getAllServices() {
        return careServiceRepository.findAll().stream()
                .map(CareServiceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CareRequestDto createCareRequest(String token, CreateCareRequest request) {
        UserDto profile;
        try {
            profile = userServiceClient.getMyProfile(token);
        } catch (Exception e) {
            log.error("Failed to retrieve user profile via Feign client", e);
            throw new ResourceNotFoundException("Failed to authenticate family user profile");
        }

        CareService service = careServiceRepository.findById(request.getResolvedServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Care service not found"));

        LocalDate date = LocalDate.parse(request.getResolvedDate());
        LocalTime startTime = parseLocalTime(request.getResolvedStartTime());
        int duration = request.getDuration() != null ? request.getDuration() : 2;
        LocalTime endTime = startTime.plusHours(duration);

        double totalPriceVal = (service.getBasePrice() != null ? service.getBasePrice().doubleValue() : 0.0) * duration;
        java.math.BigDecimal totalPrice = java.math.BigDecimal.valueOf(totalPriceVal);

        CareRequest careRequest = CareRequest.builder()
                .familyId(profile.id())
                .patientId(request.getResolvedPatientId())
                .careService(service)
                .startDate(date)
                .endDate(date)
                .startTime(startTime)
                .endTime(endTime)
                .notes(request.getResolvedNotes())
                .type(request.getType() != null ? request.getType() : "One-time")
                .address(request.getAddress())
                .totalPrice(totalPrice)
                .status("Pending")
                .build();

        CareRequest saved = careRequestRepository.save(careRequest);
        String patientName = getPatientName(token, saved.getPatientId());

        return CareRequestMapper.toDto(saved, patientName, null);
    }

    @Override
    public List<CareRequestDto> getFamilyRequests(String token) {
        UserDto profile = getMyProfile(token);
        List<CareRequest> requests = careRequestRepository.findByFamilyId(profile.id());

        return requests.stream()
                .map(r -> {
                    String patientName = getPatientName(token, r.getPatientId());
                    String caregiverName = getCaregiverName(token, r.getCaregiverId());
                    return CareRequestMapper.toDto(r, patientName, caregiverName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CareRequestDto> getAllRequests(String token) {
        List<CareRequest> requests = careRequestRepository.findAll();
        return requests.stream()
                .map(r -> {
                    String patientName = getPatientName(token, r.getPatientId());
                    String caregiverName = getCaregiverName(token, r.getCaregiverId());
                    return CareRequestMapper.toDto(r, patientName, caregiverName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public CareRequestDto getRequestById(String token, Long id) {
        CareRequest r = careRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        String patientName = getPatientName(token, r.getPatientId());
        String caregiverName = getCaregiverName(token, r.getCaregiverId());
        return CareRequestMapper.toDto(r, patientName, caregiverName);
    }

    @Override
    @Transactional
    public CareRequestDto updateRequestStatus(String token, Long id, String status) {
        CareRequest r = careRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        r.setStatus(status);

        if ("Approved".equalsIgnoreCase(status) && r.getContract() == null) {
            Contract contract = Contract.builder()
                    .careRequest(r)
                    .status("PENDING")
                    .contractUrl("/api/v1/bookings/contracts/" + r.getId() + "/html")
                    .build();
            contractRepository.save(contract);
            r.setContract(contract);
        }

        CareRequest saved = careRequestRepository.save(r);
        String patientName = getPatientName(token, saved.getPatientId());
        String caregiverName = getCaregiverName(token, saved.getCaregiverId());
        return CareRequestMapper.toDto(saved, patientName, caregiverName);
    }

    @Override
    @Transactional
    public CareRequestDto assignCaregiver(String token, Long id, Long caregiverId) {
        CareRequest r = careRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        CaregiverAvailabilityDto availability = checkCaregiverAvailability(
                caregiverId,
                r.getStartDate().toString(),
                r.getStartTime().toString(),
                r.getEndTime().toString());

        if (!availability.available()) {
            throw new CaregiverConflictException("Caregiver Conflict: " + availability.conflictReason());
        }

        r.setCaregiverId(caregiverId);

        if ("Pending".equalsIgnoreCase(r.getStatus())) {
            r.setStatus("Approved");
        }

        if (r.getContract() == null) {
            Contract contract = Contract.builder()
                    .careRequest(r)
                    .status("PENDING")
                    .contractUrl("/api/v1/bookings/contracts/" + r.getId() + "/html")
                    .build();
            contractRepository.save(contract);
            r.setContract(contract);
        }

        CareRequest saved = careRequestRepository.save(r);
        String patientName = getPatientName(token, saved.getPatientId());
        String caregiverName = getCaregiverName(token, saved.getCaregiverId());
        return CareRequestMapper.toDto(saved, patientName, caregiverName);
    }

    @Override
    public CaregiverAvailabilityDto checkCaregiverAvailability(Long caregiverId, String dateStr, String startTimeStr,
            String endTimeStr) {
        LocalDate date = LocalDate.parse(dateStr);
        LocalTime startTime = parseLocalTime(startTimeStr);
        LocalTime endTime = parseLocalTime(endTimeStr);

        List<Schedule> caregiverSchedules = scheduleRepository.findByCaregiverIdAndWorkDate(caregiverId, date);

        for (Schedule s : caregiverSchedules) {
            if (startTime.isBefore(s.getEndTime()) && endTime.isAfter(s.getStartTime())) {
                String reason = String.format("Conflict with schedule #%d (%s - %s)", s.getId(), s.getStartTime(),
                        s.getEndTime());
                return new CaregiverAvailabilityDto(caregiverId, date, false, reason);
            }
        }

        return new CaregiverAvailabilityDto(caregiverId, date, true, "Available");
    }

    @Override
    public List<ContractDto> getFamilyContracts(String token) {
        UserDto profile = getMyProfile(token);
        List<Contract> contracts = contractRepository.findByCareRequestFamilyId(profile.id());
        return contracts.stream()
                .map(c -> {
                    String patientName = getPatientName(token, c.getCareRequest().getPatientId());
                    return ContractMapper.toDto(c, patientName);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ContractDto> getAllContracts(String token) {
        List<Contract> contracts = contractRepository.findAll();
        return contracts.stream()
                .map(c -> {
                    String patientName = getPatientName(token, c.getCareRequest().getPatientId());
                    return ContractMapper.toDto(c, patientName);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ContractDto signContract(String token, Long id) {
        Contract c = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        c.setStatus("SIGNED");
        c.setSignedAt(LocalDateTime.now());

        CareRequest req = c.getCareRequest();
        req.setStatus("Assigned");
        careRequestRepository.save(req);

        if (req.getCaregiverId() != null) {
            Schedule schedule = Schedule.builder()
                    .careRequest(req)
                    .workDate(req.getStartDate())
                    .startTime(req.getStartTime())
                    .endTime(req.getEndTime())
                    .status("SCHEDULED")
                    .build();
            scheduleRepository.save(schedule);
        }

        Contract saved = contractRepository.save(c);
        String patientName = getPatientName(token, saved.getCareRequest().getPatientId());
        return ContractMapper.toDto(saved, patientName);
    }

    @Override
    @Transactional
    public ContractDto approveContract(String token, Long id) {
        Contract c = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        c.setStatus("APPROVED");

        CareRequest req = c.getCareRequest();
        req.setStatus("Approved");
        careRequestRepository.save(req);

        Contract saved = contractRepository.save(c);
        String patientName = getPatientName(token, saved.getCareRequest().getPatientId());
        return ContractMapper.toDto(saved, patientName);
    }

    @Override
    public String getContractHtml(String token, Long id) {
        CareRequest r = careRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Care request not found"));

        String patientName = getPatientName(token, r.getPatientId());
        String caregiverName = getCaregiverName(token, r.getCaregiverId());
        String status = r.getContract() != null ? r.getContract().getStatus() : "UNSIGNED";

        return String.format(
                "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<meta charset='utf-8'>" +
                        "<title>SERVICE CONTRACT #%d</title>" +
                        "<style>" +
                        "body { font-family: 'Public Sans', sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; }"
                        +
                        ".header { text-align: center; border-bottom: 2px solid #5fa5ba; padding-bottom: 20px; margin-bottom: 30px; }"
                        +
                        ".header h1 { margin: 0; color: #5fa5ba; font-size: 28px; }" +
                        ".section { margin-bottom: 25px; }" +
                        ".section-title { font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; color: #0d8ca5; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; }"
                        +
                        "table { width: 100%%; border-collapse: collapse; margin-top: 10px; }" +
                        "table td { padding: 8px 0; }" +
                        "table td.label { font-weight: bold; width: 30%%; color: #666; }" +
                        ".footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px dashed #ddd; padding-top: 20px; }"
                        +
                        ".signatures { display: flex; justify-content: space-between; margin-top: 60px; }" +
                        ".sig-box { border-top: 1px solid #333; width: 40%%; text-align: center; padding-top: 10px; font-weight: bold; }"
                        +
                        ".stamp { border: 3px double #2ecc71; color: #2ecc71; display: inline-block; padding: 5px 15px; font-weight: bold; border-radius: 5px; text-transform: uppercase; transform: rotate(-5deg); margin-bottom: 15px; }"
                        +
                        ".stamp.pending { border-color: #f1c40f; color: #f1c40f; }" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class='header'>" +
                        "  <div class='stamp %s'>%s</div>" +
                        "  <h1>HOME CARE SERVICES CONTRACT</h1>" +
                        "  <p>Contract Code: HC-%d | Date: %s</p>" +
                        "</div>" +
                        "<div class='section'>" +
                        "  <div class='section-title'>1. PARTIES INVOLVED</div>" +
                        "  <table>" +
                        "    <tr><td class='label'>Provider:</td><td>HomeCare Connect Inc.</td></tr>" +
                        "    <tr><td class='label'>Customer ID:</td><td>Family #%d</td></tr>" +
                        "    <tr><td class='label'>Patient Full Name:</td><td>%s</td></tr>" +
                        "  </table>" +
                        "</div>" +
                        "<div class='section'>" +
                        "  <div class='section-title'>2. CARE SCHEDULE & PACKAGE</div>" +
                        "  <table>" +
                        "    <tr><td class='label'>Service Package:</td><td>%s</td></tr>" +
                        "    <tr><td class='label'>Caregiver Assigned:</td><td>%s</td></tr>" +
                        "    <tr><td class='label'>Start Date:</td><td>%s</td></tr>" +
                        "    <tr><td class='label'>Shift Duration:</td><td>%s - %s</td></tr>" +
                        "    <tr><td class='label'>Location Address:</td><td>%s</td></tr>" +
                        "  </table>" +
                        "</div>" +
                        "<div class='section'>" +
                        "  <div class='section-title'>3. VALUATION & TERMS</div>" +
                        "  <table>" +
                        "    <tr><td class='label'>Estimated Cost:</td><td style='font-size: 18px; font-weight: bold; color: #27ae60;'>%,.2f VND</td></tr>"
                        +
                        "    <tr><td class='label'>Payment Terms:</td><td>Upfront payment required upon approval. Services will be cancelled if unpaid before delivery.</td></tr>"
                        +
                        "  </table>" +
                        "</div>" +
                        "<div class='signatures'>" +
                        "  <div class='sig-box'>HomeCare Connect Representative<br/><span style='font-size:11px;color:#999'>(Signed)</span></div>"
                        +
                        "  <div class='sig-box'>Customer Signature<br/><span style='font-size:11px;color:#999'>(Signed dynamically via portal: %s)</span></div>"
                        +
                        "</div>" +
                        "<div class='footer'>" +
                        "  <p>HomeCare Connect - Caring like family, serving with professionalism.</p>" +
                        "  <p>Address: 123 Care Street, District 1, HCMC | Hotline: 1900-CARE</p>" +
                        "</div>" +
                        "</body>" +
                        "</html>",
                status.equalsIgnoreCase("SIGNED") || status.equalsIgnoreCase("APPROVED") ? "approved" : "pending",
                status,
                r.getId(),
                r.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                r.getFamilyId(),
                patientName,
                r.getCareService().getName(),
                caregiverName,
                r.getStartDate().toString(),
                r.getStartTime().toString(),
                r.getEndTime().toString(),
                r.getAddress() != null ? r.getAddress() : "Home address",
                r.getTotalPrice(),
                status);
    }

    private UserDto getMyProfile(String token) {
        try {
            return userServiceClient.getMyProfile(token);
        } catch (Exception e) {
            log.error("Failed to query user profile", e);
            throw new ResourceNotFoundException("Invalid credential profile");
        }
    }

    private String getPatientName(String token, Long patientId) {
        if (patientId == null)
            return "N/A";
        try {
            PatientDto p = userServiceClient.getPatientById(token, patientId);
            return p.fullName() != null ? p.fullName() : (p.name() != null ? p.name() : "Patient #" + patientId);
        } catch (Exception e) {
            log.warn("Failed to fetch patient name for ID: {}", patientId, e);
            return "Patient #" + patientId;
        }
    }

    private String getCaregiverName(String token, Long caregiverId) {
        if (caregiverId == null)
            return "Unassigned";
        try {
            CaregiverDto cg = caregiverServiceClient.getCaregiverById(token, caregiverId);
            return cg.fullName() != null ? cg.fullName() : "Caregiver #" + caregiverId;
        } catch (Exception e) {
            log.warn("Failed to fetch caregiver name for ID: {}", caregiverId, e);
            return "Caregiver #" + caregiverId;
        }
    }

    private LocalTime parseLocalTime(String timeStr) {
        if (timeStr == null)
            return LocalTime.of(9, 0);
        if (timeStr.length() == 5) {
            return LocalTime.parse(timeStr + ":00");
        }
        return LocalTime.parse(timeStr);
    }
}
