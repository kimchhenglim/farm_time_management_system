package com.example.comp9034.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Roster")
public class Roster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StafffId", nullable = false)
    private Staff Staff;

    private LocalDateTime StartTime = LocalDateTime.now();
    private LocalDateTime EndTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy", referencedColumnName = "UserId")
    private Admin CreatedBy;

    private LocalDateTime CreatedAt = LocalDateTime.now();
}
