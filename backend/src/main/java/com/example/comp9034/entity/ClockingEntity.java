package com.example.comp9034.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Clocking")
public class ClockingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "StaffId", nullable = false)
    private StaffEntity Staff;

    private LocalDateTime ClockInTime;
    private LocalDateTime ClockOutTime;

    private Boolean IsAdminManual = false;
    private String ManualReason;

    @OneToMany(mappedBy = "Clocking", cascade = CascadeType.ALL)
    private List<BreakEntity> Breaks;
}
