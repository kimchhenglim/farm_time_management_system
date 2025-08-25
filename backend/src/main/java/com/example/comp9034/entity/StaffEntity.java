package com.example.comp9034.entity;

import jakarta.persistence.*;

import com.example.comp9034.enums.ContractTypeEnum;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "Staff")
@Getter
@Setter
public class StaffEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "UserId", nullable = false)
    private UserEntity user;

    @Column(unique = true)
    private String cardId;

    @Enumerated(EnumType.STRING)
    private ContractTypeEnum contractType;

    private Double payRate;
    private String task;
    private Boolean isActive = true;

    // Relationships
    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    private List<PayslipEntity> payslips;

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    private List<RosterEntity> rosters;

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    private List<ClockingEntity> clockings;
}
