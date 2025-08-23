package com.example.comp9034.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payslip")
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = false)
    private User User;

    private LocalDate PayPeriodStart;
    private LocalDate PayPeriodEnd;

    private Double BaseHours;
    private Double SaturdayHours;
    private Double SundayHours;
    private Double HolidayHours;
    private Double OvertimeHours;
    private Double TotalHours;

    private Double TotalPay;

    private LocalDateTime GeneratedAt = LocalDateTime.now();
    private Boolean IsExported = false;
}
