package com.example.comp9034.entity;

import jakarta.persistence.*;

import com.example.comp9034.enums.ContractType;

@Entity
@Table(name = "Staff")
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @OneToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User User;

    @Column(unique = true)
    private String CardId;

    @Enumerated(EnumType.STRING)
    private ContractType ContractType;

    private Double PayRate;
    private String Task;
    private Boolean IsActive = true;
}
