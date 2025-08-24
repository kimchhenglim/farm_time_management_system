package com.example.comp9034.entity;

import jakarta.persistence.*;

import com.example.comp9034.enums.ContractType;

import java.util.List;

@Entity
@Table(name = "Staff")
public class StaffEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @OneToOne
    @JoinColumn(name = "UserId", nullable = false)
    private UserEntity User;

    @Column(unique = true)
    private String CardId;

    @Enumerated(EnumType.STRING)
    private ContractType ContractType;

    private Double PayRate;
    private String Task;
    private Boolean IsActive = true;

    // Relationships
    @OneToMany(mappedBy = "Staff", cascade = CascadeType.ALL)
    private List<PayslipEntity> Payslips;

    @OneToMany(mappedBy = "Staff", cascade = CascadeType.ALL)
    private List<RosterEntity> Rosters;

    @OneToMany(mappedBy = "Staff", cascade = CascadeType.ALL)
    private List<ClockingEntity> Clockings;
}
