package org.example.bookingservice.service;

import org.example.bookingservice.dto.request.*;
import org.example.bookingservice.dto.response.*;

import java.util.List;

public interface BookingService {
    List<CareServiceDto> getAllServices();

    CareRequestDto createCareRequest(String token, CreateCareRequest request);

    List<CareRequestDto> getFamilyRequests(String token);

    List<CareRequestDto> getAllRequests(String token);

    CareRequestDto getRequestById(String token, Long id);

    CareRequestDto updateRequestStatus(String token, Long id, String status);

    CareRequestDto assignCaregiver(String token, Long id, Long caregiverId);

    CaregiverAvailabilityDto checkCaregiverAvailability(Long caregiverId, String dateStr, String startTimeStr,
            String endTimeStr);

    List<ContractDto> getFamilyContracts(String token);

    List<ContractDto> getAllContracts(String token);

    ContractDto signContract(String token, Long id);

    ContractDto approveContract(String token, Long id);

    String getContractHtml(String token, Long id);
}
