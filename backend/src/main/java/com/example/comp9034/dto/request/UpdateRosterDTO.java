package com.example.comp9034.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class UpdateRosterDTO {
    @NotNull(message = "Roster ID cannot be null or empty")
    private long rosterId;

    private String employeeId;

    @NotNull(message = "Start time for shift cannot be null or empty")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime startTime;

    @NotNull(message = "End time for shift cannot be null or empty")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime endTime;

    private String location;
    private int breakMinutes;

    public UpdateRosterDTO(String employeeId, java.time.LocalDateTime startTime, java.time.LocalDateTime endTime) {
        this.employeeId = employeeId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

