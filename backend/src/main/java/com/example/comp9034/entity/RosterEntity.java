package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Roster")
@Getter
@Setter
public class RosterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String employeeId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();
}
