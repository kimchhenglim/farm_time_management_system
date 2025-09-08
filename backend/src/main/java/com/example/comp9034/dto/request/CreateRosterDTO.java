package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class CreateRosterDTO {
    @NotBlank(message = "Employee cannot be null or empty")
    private String employeeId;

    @NotNull(message = "Start time for shift cannot be null or empty")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "uuuu-MM-dd HH:mm")
    private java.time.LocalDateTime startTime;

    @NotNull(message = "End time for shift cannot be null or empty")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "uuuu-MM-dd HH:mm")
    private java.time.LocalDateTime endTime;

    private String location;
    private int breakMinutes;

    public CreateRosterDTO(String employeeId, java.time.LocalDateTime startTime, java.time.LocalDateTime endTime) {
        this.employeeId = employeeId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

