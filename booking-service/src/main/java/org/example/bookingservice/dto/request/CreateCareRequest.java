package org.example.bookingservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCareRequest {

    @NotNull(message = "Service ID cannot be null")
    private Long serviceId;

    private Long service_id;

    @NotNull(message = "Patient ID cannot be null")
    private Long patientId;

    private Long patient_id;

    @NotNull(message = "Requested date cannot be null")
    private String requestedDate;

    private String date;

    @NotNull(message = "Start time cannot be null")
    private String startTime;

    private String start_time;

    @Min(value = 1, message = "Duration must be at least 1 hour")
    private Integer duration;

    private String notes;
    private String special_note;
    @org.example.bookingservice.validation.ValidRequestType
    private String type;
    private String address;

    public Long getResolvedServiceId() {
        return serviceId != null ? serviceId : service_id;
    }

    public Long getResolvedPatientId() {
        return patientId != null ? patientId : patient_id;
    }

    public String getResolvedDate() {
        return requestedDate != null ? requestedDate : date;
    }

    public String getResolvedStartTime() {
        return startTime != null ? startTime : start_time;
    }

    public String getResolvedNotes() {
        return notes != null ? notes : special_note;
    }
}
