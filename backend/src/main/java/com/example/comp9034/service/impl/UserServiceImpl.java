package com.example.comp9034.service.impl;

import com.example.comp9034.dto.*;
import com.example.comp9034.entity.RoleEntity;
import com.example.comp9034.entity.RosterEntity;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.enums.UserEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.mapper.DataMapper;
import com.example.comp9034.mapper.UserDataMapperHelper;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.RoleRepository;
import com.example.comp9034.repository.RosterRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.UserService;

import jakarta.persistence.criteria.Join;
import lombok.extern.log4j.Log4j2;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;
import static com.example.comp9034.util.DateTimeFormatter.toLocalDate;


@Service
@Log4j2
public class UserServiceImpl implements UserService {
    private final ErrorCodeRepository errorCodeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RosterRepository rosterRepository;
    private final DataMapper dataMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenServiceImpl tokenServiceImpl;

    public UserServiceImpl(ErrorCodeRepository errorCodeRepository, UserRepository userRepository, RoleRepository roleRepository, DataMapper dataMapper, PasswordEncoder passwordEncoder, RosterRepository rosterRepository, TokenServiceImpl tokenServiceImpl) {
        this.errorCodeRepository = errorCodeRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.dataMapper = dataMapper;
        this.passwordEncoder = passwordEncoder;
        this.rosterRepository = rosterRepository;
        this.tokenServiceImpl = tokenServiceImpl;
    }

    @Override
    public CompleteResponse<Object> logout(LogoutDTO loginRequest) {
        String username = loginRequest.getEmail();
        try {
            // Check if the user exists
            Optional<UserEntity> userOptional = userRepository.findByEmailAndActive(loginRequest.getEmail(), true);
            if (userOptional.isEmpty()) {
                log.error("User {} not found to log out!", username);
                throw new BusinessException(USER_NOT_FOUND, LOGOUT.name());
            }
            // Clear security context
            SecurityContextHolder.clearContext();
            log.info("User {} logged out successfully!", username);
            return getCompleteResponse(errorCodeRepository, LOGOUT_SUCCESS, LOGOUT.name(), null);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("There has been an error in logging out user {}!", username, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, LOGOUT.name());
        }
    }

    @Override
    public CompleteResponse<Object> login(LoginDTO loginRequest) {
        try {
            String username = loginRequest.getEmail();
            Optional<UserEntity> userOptional = userRepository.findByEmailAndActive(loginRequest.getEmail(), true);
            // Check if user existed
            if (userOptional.isEmpty()) {
                log.info("User {} does not exist!", username);
                throw new BusinessException(USER_NOT_FOUND, LOGIN.name());
            }
            UserEntity userEntity = userOptional.get();
            if (!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPassword())) {
                log.info("Password does not match for user {}!", username);
                throw new BusinessException(PASSWORD_NOT_CORRECT, LOGIN.name());
            }
            log.info("Current logged-in user: {}", username);
            // Create an authentication object from the user
            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, userEntity.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("User {} roles from token: {}", username, authentication);
            UserDTO responseDto = dataMapper.toUserDto(userEntity);

            if (userEntity.getRole().getName().toUpperCase().equals(UserEnum.ADMIN.name())) {
                String accessToken = tokenServiceImpl.generateAccessToken(username).getResponseBody().getBody().toString();
                responseDto.setLoginToken(accessToken);
            }
            return getCompleteResponse(errorCodeRepository, LOGIN_SUCCESS, LOGIN.name(), responseDto);
        } catch (BusinessException e) {
            throw e;
        } catch (
                Exception e) {
            log.error("There has been an error in logging in for user {}!", loginRequest.getEmail(), e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name());
        }
    }

    @Override
    public CompleteResponse<Object> forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {
        //Check if email existed
        String email = forgotPasswordDTO.getEmail();
        Optional<UserEntity> userOptional = userRepository.findByEmailAndActive(email, true);
        if (userOptional.isEmpty()) {
            log.error("User {} not found to reset password!", email);
            throw new BusinessException(USER_NOT_FOUND, FORGOT_PASSWORD.name());
        }
        UserEntity user = userOptional.get();
        user.setPassword(passwordEncoder.encode(forgotPasswordDTO.getNewPassword()));
        userRepository.save(user);
        log.info("User password has been updated!");
        //Verify otp
//        String verifyOtpErrorCode = otpServiceImpl.verifyOtp(new OtpDTO(username, forgotPasswordDTO.getOtp())).getResponseBody().getCode();
//        if (verifyOtpErrorCode.equals(OTP_VERIFICATION_SUCCESS.getCode())) {
//            user.setPassword(forgotPasswordDTO.getNewPassword());
//            userRepository.save(user);
//            log.info("User password has been updated!");
//        } else {
//            log.error("Update new password failed for user {}!", username);
//            throw new BusinessException(OTP_VERIFICATION_FAIL, REGISTER.name());
//        }
        return getCompleteResponse(errorCodeRepository, PASSWORD_UPDATED_SUCCESS, FORGOT_PASSWORD.name(), null);
    }

    @Override
    public CompleteResponse<Object> createNewUserAdmin(CreateUserDTO registerRequest) {
        try {
            Optional<UserEntity> userOptional = userRepository.findByEmailAndActive(registerRequest.getEmail(), true);
            // Check if email is inputted and has valid form and if taken
            if (userOptional.isPresent()) {
                log.info("Email is not available!");
                throw new BusinessException(EMAIL_TAKEN, REGISTER.name());
            }
//            // Check if the OTP is empty
//            else if (StringUtils.isEmpty(registerRequest.getOtp())) {
//                log.info("OTP is empty/ invalid!");
//                throw new BusinessException(OTP_BLOCKED_OR_NOT_FOUND, REGISTER.name());
//            }
            Optional<RoleEntity> roleOptional = roleRepository.findByName(registerRequest.getRole().toUpperCase());
            if (roleOptional.isEmpty()) {
                log.info("User role is not valid: {}!", registerRequest.getRole());
                throw new BusinessException(INVALID_USER_ROLE, REGISTER.name());
            }
            RoleEntity role = roleOptional.get();
            UserEntity newUser;
            if (registerRequest.getRole().toUpperCase().equals(UserEnum.ADMIN.name())) {
                newUser = new UserEntity(UUID.randomUUID().toString(), registerRequest.getFirstName(), registerRequest.getLastName(),
                        toLocalDate(registerRequest.getDob()), registerRequest.getGender(), registerRequest.getEmail(), registerRequest.getMobileNumber(),
                        registerRequest.getAddress(), registerRequest.getCardId(), registerRequest.getContractType(), registerRequest.getPayRate(), registerRequest.getLocation(), LocalDateTime.now(), role, passwordEncoder.encode(registerRequest.getPassword()));
            } else if (registerRequest.getRole().toUpperCase().equals(UserEnum.STAFF.name())) {
                newUser = new UserEntity(UUID.randomUUID().toString(), registerRequest.getFirstName(), registerRequest.getLastName(),
                        toLocalDate(registerRequest.getDob()), registerRequest.getGender(), registerRequest.getEmail(), registerRequest.getMobileNumber(),
                        registerRequest.getAddress(), registerRequest.getCardId(), registerRequest.getContractType(), registerRequest.getPayRate(), registerRequest.getLocation(), LocalDateTime.now(), role, null);
            } else {
                log.info("User role is not valid: {}!", registerRequest.getRole());
                throw new BusinessException(INVALID_USER_ROLE, REGISTER.name());
            }
            userRepository.save(newUser);
            log.info("User {} has been created!", newUser.getEmail());
            return getCompleteResponse(errorCodeRepository, USER_CREATED, REGISTER.name(), dataMapper.toUserDto(newUser));
        } catch (
                BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("There has been an error in registering a new user!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, REGISTER.name());
        }
    }

    @Override
    public CompleteResponse<Object> updateUser(UpdateUserDTO updateUserDTO, String employeeId) {
        try {
            UserEntity existingUser = userRepository.findByEmployeeId(employeeId)
                    .orElseThrow(() -> {
                        log.error("User not found with email: {}", updateUserDTO.getEmail());
                        return new BusinessException(USER_NOT_FOUND, COMMON.name());
                    });

            //update entire entity
            dataMapper.updateEntityFromDto(updateUserDTO, existingUser);
            existingUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(existingUser);

            UserDTO responseDTO = dataMapper.toUserDto(existingUser);
            return getCompleteResponse(errorCodeRepository, UPDATE_USER_SUCCESS, COMMON.name(), responseDTO);
        } catch (Exception e) {
            log.error("There has been an error in updating user {}!", updateUserDTO.getEmail(), e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, REGISTER.name());
        }
    }

    @Override
    public CompleteResponse<Object> getUserByFilter(String employeeId, String name, String email, String mobileNumber, Pageable pageable) {
        Specification<UserEntity> spec = Specification.where(null);

        //only show STAFF users
        spec = spec.and((root, query, cb) -> {
            Join<UserEntity, RoleEntity> roleJoin = root.join("role");
            return cb.equal(roleJoin.get("name"), UserEnum.STAFF.name());
        });

        if (employeeId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("employeeId"), employeeId));
        }

        if (name != null) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("firstName")), "%" + name.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("lastName")), "%" + name.toLowerCase() + "%")
            ));
        }

        if (email != null) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
        }

        if (mobileNumber != null) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("mobileNumber"), "%" + mobileNumber + "%"));
        }

        Page<UserEntity> page = userRepository.findAll(spec, pageable);

        List<String> employeeIds = page.getContent().stream()
        List<Object[]> upComingShifts = rosterRepository.findUpcomingShiftsForUsers(employeeIds);

        Map<String, String> shiftMap = new HashMap<>();
        for (var row: upComingShifts) {
            String currId = (String) row[0];
            LocalDateTime start = (LocalDateTime) row[1];
            LocalDateTime end = (LocalDateTime) row[2];
            shiftMap.put(currId, formatShift(start, end));
        }

        var dtoPage = page.map(user -> {
            String shift = shiftMap.getOrDefault(user.getEmployeeId(), "No upcoming shift");
            UserDTO dto = dataMapper.toUserDto(user);
            dto.setUpComingShift(shift);
            return dto;
        });

        return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, COMMON.name(), dtoPage);
    }

    private String formatShift(LocalDateTime start, LocalDateTime end) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEE dd/MM/yyyy h:mma");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mma");
        return start.format(dateFormatter) + " - " + end.format(timeFormatter);
    }
}