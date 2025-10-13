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
    private int id;

    private int clockingId;

    @Column(name = "break_start_time", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime breakStartTime;

    @Column(name = "break_end_time", columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime breakEndTime;
    private String reason;
}
