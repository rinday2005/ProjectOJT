package org.example.bookingservice.client;

import org.example.bookingservice.dto.response.UserDto;
import org.example.bookingservice.dto.response.PatientDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", contextId = "userServiceClient", url = "http://localhost:8081")
public interface UserServiceClient {

    @GetMapping("/api/v1/users/profile")
    UserDto getMyProfile(@RequestHeader("Authorization") String token);

    @GetMapping("/api/v1/patients/{id}")
    PatientDto getPatientById(@RequestHeader("Authorization") String token, @PathVariable("id") Long id);
}
