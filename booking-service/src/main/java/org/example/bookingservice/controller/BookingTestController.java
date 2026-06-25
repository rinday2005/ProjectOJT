package org.example.bookingservice.controller;

import org.example.bookingservice.client.UserTestClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingTestController {

    private final UserTestClient userTestClient; // Inject client tạm ở trên vào

    @GetMapping("/check-flow")
    public String checkFlow() {
        // Thử gọi sang User Service với ID ngẫu nhiên là 999
        String responseFromUserService = userTestClient.callUser(999L);
        return "Booking Service phản hồi: Luồng Feign hoạt động mượt mà! " + responseFromUserService;
    }
}