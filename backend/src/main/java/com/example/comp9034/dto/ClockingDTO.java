package com.example.comp9034.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
public class ClockingDTO {
    private int id;

    private String employeeId;
    private Integer stationId;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime clockInTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime clockOutTime;

    private boolean isAdminManual;
    private String reasonCode;
    private Integer breakMinutes;
}
