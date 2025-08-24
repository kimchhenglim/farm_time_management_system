package com.example.comp9034.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Break")
public class BreakEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "ClockingId", nullable = false)
    private ClockingEntity Clocking;

    private LocalDateTime BreakStartTime;
    private LocalDateTime BreakEndTime;

    private String Reason;
}
