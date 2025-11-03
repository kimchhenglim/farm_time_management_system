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
public class PayrollEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Example: "Fortnight Ending 2025-10-26"
    @Column(nullable = false, unique = true)
    private String payrollName;

    // Pay period dates (2-week window)
    @Column(nullable = false)
    private LocalDate payPeriodStart;

    @Column(nullable = false)
    private LocalDate payPeriodEnd;

    // Only the most recent payroll should be marked true
    @Column(nullable = false)
    private boolean mostRecent = false;

    // Aggregated totals (optional for reporting)
    private Double totalRegularHours = 0.0;
    private Double totalOvertimeHours = 0.0;
    private Double totalWeekendHours = 0.0;
    private Double totalPay = 0.0;

    private Boolean isExported = false;

    private LocalDateTime generatedAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
