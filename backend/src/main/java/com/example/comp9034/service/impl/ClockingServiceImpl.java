package com.example.comp9034.service.impl;

import static com.example.comp9034.enums.CommonEnum.CLOCKING;
import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.ALREADY_CLOCK_IN;
import static com.example.comp9034.enums.ErrorCodeEnum.BREAK_CREATED;
import static com.example.comp9034.enums.ErrorCodeEnum.CLOCKING_CREATED;
import static com.example.comp9034.enums.ErrorCodeEnum.CLOCK_OUT_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.END_BREAK_SUCCESS;
import static com.example.comp9034.enums.ErrorCodeEnum.INTERNAL_SERVER_ERROR;
import static com.example.comp9034.enums.ErrorCodeEnum.NO_CLOCK_IN;
import static com.example.comp9034.enums.ErrorCodeEnum.NO_EXISTING_BREAK;
import static com.example.comp9034.enums.ErrorCodeEnum.USER_NOT_FOUND;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import com.example.comp9034.dto.request.BreakEndDTO;
import com.example.comp9034.dto.request.BreakStartDTO;
import com.example.comp9034.dto.request.ClockDTO;
import com.example.comp9034.entity.BreakEntity;
import com.example.comp9034.entity.ClockingEntity;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.repository.BreakRepository;
import com.example.comp9034.repository.ClockingRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.ClockingService;
import com.example.comp9034.exception_handler.BusinessException;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ClockingServiceImpl implements ClockingService {
    private final ClockingRepository clockingRepository;
    private final UserRepository userRepository;
    private final BreakRepository breakRepository;
    private final ErrorCodeRepository errorCodeRepository;

    public ClockingServiceImpl(ClockingRepository clockingRepository, UserRepository userRepository, BreakRepository breakRepository, ErrorCodeRepository errorCodeRepository) {
        this.clockingRepository = clockingRepository;
        this.userRepository = userRepository;
        this.breakRepository = breakRepository;
        this.errorCodeRepository = errorCodeRepository;
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
                return getCompleteResponse(errorCodeRepository, ALREADY_CLOCK_IN, COMMON.name(), null);
            }
    
            ClockingEntity clocking = new ClockingEntity();
            clocking.setClockInTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            clocking.setEmployeeId(existingUser.getEmployeeId());
            clockingRepository.save(clocking);

            log.info("Clock in successfully for cardId {}", dto.getCardId());
            return getCompleteResponse(errorCodeRepository, CLOCKING_CREATED, CLOCKING.name(), null);
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
                return getCompleteResponse(errorCodeRepository, NO_CLOCK_IN, COMMON.name(), null);
            }

            var entity  = existingClocking.get();
            entity.setClockOutTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            clockingRepository.save(entity);
            return getCompleteResponse(errorCodeRepository, CLOCK_OUT_SUCCESS, COMMON.name(), null);
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
                return getCompleteResponse(errorCodeRepository, NO_CLOCK_IN, COMMON.name(), null);
            }

            BreakEntity entity = new BreakEntity();
            entity.setClockingId(existingClocking.get().getId());
            entity.setReason(dto.getReason());
            entity.setBreakStartTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            breakRepository.save(entity);

            return getCompleteResponse(errorCodeRepository, BREAK_CREATED, COMMON.name(), null);
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
                return getCompleteResponse(errorCodeRepository, NO_CLOCK_IN, COMMON.name(), null);
            }

            var existingBreak = breakRepository.findByClockingIdAndBreakEndTimeIsNull(existingClocking.get().getId());
            if (existingClocking.isEmpty()) {
                return getCompleteResponse(errorCodeRepository, NO_EXISTING_BREAK, COMMON.name(), null);
            }

            var entity = existingBreak.get();
            entity.setBreakEndTime(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
            breakRepository.save(entity);

            return getCompleteResponse(errorCodeRepository, END_BREAK_SUCCESS, COMMON.name(), null);
        }
        catch (Exception e) {
            String message = "There has been an error in ending break for cardId " + dto.getCardId() + ": " + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }
}
