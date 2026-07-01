package org.example.bookingservice.client;

import org.example.bookingservice.dto.response.CaregiverDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "caregiver-service", url = "http://localhost:8082")
public interface CaregiverServiceClient {

    @GetMapping("/api/v1/caregiver/{id}")
    CaregiverDto getCaregiverById(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);
}
