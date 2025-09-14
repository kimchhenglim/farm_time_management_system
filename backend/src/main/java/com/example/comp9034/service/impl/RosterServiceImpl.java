package com.example.comp9034.service.impl;

import com.example.comp9034.dto.RosterDTO;
import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.EditRosterDTO;
import com.example.comp9034.dto.response.CreateRosterResponseDTO;
import com.example.comp9034.dto.response.DeleteRosterResponseDTO;
import com.example.comp9034.dto.response.GetRosterByWeekResponseDTO;
import com.example.comp9034.entity.RosterEntity;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.enums.RosterEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.mapper.RosterMapper;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.RosterRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.RosterService;
import org.springframework.data.jpa.domain.Specification;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import jakarta.persistence.criteria.Predicate;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.enums.RosterEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;
import static com.example.comp9034.util.Common.convertStringToLong;
import static com.example.comp9034.util.Common.getConfigValue;
import static com.example.comp9034.util.DateTimeFormatUtil.reformatDateTime;
import static java.time.temporal.TemporalAdjusters.previousOrSame;

@Service
@Log4j2
public class RosterServiceImpl implements RosterService {
    private final RosterRepository rosterRepository;
    private final UserRepository userRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final ConfigurationRepository configurationRepository;
    private final RosterMapper rosterMapper;

    public RosterServiceImpl(RosterRepository rosterRepository, UserRepository userRepository, ErrorCodeRepository errorCodeRepository, ConfigurationRepository configurationRepository, RosterMapper rosterMapper) {
        this.rosterRepository = rosterRepository;
        this.userRepository = userRepository;
        this.errorCodeRepository = errorCodeRepository;
        this.configurationRepository = configurationRepository;
        this.rosterMapper = rosterMapper;
    }

    @Override
    public CompleteResponse<Object> createRoster(CreateRosterDTO createRosterDTO) {
        try {
            String employeeId = createRosterDTO.getEmployeeId().trim();
            Optional<UserEntity> userOptional = userRepository.findByEmployeeIdAndActive(employeeId, true);
            if (userOptional.isEmpty()) {
                String msg = "Employee " + employeeId + " does not exist or is inactive.";
                log.error(msg);
                throw new BusinessException(USER_NOT_FOUND, ROSTER.name(), msg);
            }
            LocalDateTime startTime = createRosterDTO.getStartTime();
            LocalDateTime endTime = createRosterDTO.getEndTime();

            if (startTime.isBefore(LocalDateTime.now()) || endTime.isBefore(LocalDateTime.now())) {
                String msg = "Start time or End time can not be set in the past!";
                log.error("{} for user {}", msg, employeeId);
                throw new BusinessException(INVALID_INPUT, ROSTER.name(), msg);
            }

            if (!endTime.isAfter(startTime)) {
                String msg = "End time for the shift must be after start time to create a new roster";
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, ROSTER.name(), msg);
            }

            LocalDate shiftDate = startTime.toLocalDate();
            LocalDate weekStart = shiftDate.with(previousOrSame(DayOfWeek.MONDAY));

            // Overlap check for same employee, any intersecting shift
            boolean hasOverlap = rosterRepository.existsOverlap(employeeId, startTime, endTime);
            if (hasOverlap) {
                String msg = "Employee " + employeeId + " already has a shift overlapping from " + reformatDateTime(startTime) + " - " + reformatDateTime(endTime);
                log.info(msg);
                throw new BusinessException(INVALID_INPUT, ROSTER.name(), msg);
            }

            // 30 min if > 4h
            long shiftDurationMin = Duration.between(startTime, endTime).toMinutes();
            int breakMin = (createRosterDTO.getBreakMinutes() > 0) ? createRosterDTO.getBreakMinutes() : (shiftDurationMin > 240 ? 30 : 0);

            // Weekly cap
            long currentWeekMin = rosterRepository.sumWeekMinutes(employeeId, weekStart);
            long limitMinutes = convertStringToLong(getConfigValue(WEEKLY_LIMIT_MINUTES.name(), configurationRepository, "2280"));
            long minShiftMinutes = convertStringToLong(getConfigValue(SHIFT_MIN_MINUTES.name(), configurationRepository, "120"));
            long maxShiftMinutes = convertStringToLong(getConfigValue(SHIFT_MAX_MINUTES.name(), configurationRepository, "720"));
            long remainingMinutes = Math.max(0L, limitMinutes - currentWeekMin);
            if (shiftDurationMin > remainingMinutes) {
                String msg = "Exceed the weekly hours limit" + "Current scheduled hours: " + (currentWeekMin / 60.0) + ". " + "Current assigned hours for this current shift: " + (shiftDurationMin / 60.0) + ". " + "Maximum additional hours allowed: " + (remainingMinutes / 60.0) + ".";
                log.error(msg);
                throw new BusinessException(WEEKLY_HOUR_LIMIT_EXCEEDED, ROSTER.name(), msg);
            }

            if (shiftDurationMin < minShiftMinutes || shiftDurationMin > maxShiftMinutes) {
                log.error("Shift duration does not meet requirement!: {}", shiftDurationMin);
                throw new BusinessException(SHIFT_DURATION_INVALID, ROSTER.name(), null);
            }
            UserEntity user = userRepository.findByEmployeeId(employeeId).orElseThrow(() -> {
                String msg = "Employee with ID: " + employeeId + " not found!";
                log.error(msg);
                return new BusinessException(USER_NOT_FOUND, ROSTER.name(), msg);
            });

            RosterEntity roster = new RosterEntity(breakMin, shiftDate, endTime, startTime, employeeId, DRAFT.name(), SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString(), createRosterDTO.getLocation(), user.getFirstName() + " " + user.getLastName());
            rosterRepository.save(roster);
            log.info("Created shift {} for employee {}", roster.getId(), employeeId);
            CreateRosterResponseDTO response = new CreateRosterResponseDTO().toBuilder().createdBy(roster.getCreatedBy()).date(roster.getDate()).createdAt(roster.getCreatedAt()).breakMinutes(roster.getBreakMinutes()).employeeId(roster.getEmployeeId()).endTime(reformatDateTime(roster.getEndTime())).status(RosterEnum.valueOf(roster.getStatus())).startTime(reformatDateTime(roster.getStartTime())).location(roster.getLocation()).remainingMinutes(remainingMinutes).employeeName(roster.getEmployeeName()).build();
            return getCompleteResponse(errorCodeRepository, CREATE_ROSTER_SUCCESS, ROSTER.name(), response);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error creating roster for employee " + createRosterDTO.getEmployeeId() + " " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    @Override
    public CompleteResponse<Object> getRoster(String weekStart, List<String> employeeIdList, List<String> locationList, boolean includeCancelled, int page, int size) {
        try {
            // Validate & normalize inputs
            if (weekStart == null || weekStart.trim().isEmpty()) {
                String msg = "weekStart cannot be null or empty";
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, ROSTER.name(), msg);
            }

            LocalDate weekAnyDate = LocalDate.parse(weekStart.trim(), DateTimeFormatter.ISO_LOCAL_DATE);
            LocalDate monday = weekAnyDate.with(previousOrSame(DayOfWeek.MONDAY));
            LocalDate nextMonday = monday.plusWeeks(1);
            LocalDateTime startInclusive = monday.atStartOfDay();
            LocalDateTime endExclusive = nextMonday.atStartOfDay();

            size = Math.min(size, 500);

            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "startTime").and(Sort.by("employeeId")));

            // 2) Build Specification
            Specification<RosterEntity> spec = buildWeekSpec(startInclusive, endExclusive, employeeIdList, safeList(locationList), Boolean.TRUE.equals(includeCancelled));
            Page<RosterEntity> result = rosterRepository.findAll(spec, pageable);
            log.info("Fetched {} rosters (page {}/{}) for week {} to {}", result.getNumberOfElements(), result.getNumber() + 1, result.getTotalPages(), monday, nextMonday.minusDays(1));
            List<RosterDTO> rosterList = rosterMapper.toWeekDtos(result.getContent());
            GetRosterByWeekResponseDTO payload = GetRosterByWeekResponseDTO.builder().weekStart(monday).weekEnd(nextMonday.minusDays(1)).page(page).size(size).totalElements(result.getTotalElements()).totalPages(result.getTotalPages()).rosterList(rosterList).build();
            return getCompleteResponse(errorCodeRepository, GET_ROSTER_BY_WEEK_SUCCESS, ROSTER.name(), payload);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error getting rosters for weekStart " + weekStart + " " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    private Specification<RosterEntity> buildWeekSpec(LocalDateTime startTime, LocalDateTime endTime, List<String> employeeIds, List<String> locations, boolean includeCancelled) {
        return (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();

            // overlap: (start < weekEnd) AND (end > weekStart)
            ps.add(cb.lessThan(root.get("startTime"), endTime));
            ps.add(cb.greaterThan(root.get("endTime"), startTime));

            log.info("employeeIds: {}", employeeIds);
            if (employeeIds != null && !employeeIds.isEmpty()) {
                ps.add(root.get("employeeId").in(employeeIds));
            }

            if (locations != null && !locations.isEmpty()) {
                ps.add(root.get("location").in(locations));
            }

            if (!includeCancelled) {
                ps.add(cb.or(cb.isFalse(root.get("isCancelled")), cb.isNull(root.get("isCancelled"))));
            }
            return cb.and(ps.toArray(new Predicate[0]));
        };
    }

    private List<String> safeList(List<String> list) {
        return (list == null) ? Collections.emptyList() : list;
    }

    @Override
    public CompleteResponse<Object> deleteRoster(Long rosterId, Boolean hard) {
        try {
            RosterEntity rosterEntity = rosterRepository.findById(rosterId).orElseThrow(() -> {
                String msg = "Shift with ID: " + rosterId + " not found.";
                log.error(msg);
                return new BusinessException(ROSTER_NOT_FOUND, ROSTER.name(), msg);
            });

            // Dont allow modify past roster
            if (Objects.equals(rosterEntity.getStatus(), ARCHIVED.name())) {
                String msg = "Archived roster cannot be modified.";
                rosterEntity.setStatus(ARCHIVED.name());
                rosterRepository.save(rosterEntity);
                log.error(msg);
                throw new BusinessException(ROSTER_IMMUTABLE, ROSTER.name(), msg);
            }
            if (!Boolean.TRUE.equals(hard) && Boolean.TRUE.equals(rosterEntity.getIsCancelled())) {
                String msg = "Shift with ID: " + rosterId + " is already cancelled.";
                log.error(msg);
                throw new BusinessException(SHIFT_ALREADY_CANCELED, ROSTER.name(), msg);
            }
            String employeeId = rosterEntity.getEmployeeId();
            DeleteRosterResponseDTO response;
            if (Boolean.TRUE.equals(hard)) {
                // Hard delete
                rosterRepository.delete(rosterEntity);
                log.info("Hard-deleted shift {} for employee {}", rosterId, employeeId);
                response = DeleteRosterResponseDTO.builder().shiftId(rosterId).employeeId(employeeId).action("DELETED").status(null).isCancelled(null).processedAt(LocalDateTime.now()).build();
            } else {
                rosterEntity.setIsCancelled(true);
                rosterEntity.setStatus(UPDATED.name());
                rosterRepository.save(rosterEntity);
                log.info("Cancel shift {} for employee {}", rosterId, employeeId);
                response = DeleteRosterResponseDTO.builder().shiftId(rosterId).employeeId(employeeId).action("CANCELLED").status(RosterEnum.valueOf(rosterEntity.getStatus())).isCancelled(true).processedAt(LocalDateTime.now()).build();
            }
            return getCompleteResponse(errorCodeRepository, DELETE_ROSTER_SUCCESS, ROSTER.name(), response);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error deleting roster shift with ID {}";
            log.error(msg, rosterId);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    @Override
    public CompleteResponse<Object> updateRoster(EditRosterDTO request) {
        Long rosterId = request.getRosterId();
        try {
            RosterEntity rosterEntity = rosterRepository.findById(rosterId).orElseThrow(() -> {
                String msg = "Roster with ID: " + rosterId + " not found.";
                log.error(msg);
                return new BusinessException(ROSTER_NOT_FOUND, ROSTER.name(), msg);
            });

            if (Objects.equals(rosterEntity.getStatus(), ARCHIVED.name())) {
                String msg = "Archived roster cannot be edited.";
                log.error(msg);
                throw new BusinessException(ROSTER_IMMUTABLE, ROSTER.name(), msg);
            }

            if (!request.getEmployeeId().isEmpty()) {
                String employeeId = request.getEmployeeId();
                UserEntity user = userRepository.findByEmployeeId(employeeId).orElseThrow(() -> {
                    String msg = "Employee with ID: " + employeeId + " not found to update the roster!";
                    log.error(msg);
                    return new BusinessException(USER_NOT_FOUND, ROSTER.name(), msg);
                });
                rosterEntity.setEmployeeId(request.getEmployeeId());
                rosterEntity.setEmployeeName(user.getFirstName() + " " + user.getLastName());
            }
            rosterEntity.setStartTime(request.getStartTime());
            rosterEntity.setEndTime(request.getEndTime());
            rosterEntity.setLocation(request.getLocation());
            rosterEntity.setStatus(UPDATE_ROSTER_SUCCESS.name());
            rosterRepository.save(rosterEntity);
            log.info("Update Roster ID {} succesfully", rosterId.toString());
            return getCompleteResponse(errorCodeRepository, UPDATE_ROSTER_SUCCESS, ROSTER.name(), request);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error updating roster shift with ID {}";
            log.error(msg, request);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    @Override
    public CompleteResponse<Object> getRosterLocations(String keyword) {
        try {
            if (keyword != null && keyword.trim().isEmpty()) {
                keyword = null;
            }
            List<String> locationList = rosterRepository.findDistinctLocations(keyword);
            return getCompleteResponse(errorCodeRepository, UPDATE_ROSTER_SUCCESS, ROSTER.name(), locationList);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error getting roster locations with keyword {}";
            log.error(msg, keyword);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }
}