package com.example.comp9034.service.impl;

import static com.example.comp9034.enums.CommonEnum.CLOCKING;
import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.ALREADY_CLOCK_IN;
import static com.example.comp9034.enums.ErrorCodeEnum.BREAK_CREATED;
import static com.example.comp9034.enums.ErrorCodeEnum.CLOCKING_CREATED;
import static com.example.comp9034.enums.ErrorCodeEnum.CLOCK_OUT_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.DELETE_CLOCKING_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.END_BREAK_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.GET_CLOCKING_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.INTERNAL_SERVER_ERROR;
import static com.example.comp9034.enums.ErrorCodeEnum.INVALID_INPUT;
import static com.example.comp9034.enums.ErrorCodeEnum.NO_CLOCK_IN;
import static com.example.comp9034.enums.ErrorCodeEnum.NO_EXISTING_BREAK;
import static com.example.comp9034.enums.ErrorCodeEnum.UPDATE_CLOCKING_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.USER_NOT_FOUND;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.comp9034.dto.request.BreakEndDTO;
import com.example.comp9034.dto.request.BreakStartDTO;
import com.example.comp9034.dto.request.ClockDTO;
import com.example.comp9034.dto.request.ClockingFilterDTO;
import com.example.comp9034.dto.request.CreateClockingDTO;
import com.example.comp9034.dto.request.UpdateClockingDTO;
import com.example.comp9034.dto.response.ClockingResponseDTO;
import com.example.comp9034.entity.BreakEntity;
import com.example.comp9034.entity.ClockingEntity;
import com.example.comp9034.entity.RoleEntity;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.enums.UserEnum;
import com.example.comp9034.repository.BreakRepository;
import com.example.comp9034.repository.ClockingRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.ClockingService;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.mapper.ClockingMapper;

import static java.time.temporal.TemporalAdjusters.previousOrSame;

import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ClockingServiceImpl implements ClockingService {
    private final ClockingRepository clockingRepository;
    private final UserRepository userRepository;
    private final BreakRepository breakRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final ClockingMapper clockingMapper;

    public ClockingServiceImpl(ClockingRepository clockingRepository, UserRepository userRepository, BreakRepository breakRepository, ErrorCodeRepository errorCodeRepository, ClockingMapper clockingMapper) {
        this.clockingRepository = clockingRepository;
        this.userRepository = userRepository;
        this.breakRepository = breakRepository;
        this.errorCodeRepository = errorCodeRepository;
        this.clockingMapper = clockingMapper;
    }

    @Override
    public CompleteResponse<Object> clockIn(ClockDTO dto) {
        try {
            UserEntity existingUser = userRepository.findByCardId(dto.getCardId())
                .orElseThrow(() -> {
                    String message = "User not found for cardId " + dto.getCardId();
                    log.error(message);
                    return new BusinessException(USER_NOT_FOUND, COMMON.name(), message);
                });
    
            // check if staff has clocked in without clocking out
            if (clockingRepository.existsByEmployeeIdAndClockOutTimeIsNull(existingUser.getEmployeeId())) {
                return getCompleteResponse(errorCodeRepository, ALREADY_CLOCK_IN, CLOCKING.name(), null);
            }
    
            ClockingEntity clocking = new ClockingEntity();
            clocking.setClockInTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            clocking.setEmployeeId(existingUser.getEmployeeId());
            clockingRepository.save(clocking);

            log.info("Clock in successfully for cardId {}", dto.getCardId());
            return getCompleteResponse(errorCodeRepository, CLOCKING_CREATED, CLOCKING.name(), null);
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in clocking in for cardId " + dto.getCardId() + ": " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }



    }

    @Transactional
    @Override
    public CompleteResponse<Object> clockOut(ClockDTO dto) {
        try {
            UserEntity existingUser = userRepository.findByCardId(dto.getCardId())
                .orElseThrow(() -> {
                    String message = "User not found for cardId " + dto.getCardId();
                    log.error(message);
                    return new BusinessException(USER_NOT_FOUND, COMMON.name(), message);
                });

            // check if staff has clocked in without clocking out
            var existingClocking = clockingRepository.findByEmployeeIdAndClockOutTimeIsNull(existingUser.getEmployeeId());
            if (existingClocking.isEmpty()) {
                return getCompleteResponse(errorCodeRepository, NO_CLOCK_IN, CLOCKING.name(), null);
            }

            var entity  = existingClocking.get();
            entity.setClockOutTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            clockingRepository.save(entity);
            return getCompleteResponse(errorCodeRepository, CLOCK_OUT_SUCCESS, CLOCKING.name(), null);
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in clocking out for cardId " + dto.getCardId() + ": " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    @Override
    public CompleteResponse<Object> breakStart(BreakStartDTO dto) {
        try {
            UserEntity existingUser = userRepository.findByCardId(dto.getCardId())
                .orElseThrow(() -> {
                    String message = "User not found for cardId " + dto.getCardId();
                    log.error(message);
                    return new BusinessException(USER_NOT_FOUND, COMMON.name(), message);
                });

            // check if staff has clocked in without clocking out
            var existingClocking = clockingRepository.findByEmployeeIdAndClockOutTimeIsNull(existingUser.getEmployeeId());
            if (existingClocking.isEmpty()) {
                return getCompleteResponse(errorCodeRepository, NO_CLOCK_IN, CLOCKING.name(), null);
            }

            BreakEntity entity = new BreakEntity();
            entity.setClockingId(existingClocking.get().getId());
            entity.setReason(dto.getReason());
            entity.setBreakStartTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            breakRepository.save(entity);

            return getCompleteResponse(errorCodeRepository, BREAK_CREATED, CLOCKING.name(), null);
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in creating break for cardId " + dto.getCardId() + ": " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    @Transactional
    @Override
    public CompleteResponse<Object> breakEnd(BreakEndDTO dto) {
        try {
            UserEntity existingUser = userRepository.findByCardId(dto.getCardId())
                .orElseThrow(() -> {
                    String message = "User not found for cardId " + dto.getCardId();
                    log.error(message);
                    return new BusinessException(USER_NOT_FOUND, COMMON.name(), message);
                });

            // check if staff has clocked in without clocking out
            var existingClocking = clockingRepository.findByEmployeeIdAndClockOutTimeIsNull(existingUser.getEmployeeId());
            if (existingClocking.isEmpty()) {
                return getCompleteResponse(errorCodeRepository, NO_CLOCK_IN, CLOCKING.name(), null);
            }

            var existingBreak = breakRepository.findByClockingIdAndBreakEndTimeIsNull(existingClocking.get().getId());
            if (existingClocking.isEmpty()) {
                return getCompleteResponse(errorCodeRepository, NO_EXISTING_BREAK, CLOCKING.name(), null);
            }

            var entity = existingBreak.get();
            entity.setBreakEndTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            breakRepository.save(entity);

            return getCompleteResponse(errorCodeRepository, END_BREAK_SUCCESS, CLOCKING.name(), null);
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in ending break for cardId " + dto.getCardId() + ": " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    @Override
    public CompleteResponse<Object> getClockings(ClockingFilterDTO dto) {
        try {
            Specification<ClockingEntity> spec = Specification.where(null);

            if (!dto.getStartDate().isBefore(dto.getEndDate())) {
                String msg = "End date must be after start date";
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, CLOCKING.name(), msg);
            }
            LocalDateTime start = dto.getStartDate().atStartOfDay();        // 00:00:00
            LocalDateTime end = dto.getEndDate().atTime(LocalTime.MAX);     // 23:59:59.999999999

    
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("clockInTime"), start));
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("clockInTime"), end));
    
            if (dto.getEmployeeId() != null) {
                spec = spec.and((root, query, cb) -> cb.equal(root.get("employeeId"), dto.getEmployeeId()));
            }
    
            Pageable pageable = PageRequest.of(
                dto.getPage(),
                dto.getSize(),
                dto.getSortDir().equalsIgnoreCase("asc") ? Sort.by(dto.getSortBy()).ascending() : Sort.by(dto.getSortBy()).descending());
    
            Page<ClockingEntity> page = clockingRepository.findAll(spec, pageable);
    
            var dtoPage = page.map(clockingMapper::toClockingResponseDTO);
            
            return getCompleteResponse(errorCodeRepository, GET_CLOCKING_SUCCESS, CLOCKING.name(), dtoPage);
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in fetching clocking: " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    @Override
    public CompleteResponse<Object> createClocking(CreateClockingDTO dto) {
        try {
            if (!dto.getClockInTime().isBefore(dto.getClockOutTime())) {
                String msg = "clock out time must be after clock in time";
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, CLOCKING.name(), msg);
            }

            if (clockingRepository.existOverlap(dto.getEmployeeId(), dto.getClockInTime(), dto.getClockOutTime())) {
                String msg = "overlap clocking for employeeId: " + dto.getEmployeeId();
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, CLOCKING.name(), msg);
            }

            var entity = new ClockingEntity();
            entity = clockingMapper.toClockingEntity(dto);
            clockingRepository.save(entity);

            return getCompleteResponse(errorCodeRepository, CLOCKING_CREATED, CLOCKING.name(), clockingMapper.toClockingResponseDTO(entity));
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in creating clocking: " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    @Transactional
    @Override
    public CompleteResponse<Object> updateClocking(UpdateClockingDTO dto, int clockingId) {
        try {
            var existingClocking = clockingRepository.findById(clockingId)
                .orElseThrow(() -> {
                    String message = "CLocking not found with id: " + clockingId;
                    log.error(message);
                    return new BusinessException(INVALID_INPUT, CLOCKING.name(), message);
                });

            if (!dto.getClockInTime().isBefore(dto.getClockOutTime())) {
                String msg = "clock out time must be after clock in time";
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, CLOCKING.name(), msg);
            }
            
            if (clockingRepository.existOverlapExcept(dto.getEmployeeId(), dto.getClockInTime(), dto.getClockOutTime(), clockingId)) {
                String msg = "overlap clocking for employeeId: " + dto.getEmployeeId();
                log.error(msg);
                throw new BusinessException(INVALID_INPUT, CLOCKING.name(), msg);
            }
            
            clockingMapper.updateEntityFromDto(dto, existingClocking);
            clockingRepository.save(existingClocking);

            return getCompleteResponse(errorCodeRepository, UPDATE_CLOCKING_SUCCESS, CLOCKING.name(), clockingMapper.toClockingResponseDTO(existingClocking));
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in updating clocking: " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    @Override
    public CompleteResponse<Object> deleteClocking(int clockingId) {
        try {
            var existingClocking = clockingRepository.findById(clockingId)
                .orElseThrow(() -> {
                    String message = "CLocking not found with id: " + clockingId;
                    log.error(message);
                    return new BusinessException(INVALID_INPUT, CLOCKING.name(), message);
                });

            clockingRepository.delete(existingClocking);

            return getCompleteResponse(errorCodeRepository, DELETE_CLOCKING_SUCCESS, CLOCKING.name(), null);
        }
        catch (BusinessException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "There has been an error in updating clocking: " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }
}
