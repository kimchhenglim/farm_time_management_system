package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Roster")
@Getter
@Setter
public class RosterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "start_time", nullable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "dd-MM-uuuu HH:mm")
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "dd-MM-uuuu HH:mm")
    private LocalDateTime endTime;

    @Column(nullable = false)
    private LocalDate date;

    private String location;
    private Integer breakMinutes = 0;        // default 0; set to 30 if > 4h
    private Boolean isCancelled = false;

    private String status;

    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    public RosterEntity(Integer breakMinutes, LocalDate date, LocalDateTime endTime, LocalDateTime startTime, String employeeId, String status, String createdBy, String location) {
        this.breakMinutes = breakMinutes;
        this.date = date;
        this.endTime = endTime;
        this.startTime = startTime;
        this.employeeId = employeeId;
        this.status = status;
        this.createdBy = createdBy;
        this.location = location;
    }

    public RosterEntity() {
    }
}
