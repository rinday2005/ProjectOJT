package org.example.bookingservice.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class RequestTypeValidator implements ConstraintValidator<ValidRequestType, String> {
    private static final List<String> VALID_TYPES = Arrays.asList("One-time", "Recurring");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return VALID_TYPES.contains(value);
    }
}
