package org.example.bookingservice.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = RequestTypeValidator.class)
public @interface ValidRequestType {
    String message() default "Invalid request type. Must be 'One-time' or 'Recurring'";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
