package com.example.comp9034.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
public class ClockingResponseDTO {

    private int id;
    private String employeeId;
    private String employeeName;
    private Integer stationId;
    private String date;             // formatted "Mon 01 Sep 2025"
    private String clockInTime;      // HH:mm
    private String clockOutTime;     // HH:mm
    private boolean isAdminManual;
    private String reasonCode;
    private Integer breakMinutes;
    private Double payRate;
    private Double hours;            // fractional hours
    private Double total;            // total pay

    public ClockingResponseDTO(int id,
                               String employeeId,
                               String employeeName,
                               Integer stationId,
                               String date,
                               String clockInTime,
                               String clockOutTime,
                               boolean isAdminManual,
                               String reasonCode,
                               Integer breakMinutes,
                               Double payRate,
                               Double hours,
                               Double total) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.stationId = stationId;
        this.date = date;
        this.clockInTime = clockInTime;
        this.clockOutTime = clockOutTime;
        this.isAdminManual = isAdminManual;
        this.reasonCode = reasonCode;
        this.breakMinutes = breakMinutes;
        this.payRate = payRate;
        this.hours = hours;
        this.total = total;
    }
}
