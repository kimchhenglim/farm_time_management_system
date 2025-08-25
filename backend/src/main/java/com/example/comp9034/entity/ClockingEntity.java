package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Clocking")
@Getter
@Setter
public class ClockingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "staffId", nullable = false)
    private StaffEntity staff;

    private LocalDateTime clockInTime;
    private LocalDateTime clockOutTime;

    private Boolean isAdminManual = false;
    private String manualReason;

    @OneToMany(mappedBy = "clocking", cascade = CascadeType.ALL)
    private List<BreakEntity> breaks;
}
