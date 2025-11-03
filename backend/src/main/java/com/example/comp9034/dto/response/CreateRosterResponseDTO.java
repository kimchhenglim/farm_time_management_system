package com.example.comp9034.dto.response;

import com.example.comp9034.enums.RosterEnum;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CreateRosterResponseDTO {
    private long id;
    private String employeeId;
    private String employeeName;

    private String startTime;
    private String endTime;
    private LocalDate date;
    private String station;
    private int breakMinutes;
    private RosterEnum status;
    private long remainingMinutes;

    private String createdBy;
    private LocalDateTime createdAt;
    private boolean isExceededHours;



}
