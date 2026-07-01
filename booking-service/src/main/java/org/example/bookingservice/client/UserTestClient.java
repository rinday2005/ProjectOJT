package org.example.bookingservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Gọi sang đúng Port 8081 của User Service
@FeignClient(name = "user-service", contextId = "userTestClient", url = "http://localhost:8081/api/v1/patients")
public interface UserTestClient {

    @GetMapping("{id}")
    String callUser(@PathVariable("id") Long id);
}