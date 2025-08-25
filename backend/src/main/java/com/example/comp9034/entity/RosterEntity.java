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

    @ManyToOne()
    @JoinColumn(name = "staffId", nullable = false)
    private StaffEntity staff;

    private LocalDateTime startTime = LocalDateTime.now();
    private LocalDateTime endTime;

    @ManyToOne()
    @JoinColumn(name = "createdBy", referencedColumnName = "userId")
    private AdminEntity createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();
}
