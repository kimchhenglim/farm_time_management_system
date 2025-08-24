package com.example.comp9034.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Roster")
public class RosterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StaffId", nullable = false)
    private StaffEntity Staff;

    private LocalDateTime StartTime = LocalDateTime.now();
    private LocalDateTime EndTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy", referencedColumnName = "UserId")
    private AdminEntity CreatedBy;

    private LocalDateTime CreatedAt = LocalDateTime.now();
}
