package com.example.comp9034.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeePayrollDTO {
    private String employeeId;
    private String employeeName;
    private String email;
    private long regularMinutes;
    private long otMinutes;
    private long regularHours;
    private long otHours;
    private long regularWage;
    private long otWage;
    private long totalWage;
    private LocalDate startDate;
    private LocalDate endDate;
}
