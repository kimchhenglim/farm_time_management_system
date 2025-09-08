package com.example.comp9034.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
public class RosterDTO {
    private String employeeId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate date;
    private String location;
    private Integer breakMinutes;
    private String status;
    private long netMinutes;
}
