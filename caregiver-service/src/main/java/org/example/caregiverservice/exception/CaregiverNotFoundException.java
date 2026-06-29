package org.example.caregiverservice.exception;

public class CaregiverNotFoundException extends RuntimeException {
    public CaregiverNotFoundException(String message) {
        super(message);
    }
}
