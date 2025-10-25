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
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Override
    public CompleteResponse<Object> emailPayroll(GeneratePayrollRequestDTO dto) {
        // Uses a fixed fortnightly (two-week recently) pay period
        LocalDate today = LocalDate.now();
        LocalDate currentWeekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate mostRecentEnd = currentWeekStart.minusDays(1);      // last Sunday
        LocalDate mostRecentStart = mostRecentEnd.minusDays(13);      // Monday two weeks earlier

        LocalDate startDay = dto.getStartDay();
        LocalDate endDay = dto.getEndDay();

        if (startDay == null || endDay == null) {
            startDay = mostRecentStart;
            endDay = mostRecentEnd;
        } else {
            // Ensure 14-day difference (fortnight)
            long daysBetween = ChronoUnit.DAYS.between(startDay, endDay) + 1;
            if (daysBetween != 14) {
                throw new IllegalArgumentException("Pay period must cover exactly two weeks (14 days).");
            }

            // Must match the configured most recent fortnight
            boolean isMostRecent = startDay.equals(mostRecentStart) &&
                    endDay.equals(mostRecentEnd);
            if (!isMostRecent) {
                String msg = "Time window to generate payroll from " + startDay + " to " + endDay + " is not valid!";
                log.error(msg);
                throw new BusinessException(PAYROLL_PERIOD_NOT_VALID, PAYROLL.name(), msg); // “Only the most recent fortnight can be selected.”
            }
        }
        long weeklyLimitMinutes = convertStringToLong(getConfigValue(WEEKLY_LIMIT_MINUTES.name(), configurationRepository, "2280"));
        long regularRate = convertStringToLong(getConfigValue(WEEKLY_REGULAR_RATE.name(), configurationRepository, "24"));
        long otRate = convertStringToLong(getConfigValue(WEEKLY_OT_RATE.name(), configurationRepository, "2280"));
        // Convert to time bounds
        LocalDateTime startDateTime = startDay.atStartOfDay(); // 00:00:00
        LocalDateTime endDateTime = endDay.atTime(23, 59, 59);

        // Checking attendance records for each of the employees
        List<String> finalEmployeeList = new ArrayList<>();
        if (dto.getEmployeeIds() != null) {
            for (String employeeId : dto.getEmployeeIds()) {
                if (clockingRepository.existsOverlappingInRange(employeeId, startDateTime, endDateTime)) {
                    finalEmployeeList.add(employeeId);
                } else {
                    log.error("Employee {} does not have attendance", employeeId);
                }
            }
        } else {
            finalEmployeeList = clockingRepository.findDistinctEmployeeIdsWithOverlap(startDateTime, endDateTime);
        }
        if (finalEmployeeList.isEmpty()) {
            throw new BusinessException(INVALID_INPUT, PAYROLL.name(), "No valid employees to generate payroll!");
        }

        List<EmployeePayrollDTO> payrollRows = new ArrayList<>();
        List<String> emailList = new ArrayList<>();

        for (String employeeId : finalEmployeeList) {
            Optional<UserEntity> employeeOptional = userRepository.findByEmployeeId(employeeId);
            if (employeeOptional.isEmpty()) {
                log.error("Employee {} does not exist", employeeId);
                continue;
            }
            // Pull all clockings that overlap the window.
            List<ClockingEntity> clockings =
                    clockingRepository.findOverlappingInRange(employeeId, startDateTime, endDateTime);

            if (clockings.isEmpty()) {
                log.error("Employee {} does not have attendance", employeeId);
                continue;
            }

            // Build per-day total minutes map
            Map<LocalDate, Long> minutesPerDay = new HashMap<>();

            for (ClockingEntity c : clockings) {
                if (c.getClockInTime() == null) continue;

                LocalDateTime inRaw = c.getClockInTime();
                LocalDateTime outRaw = (c.getClockOutTime() == null)
                        ? endDateTime      // treat open shift as if ended at period end

                        : c.getClockOutTime();
                // If the shift started before/ after the window, move start up/ down
                LocalDateTime in = inRaw.isBefore(startDateTime) ? startDateTime : inRaw;
                LocalDateTime out = outRaw.isAfter(endDateTime) ? endDateTime : outRaw;

                if (!out.isAfter(in)) continue;

                long minutes = Duration.between(in, out).toMinutes();
                int breakMin = c.getBreakMinutes() == null ? 0 : c.getBreakMinutes();
                minutes = Math.max(0, minutes - Math.max(0, breakMin));

                LocalDate day = in.toLocalDate(); // NOTE: same-day assumption
                minutesPerDay.merge(day, minutes, Long::sum);
            }

            if (minutesPerDay.isEmpty()) {
                log.error("Employee {} has no valid worked minutes in window", employeeId);
                continue;
            }

            // Group per-day minutes by ISO week, then apply 38h/week cap ===
            WeekFields ISO = WeekFields.ISO;
            Map<String, Long> minutesPerIsoWeek = minutesPerDay.entrySet().stream()
                    .collect(Collectors.groupingBy(
                            e -> {
                                LocalDate d = e.getKey();
                                int y = d.get(ISO.weekBasedYear());
                                int w = d.get(ISO.weekOfWeekBasedYear());
                                return y + "-W" + w; // key like "2025-W43"
                            },
                            Collectors.summingLong(Map.Entry::getValue)
                    ));

            long regularMinutes = 0;
            long otMinutes = 0;
            for (Map.Entry<String, Long> wk : minutesPerIsoWeek.entrySet()) {
                long weekTotal = wk.getValue();
                if (weekTotal <= weeklyLimitMinutes) {
                    regularMinutes += weekTotal;
                } else {
                    regularMinutes += weeklyLimitMinutes;
                    otMinutes += (weekTotal - weeklyLimitMinutes);
                }
            }

            // Compute wages (round down to whole hours for wage; change if you pay partial hours)
            long regularHours = regularMinutes / 60;
            long otHours = otMinutes / 60;
            long regularWage = regularHours * regularRate;
            long otWage = otHours * otRate;
            String employeeName = employeeOptional.get().getFirstName().trim() + " " + employeeOptional.get().getLastName().trim();
            String email = employeeOptional.get().getEmail().trim();

            payrollRows.add(EmployeePayrollDTO.builder()
                    .employeeId(employeeId)
                    .employeeName(employeeName)
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
                    .build());
            emailList.add(email);
        }
        byte[] pdfContent = pdfService.generatePayrollPDF(payrollRows, startDay, endDay);
        for (String email : emailList) {
            emailService.sendPayrollPdfEmail(email, startDay, endDay, pdfContent, null);
        }
        return getCompleteResponse(errorCodeRepository, CREATE_PAYROLL_SUCCESS, PAYROLL.name(), null);
    }
}
