package com.example.comp9034.service.impl;

import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.DeleteRosterDTO;
import com.example.comp9034.dto.request.GetRosterByWeekDTO;
import com.example.comp9034.dto.response.CreateRosterResponseDTO;
import com.example.comp9034.dto.response.DeleteRosterResponseDTO;
import com.example.comp9034.dto.response.GetRosterByWeekResponseDTO;
import com.example.comp9034.entity.RosterEntity;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.enums.RosterEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.RosterRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.RosterService;

import lombok.extern.log4j.Log4j2;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Optional;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.enums.RosterEnum.DRAFT;
import static com.example.comp9034.enums.RosterEnum.UPDATED;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;
import static com.example.comp9034.util.Common.convertStringToLong;
import static com.example.comp9034.util.Common.getConfigValue;
import static java.time.temporal.TemporalAdjusters.previousOrSame;

@Service
@Log4j2
public class RosterServiceImpl implements RosterService {
    private final RosterRepository rosterRepository;
    private final UserRepository userRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final ConfigurationRepository configurationRepository;

    public RosterServiceImpl(RosterRepository rosterRepository, UserRepository userRepository, ErrorCodeRepository errorCodeRepository, ConfigurationRepository configurationRepository) {
        this.rosterRepository = rosterRepository;
        this.userRepository = userRepository;
        this.errorCodeRepository = errorCodeRepository;
        this.configurationRepository = configurationRepository;
    }


    @Override
    public CompleteResponse<Object> createRoster(CreateRosterDTO createRosterDTO) {
        try {
            String employeeId = createRosterDTO.getEmployeeId().trim();

            // 1) Check employee exists & active
            Optional<UserEntity> userOptional = userRepository.findByEmployeeIdAndActive(employeeId, true);
            if (userOptional.isEmpty()) {
                String msg = "Employee " + employeeId + " does not exist or is inactive.";
                log.error(msg);
                throw new BusinessException(USER_NOT_FOUND, ROSTER.name(), msg);
            }
            LocalDateTime startTime = createRosterDTO.getStartTime();
            LocalDateTime endTime = createRosterDTO.getEndTime();

            if (!endTime.isAfter(startTime)) {
                String msg = "End time for the shift must be after start time";
                log.info(msg);
                throw new BusinessException(INVALID_INPUT, ROSTER.name(), msg);
            }

            LocalDate shiftDate = startTime.toLocalDate();
            LocalDate weekStart = shiftDate.with(previousOrSame(java.time.DayOfWeek.MONDAY));

            // Overlap check for same employee, any intersecting shift
            boolean hasOverlap = rosterRepository.existsOverlap(employeeId, startTime, endTime);
            if (hasOverlap) {
                String msg = "Employee " + employeeId + " already has a shift overlapping from " + startTime + " - " + endTime;
                log.info(msg);
                throw new BusinessException(INVALID_INPUT, ROSTER.name(), msg);
            }

            // 30 min if > 4h and no override
            long shiftDurationMin = java.time.Duration.between(startTime, endTime).toMinutes();
            int breakMin = (createRosterDTO.getBreakMinutes() > 0)
                    ? createRosterDTO.getBreakMinutes()
                    : (shiftDurationMin > 240 ? 30 : 0);

            // 5) Weekly cap (US-3.2)
            long currentWeekMin = rosterRepository.sumWeekMinutes(employeeId, weekStart);
            long limitMinutes = convertStringToLong(getConfigValue(WEEKLY_LIMIT_MINUTES.name(), configurationRepository, "2280"));
            long remainingMinutes = Math.max(0L, limitMinutes - currentWeekMin);
            if (currentWeekMin > limitMinutes) {
                String msg = "Exceed the weekly hours limit" +
                        "Current scheduled hours: " + (currentWeekMin / 60.0) + ". " +
                        "Maximum additional hours allowed: " + (remainingMinutes / 60.0) + ".";
                log.info(msg);
                throw new BusinessException(WEEKLY_HOUR_LIMIT_EXCEEDED, ROSTER.name(), msg);
            }

            RosterEntity roster = new RosterEntity(breakMin, shiftDate, endTime, startTime,
                    employeeId, DRAFT, SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());
            rosterRepository.save(roster);
            log.info("Created shift {} for employee {}", roster.getId(), employeeId);

            // 8) Build response DTO (swap with your mapper if desired)
            CreateRosterResponseDTO response = new CreateRosterResponseDTO().toBuilder()
                    .createdBy(roster.getCreatedBy())
                    .date(roster.getDate())
                    .createdAt(roster.getCreatedAt())
                    .breakMinutes(roster.getBreakMinutes())
                    .employeeId(roster.getEmployeeId())
                    .endTime(roster.getEndTime())
                    .status(roster.getStatus())
                    .startTime(roster.getStartTime())
                    .location(roster.getLocation())
                    .remainingMinutes(remainingMinutes)
                    .build();
            return getCompleteResponse(errorCodeRepository, CREATE_ROSTER_SUCCESS, ROSTER.name(), response);

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error creating roster for employee " +
                    createRosterDTO.getEmployeeId() + " " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    private LocalDateTime parseToLocalDateTime(String value) {
        try {
            // e.g. "2025-09-10T09:00:00+09:30"
            return java.time.OffsetDateTime.parse(value).toLocalDateTime();
        } catch (java.time.format.DateTimeParseException ignore) {
            // e.g. "2025-09-10T09:00:00"
            return java.time.LocalDateTime.parse(value);
        }
    }


    @Override
    public CompleteResponse<Object> getRoster(GetRosterByWeekDTO request) {
        try {
            // 1) Parse & normalize to week range (Mon..Sun)
            LocalDate anyDate = LocalDate.parse(request.getWeekStart());
            LocalDate weekStart = anyDate.with(previousOrSame(DayOfWeek.MONDAY));
            LocalDate weekEnd = weekStart.plusDays(6);

            // 2) Paging + sort
            int page = request.getPage() == null ? 0 : request.getPage();
            int size = request.getSize() == null ? 100 : request.getSize();
            Pageable pageable = (Pageable) PageRequest.of(page, size, Sort.by("startTime").ascending());

            // 3) Fetch
            String employeeId = (request.getEmployeeId() == null || request.getEmployeeId().isBlank())
                    ? null : request.getEmployeeId().trim();

//            Page<RosterEntity> pageResult;
//            boolean includeCancelled = Boolean.TRUE.equals(request.getIncludeCancelled());
//
//            if (employeeId == null) {
//                pageResult = includeCancelled
//                        ? rosterRepository.findByDateBetweenAndIsCancelledFalse(weekStart, weekEnd, pageable) // swap to method incl. cancelled if you add it
//                        : rosterRepository.findByDateBetweenAndIsCancelledFalse(weekStart, weekEnd, pageable);
//            } else {
//                pageResult = includeCancelled
//                        ? rosterRepository.findByEmployeeIdAndDateBetweenAndIsCancelledFalse(employeeId, weekStart, weekEnd, pageable)
//                        : rosterRepository.findByEmployeeIdAndDateBetweenAndIsCancelledFalse(employeeId, weekStart, weekEnd, pageable);
//            }
//
//            // 4) Map
//            List<CreateRosterDTO> items = pageResult.getContent().stream().map(e ->
//                    RosterItemDTO.builder()
//                            .id(e.getId())
//                            .employeeId(e.getEmployeeId())
//                            .startTime(e.getStartTime() == null ? null : e.getStartTime().atZone(APP_ZONE).toOffsetDateTime().toString())
//                            .endTime(e.getEndTime() == null ? null : e.getEndTime().atZone(APP_ZONE).toOffsetDateTime().toString())
//                            .date(e.getDate())
//                            .location(e.getLocation())
//                            .breakMinutes(e.getBreakMinutes() == null ? 0 : e.getBreakMinutes())
//                            .status(e.getStatus())
//                            .createdBy(e.getCreatedBy())
//                            .createdAt(e.getCreatedAt())
//                            .build()
//            ).toList();

            GetRosterByWeekResponseDTO response = GetRosterByWeekResponseDTO.builder().build();
//                    .weekStart(weekStart)
//                    .weekEndInclusive(weekEnd)
//                    .items(items)
//                    .page(pageResult.getNumber())
//                    .size(pageResult.getSize())
//                    .totalElements(pageResult.getTotalElements())
//                    .totalPages(pageResult.getTotalPages())
//                    .build();

            return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, ROSTER.name(), response);

        } catch (BusinessException e) {
            throw e;
        } catch (DateTimeParseException ex) {
            throw new BusinessException(INVALID_INPUT, ROSTER.name(),
                    "weekStart must be ISO date (e.g., 2025-09-08)");
        } catch (Exception e) {
            String msg = "Error fetching roster for week " + request.getWeekStart() + " " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, ROSTER.name(), msg);
        }

    }

    @Override
    public CompleteResponse<Object> deleteRoster(DeleteRosterDTO request) {
        String employeeId = request.getEmployeeId().trim();
        try {
            LocalDateTime startTime = request.getStartTime();
            LocalDateTime endTime = request.getEndTime();
            boolean hard = Boolean.TRUE.equals(request.getHardDelete());

            RosterEntity rosterEntity = rosterRepository.findByStartTimeAndEndTimeAndEmployeeId(startTime, endTime, employeeId)
                    .orElseThrow(() -> {
                        String msg = "Shift from " + startTime + " to " + endTime + " for employee " + employeeId + " not found.";
                        log.error(msg);
                        return new BusinessException(ROSTER_NOT_FOUND, ROSTER.name(), msg);
                    });

            // Dont allow modify past roster
            if (rosterEntity.getStatus() == RosterEnum.ARCHIVED) {
                String msg = "Archived roster cannot be modified.";
                log.info(msg);
                throw new BusinessException(ROSTER_IMMUTABLE, ROSTER.name(), msg);
            }
            //
            if (!hard && Boolean.TRUE.equals(rosterEntity.getIsCancelled())) {
                String msg = "Shift from " + startTime + " to " + endTime + " is already cancelled.";
                log.info(msg);
                throw new BusinessException(SHIFT_ALREADY_CANCELED, ROSTER.name(), msg);
            }
            DeleteRosterResponseDTO response;
            long rosterId = rosterEntity.getId();
            if (hard) {
                // 3a) HARD DELETE (use sparingly; history is lost)
                rosterRepository.delete(rosterEntity);
                log.info("Hard-deleted shift {} for employee {}", rosterId, employeeId);
                response = DeleteRosterResponseDTO.builder()
                        .shiftId(rosterId)
                        .employeeId(employeeId)
                        .action("DELETED")
                        .status(null)
                        .isCancelled(null)
                        .processedAt(LocalDateTime.now())
                        .build();
            } else {
                rosterEntity.setIsCancelled(true);
                rosterEntity.setStatus(UPDATED);
                rosterRepository.save(rosterEntity);
                log.info("Cancell shift {} for employee {}", rosterId, employeeId);

                response = DeleteRosterResponseDTO.builder()
                        .shiftId(rosterId)
                        .employeeId(employeeId)
                        .action("CANCELLED")
                        .status(rosterEntity.getStatus())
                        .isCancelled(true)
                        .processedAt(LocalDateTime.now())
                        .build();
            }

            return getCompleteResponse(
                    errorCodeRepository, DELETE_ROSTER_SUCCESS, ROSTER.name(), response);

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error deleting roster shift for user {}" + employeeId + " " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    @Override
    public CompleteResponse<Object> updateRoster(CreateRosterDTO registerRequest) {
        return null;
    }
}