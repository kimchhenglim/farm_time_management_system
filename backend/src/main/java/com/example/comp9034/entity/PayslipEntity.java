package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payslip")
@Getter
@Setter
public class PayslipEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String employeeId;

    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;

    private Double baseHours;
    private Double saturdayHours;
    private Double sundayHours;
    private Double holidayHours;
    private Double overtimeHours;
    private Double totalHours;

    private Double totalPay;

    private LocalDateTime generatedAt = LocalDateTime.now();
    private Boolean isExported = false;
}
