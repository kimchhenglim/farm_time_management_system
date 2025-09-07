package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class CreateRosterDTO {
    @NotBlank(message = "Employee cannot be null or empty")
    private String employeeId;

    @NotBlank(message = "Start time for shift cannot be null or empty")
    private String startTime;

    @NotBlank(message = "End time for shift cannot be null or empty")
    private String endTime;

    private String location;
    private int breakMinutes;

    public CreateRosterDTO(String employeeId, String startTime, String endTime) {
        this.employeeId = employeeId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

