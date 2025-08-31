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
    private LocalDateTime breakStartTime;
    private LocalDateTime breakEndTime;
    private String reason;
}
