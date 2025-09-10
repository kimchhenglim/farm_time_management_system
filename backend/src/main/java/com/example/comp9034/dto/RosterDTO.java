package com.example.comp9034.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
public class RosterDTO {
    private String rosterId;
    private String employeeId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private LocalDateTime startTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private LocalDateTime endTime;
    private LocalDate date;
    private String location;
    private Integer breakMinutes;
    private String status;
    private long netMinutes;
}
