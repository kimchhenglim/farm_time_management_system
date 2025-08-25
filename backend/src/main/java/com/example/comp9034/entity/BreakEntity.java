package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Break")
@Getter
@Setter
public class BreakEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "clockingId", nullable = false)
    private ClockingEntity clocking;

    private LocalDateTime breakStartTime;
    private LocalDateTime breakEndTime;

    private String reason;
}
