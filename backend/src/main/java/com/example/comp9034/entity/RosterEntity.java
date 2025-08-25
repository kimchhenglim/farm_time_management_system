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
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private UserEntity user;

    private LocalDateTime startTime = LocalDateTime.now();
    private LocalDateTime endTime;

    @ManyToOne()
    @JoinColumn(name = "createdBy", referencedColumnName = "user_id")
    private UserEntity createdBy;

    private LocalDateTime createdAt = LocalDateTime.now();
}
