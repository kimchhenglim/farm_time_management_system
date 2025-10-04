package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Clocking")
@Getter
@Setter
public class ClockingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String employeeId;

    @Column(name = "clock_in_time", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime clockInTime;

    @Column(name = "clock_out_time", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime clockOutTime;

    private Boolean isAdminManual = false;
    private String manualReason;

    private Integer breakMinutes;
}
