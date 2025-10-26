package com.example.comp9034.service.impl;

import com.example.comp9034.dto.EmployeePayrollDTO;
import com.example.comp9034.dto.request.GeneratePayrollRequestDTO;
import com.example.comp9034.entity.ClockingEntity;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ClockingRepository;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.EmailService;
import com.example.comp9034.service.PayrollService;
import com.example.comp9034.service.PdfService;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;
import static com.example.comp9034.util.Common.convertStringToLong;
import static com.example.comp9034.util.Common.getConfigValue;

@Log4j2
@Service
public class PayrollServiceImpl implements PayrollService {
    private final ClockingRepository clockingRepository;
    private final ConfigurationRepository configurationRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final EmailService emailService;
    private final PdfService pdfService;
    private final UserRepository userRepository;

    public PayrollServiceImpl(ClockingRepository clockingRepository, ConfigurationRepository configurationRepository, ErrorCodeRepository errorCodeRepository, EmailService emailService, PdfService pdfService, UserRepository userRepository) {
        this.clockingRepository = clockingRepository;
        this.configurationRepository = configurationRepository;
        this.errorCodeRepository = errorCodeRepository;
        this.emailService = emailService;
        this.pdfService = pdfService;
        this.userRepository = userRepository;
    }

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final java.text.NumberFormat CURRENCY =
            java.text.NumberFormat.getCurrencyInstance(java.util.Locale.forLanguageTag("en-AU"));

    @Override
    public CompleteResponse<Object> emailPayroll(GeneratePayrollRequestDTO dto) {
        // 1) Build the rows using the shared pipeline
        List<EmployeePayrollDTO> rows = buildPayrollRows(dto);
        if (rows.isEmpty()) {
            throw new BusinessException(INVALID_INPUT, PAYROLL.name(), "No valid employees to generate payroll!");
        }

        LocalDate start = rows.get(0).getStartDate();
        LocalDate end = rows.get(0).getEndDate();

        // 2) Single PDF for all rows (same columns as before)
        byte[] pdfContent = pdfService.generatePayrollPDF(rows, start, end);

        // 3) Email to each employee that has an email
        List<String> recipients = rows.stream()
                .map(EmployeePayrollDTO::getEmail)
                .filter(e -> e != null && !e.trim().isEmpty())
                .distinct()
                .toList();

        for (String email : recipients) {
            emailService.sendPayrollPdfEmail(email, start, end, pdfContent, null);
        }

        return getCompleteResponse(errorCodeRepository, CREATE_PAYROLL_SUCCESS, PAYROLL.name(), rows);
    }

    @Override
    public CompleteResponse<Object> csvPayroll(GeneratePayrollRequestDTO dto) {
        // 1) Build the rows with the same logic as email/pdf
        List<EmployeePayrollDTO> rows = buildPayrollRows(dto);
        if (rows.isEmpty()) {
            throw new BusinessException(INVALID_INPUT, PAYROLL.name(), "No rows to export.");
        }

        LocalDate start = rows.get(0).getStartDate();
        LocalDate end = rows.get(0).getEndDate();

        // 2) Build CSV bytes (same columns as the PDF)
        byte[] csvBytes = buildPayrollCsv(rows, start, end);

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("Admin to receive CSV: {} ", email);

        emailService.sendPayrollCsvEmail(email, start, end, csvBytes, null);
        return getCompleteResponse(errorCodeRepository, CREATE_PAYROLL_CSV_SUCCESS, PAYROLL.name(), csvBytes);
    }

    private static LocalDate[] mostRecentFortnight() {
        LocalDate today = LocalDate.now();
        LocalDate currentWeekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate end = currentWeekStart.minusDays(1);  // last Sunday
        LocalDate start = end.minusDays(13);            // Monday two weeks earlier
        return new LocalDate[]{start, end};
    }

    private static LocalDate[] resolveAndValidate(LocalDate dtoStart, LocalDate dtoEnd) {
        var mr = mostRecentFortnight();
        if (dtoStart == null || dtoEnd == null) return mr;

        long daysBetween = ChronoUnit.DAYS.between(dtoStart, dtoEnd) + 1;
        if (daysBetween != 14) {
            throw new IllegalArgumentException("Pay period must cover exactly two weeks (14 days).");
        }
        if (!dtoStart.equals(mr[0]) || !dtoEnd.equals(mr[1])) {
            String msg = "Time window to generate payroll from " + dtoStart + " to " + dtoEnd + " is not valid!";
            log.error(msg);
            throw new BusinessException(PAYROLL_PERIOD_NOT_VALID, PAYROLL.name(), "Only the most recent fortnight can be selected.");
        }
        return new LocalDate[]{dtoStart, dtoEnd};
    }

    // Employee list helper
    private List<String> resolveEmployeeIds(GeneratePayrollRequestDTO dto,
                                            LocalDateTime startDT, LocalDateTime endDT) {
        if (dto.getEmployeeIds() != null && !dto.getEmployeeIds().isEmpty()) {
            List<String> ok = new ArrayList<>();
            for (String employeeId : dto.getEmployeeIds()) {
                if (clockingRepository.existsOverlappingInRange(employeeId, startDT, endDT)) {
                    ok.add(employeeId);
                } else {
                    log.error("Employee {} does not have attendance", employeeId);
                }
            }
            return ok;
        }
        // Auto-discover from clocking table
        return clockingRepository.findDistinctEmployeeIdsWithOverlap(startDT, endDT);
    }

    // Minutes aggregation (treat open shift as ended at window end)
    private Map<LocalDate, Long> aggregateMinutesPerDay(List<ClockingEntity> clockings,
                                                        LocalDateTime startDT, LocalDateTime endDT) {
        Map<LocalDate, Long> perDay = new HashMap<>();
        for (ClockingEntity c : clockings) {
            if (c.getClockInTime() == null) continue;

            LocalDateTime inRaw = c.getClockInTime();
            LocalDateTime outRaw = (c.getClockOutTime() == null) ? endDT : c.getClockOutTime();

            LocalDateTime in = inRaw.isBefore(startDT) ? startDT : inRaw;
            LocalDateTime out = outRaw.isAfter(endDT) ? endDT : outRaw;
            if (!out.isAfter(in)) continue;

            long minutes = Duration.between(in, out).toMinutes();
            int breakMin = c.getBreakMinutes() == null ? 0 : Math.max(0, c.getBreakMinutes());
            minutes = Math.max(0, minutes - breakMin);

            // If you need to handle cross-midnight, split here by day.
            perDay.merge(in.toLocalDate(), minutes, Long::sum);
        }
        return perDay;
    }

    // Split by ISO week cap
    private long[] splitRegularAndOTByISOWeek(Map<LocalDate, Long> minutesPerDay, long weeklyLimitMinutes) {
        if (minutesPerDay.isEmpty()) return new long[]{0L, 0L};

        WeekFields ISO = WeekFields.ISO;
        Map<String, Long> minutesPerIsoWeek = minutesPerDay.entrySet().stream()
                .collect(Collectors.groupingBy(
                        e -> {
                            LocalDate d = e.getKey();
                            int y = d.get(ISO.weekBasedYear());
                            int w = d.get(ISO.weekOfWeekBasedYear());
                            return y + "-W" + w; // e.g. 2025-W43
                        },
                        Collectors.summingLong(Map.Entry::getValue)
                ));

        long regular = 0, ot = 0;
        for (long weekTotal : minutesPerIsoWeek.values()) {
            if (weekTotal <= weeklyLimitMinutes) {
                regular += weekTotal;
            } else {
                regular += weeklyLimitMinutes;
                ot += (weekTotal - weeklyLimitMinutes);
            }
        }
        return new long[]{regular, ot};
    }

    // ===== Build one row (per employee) =====
    private EmployeePayrollDTO buildRow(String employeeId,
                                        LocalDate startDay, LocalDate endDay,
                                        long weeklyLimitMinutes, long regularRate, long otRate,
                                        LocalDateTime startDT, LocalDateTime endDT) {

        var userOpt = userRepository.findByEmployeeId(employeeId);
        if (userOpt.isEmpty()) {
            log.error("Employee {} does not exist", employeeId);
            return null;
        }
        var user = userOpt.get();

        List<ClockingEntity> clockings = clockingRepository.findOverlappingInRange(employeeId, startDT, endDT);
        if (clockings.isEmpty()) {
            log.error("Employee {} does not have attendance", employeeId);
            return null;
        }

        Map<LocalDate, Long> perDay = aggregateMinutesPerDay(clockings, startDT, endDT);
        if (perDay.isEmpty()) {
            log.error("Employee {} has no valid worked minutes in window", employeeId);
            return null;
        }

        long[] parts = splitRegularAndOTByISOWeek(perDay, weeklyLimitMinutes);
        long regularMinutes = parts[0];
        long otMinutes = parts[1];

        long regularHours = regularMinutes / 60;
        long otHours = otMinutes / 60;

        long regularWage = regularHours * regularRate;
        long otWage = otHours * otRate;

        String first = user.getFirstName() == null ? "" : user.getFirstName().trim();
        String last = user.getLastName() == null ? "" : user.getLastName().trim();
        String name = (first + " " + last).trim();
        String email = user.getEmail() == null ? "" : user.getEmail().trim();

        return EmployeePayrollDTO.builder()
                .employeeId(employeeId)
                .employeeName(name)
                .email(email)
                .regularMinutes(regularMinutes)
                .otMinutes(otMinutes)
                .regularHours(regularHours)
                .otHours(otHours)
                .regularWage(regularWage)
                .otWage(otWage)
                .totalWage(regularWage + otWage)
                .startDate(startDay)
                .endDate(endDay)
                .build();
    }

    // ===== Orchestrator used by email/pdf/csv =====
    private List<EmployeePayrollDTO> buildPayrollRows(GeneratePayrollRequestDTO dto) {
        // Resolve and validate period
        var period = resolveAndValidate(dto.getStartDay(), dto.getEndDay());
        LocalDate startDay = period[0], endDay = period[1];

        LocalDateTime startDT = startDay.atStartOfDay();
        LocalDateTime endDT = endDay.atTime(23, 59, 59);

        // Rates and limits
        long weeklyLimitMinutes = convertStringToLong(getConfigValue(WEEKLY_LIMIT_MINUTES.name(), configurationRepository, "2280"));
        long regularRate = convertStringToLong(getConfigValue(WEEKLY_REGULAR_RATE.name(), configurationRepository, "24"));
        long otRate = convertStringToLong(getConfigValue(WEEKLY_OT_RATE.name(), configurationRepository, "2280"));

        // Employee set
        List<String> employeeIds = resolveEmployeeIds(dto, startDT, endDT);
        if (employeeIds.isEmpty()) {
            throw new BusinessException(INVALID_INPUT, PAYROLL.name(), "No valid employees to generate payroll!");
        }

        // Build rows
        List<EmployeePayrollDTO> rows = new ArrayList<>();
        for (String employeeId : employeeIds) {
            var row = buildRow(employeeId, startDay, endDay, weeklyLimitMinutes, regularRate, otRate, startDT, endDT);
            if (row != null) rows.add(row);
        }
        return rows;
    }

    private static byte[] buildPayrollCsv(List<EmployeePayrollDTO> rows, LocalDate start, LocalDate end) {
        StringBuilder sb = new StringBuilder();

        // Banner
        sb.append("Payroll Report,Time Frame,")
                .append(escapeCsv(start != null ? start.format(DATE_FMT) : ""))
                .append(" to ")
                .append(escapeCsv(end != null ? end.format(DATE_FMT) : ""))
                .append("\r\n");

        // Header (matches PDF)
        sb.append(String.join(",",
                        "Employee ID",
                        "Employee name",
                        "Employee email",
                        "Regular Minutes",
                        "OT Minutes",
                        "Regular Hours",
                        "OT Hours",
                        "Regular Wage",
                        "OT Wage",
                        "Total Wage",
                        "Period Start",
                        "Period End"))
                .append("\r\n");

        long sumRegMin = 0, sumOtMin = 0, sumRegWage = 0, sumOtWage = 0, sumTotalWage = 0;

        for (var r : rows) {
            sumRegMin += r.getRegularMinutes();
            sumOtMin += r.getOtMinutes();
            sumRegWage += r.getRegularWage();
            sumOtWage += r.getOtWage();
            sumTotalWage += r.getTotalWage();

            sb.append(escapeCsv(r.getEmployeeId())).append(',')
                    .append(escapeCsv(nz(r.getEmployeeName()))).append(',')
                    .append(escapeCsv(nz(r.getEmail()))).append(',')
                    .append(r.getRegularMinutes()).append(',')
                    .append(r.getOtMinutes()).append(',')
                    .append(r.getRegularHours()).append(',')
                    .append(r.getOtHours()).append(',')
                    .append(escapeCsv(CURRENCY.format(r.getRegularWage()))).append(',')
                    .append(escapeCsv(CURRENCY.format(r.getOtWage()))).append(',')
                    .append(escapeCsv(CURRENCY.format(r.getTotalWage()))).append(',')
                    .append(escapeCsv(r.getStartDate() != null ? r.getStartDate().format(DATE_FMT) : "")).append(',')
                    .append(escapeCsv(r.getEndDate() != null ? r.getEndDate().format(DATE_FMT) : ""))
                    .append("\r\n");
        }

        // Totals row
        sb.append("TOTALS,,,")
                .append(sumRegMin).append(',')
                .append(sumOtMin).append(',')
                .append("").append(',')
                .append("").append(',')
                .append(escapeCsv(CURRENCY.format(sumRegWage))).append(',')
                .append(escapeCsv(CURRENCY.format(sumOtWage))).append(',')
                .append(escapeCsv(CURRENCY.format(sumTotalWage))).append(',')
                .append(',') // start blank
                .append(' ') // end blank
                .append("\r\n");

        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private static String nz(String s) {
        return s == null ? "" : s;
    }

    private static String escapeCsv(String s) {
        if (s == null) return "";
        boolean mustQuote = s.contains(",") || s.contains("\"") || s.contains("\r") || s.contains("\n");
        if (!mustQuote) return s;
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }
}
