package com.example.comp9034.service.impl;

import com.example.comp9034.dto.*;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.enums.UserEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.mapper.UserMapper;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.RoleCache;
import com.example.comp9034.service.UserService;
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
import org.springframework.validation.BeanPropertyBindingResult;

import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;
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
    private final RoleCache roleCache;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(ErrorCodeRepository errorCodeRepository, UserRepository userRepository, RoleCache roleCache, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.errorCodeRepository = errorCodeRepository;
        this.userRepository = userRepository;
        this.roleCache = roleCache;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public CompleteResponse<Object> logout(LoginDTO loginRequest) {
        String username = loginRequest.getUsername();
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
            String username = loginRequest.getUsername();
            Optional<UserEntity> userOptional = userRepository.findByEmailAndActive(loginRequest.getEmail(), true);
            // Check if user existed
            if (userOptional.isEmpty()) {
                log.info("User {} does not exist!", username);
                throw new BusinessException(USER_NOT_FOUND, LOGIN.name());
            }
            UserEntity userEntity = userOptional.get();
            if (!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPassword())) {
                log.info("Password does not match for user {}!", username);
                throw new BusinessException(USER_NOT_FOUND, LOGIN.name());
            }
            log.info("Current user: {}", username);
            // Create an authentication object from the user
            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, userEntity.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return getCompleteResponse(errorCodeRepository, LOGIN_SUCCESS, LOGIN.name(), null);
        } catch (
                Exception e) {
            log.error("There has been an error in logging in for user {}!", loginRequest.getUsername(), e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name());
        }
    }

    @Override
    public CompleteResponse<Object> forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {
        //Check if email/phone existed
        String email = forgotPasswordDTO.getEmail();
        Optional<UserEntity> userOptional = userRepository.findByEmailAndActive(email, true);
        if (userOptional.isEmpty()) {
            log.error("User {} not found to reset password!", email);
            throw new BusinessException(USER_NOT_FOUND, FORGOT_PASSWORD.name());
        }
//        UserEntity user = userOptional.get();
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
            UserEntity newUser;
            int roleId = roleCache.getRoleIdByDescription(registerRequest.getRole().name());
            if (registerRequest.getRole().equals(UserEnum.ADMIN.name())) {
                newUser = new UserEntity(UUID.randomUUID().toString(), registerRequest.getFirstName(), registerRequest.getLastName(),
                        toLocalDate(registerRequest.getDob()), registerRequest.getGender(), registerRequest.getEmail(), registerRequest.getMobileNumber(),
                        registerRequest.getAddress(), registerRequest.getCardId(), registerRequest.getContractType(), registerRequest.getPayRate(), registerRequest.getTask(), LocalDateTime.now(), roleId, passwordEncoder.encode(registerRequest.getPassword()));
            } else if (registerRequest.getRole().equals(UserEnum.STAFF.name())) {
                newUser = new UserEntity(UUID.randomUUID().toString(), registerRequest.getFirstName(), registerRequest.getLastName(),
                        toLocalDate(registerRequest.getDob()), registerRequest.getGender(), registerRequest.getEmail(), registerRequest.getMobileNumber(),
                        registerRequest.getAddress(), registerRequest.getCardId(), registerRequest.getContractType(), registerRequest.getPayRate(), registerRequest.getTask(), LocalDateTime.now(), roleId, null);
            } else {
                log.info("User role is not valid: {} !", registerRequest.getRole());
                throw new BusinessException(INVALID_INPUT, REGISTER.name());
            }
            userRepository.save(newUser);
            log.info("User {} has been created!", newUser.getEmail());
            return getCompleteResponse(errorCodeRepository, USER_CREATED, REGISTER.name(), null);
        } catch (
                BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("There has been an error in registering a new user!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, REGISTER.name());
        }
    }

//    @Override
//    public CompleteResponse<Object> checkUserInfo(String userInput) {
//        try {
//            return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, REGISTER.name(), null);
//        } catch (
//                BusinessException e) {
//            throw e;
//        } catch (Exception e) {
//            log.error("There has been an error in registering a new user!", e);
//            throw new BusinessException(INTERNAL_SERVER_ERROR, REGISTER.name());
//        }
//    }

    @Override
    public CompleteResponse<Object> updateUser(UpdateUserDTO updateUserDTO, String employeeId) {
        UserEntity existingUser = userRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> {
                    log.error("User not found with code: {}", employeeId);
                    return new BusinessException(USER_NOT_FOUND, COMMON.name());
                });

        //check enum values
        var userEnumValidator = updateUserDTO.validateEnumValues();
        if (!userEnumValidator.getFirst()) {
            throw new IllegalArgumentException(userEnumValidator.getSecond());
        }

        //update role first if exists since role datatype is mismatched
        if (updateUserDTO.getRole() != null) {
            existingUser.setRoleId(roleCache.getRoleIdByDescription(updateUserDTO.getRole().name()));
        }
        
        //update entire entity
        userMapper.updateEntityFromDto(updateUserDTO, existingUser);
        existingUser.setUpdatedAt(LocalDateTime.now());

        userRepository.save(existingUser);


        UserDTO responseDTO = userMapper.toUserDTO(existingUser);
        responseDTO.setRole(UserEnum.valueOf(roleCache.getRoleDescriptionById(existingUser.getRoleId())));
        return getCompleteResponse(errorCodeRepository, UPDATE_USER_SUCCESS, COMMON.name(), responseDTO);
    }

    @Override
    public CompleteResponse<Object> getUserByFilter(String employeeId, String name, String email, String mobileNumber, Pageable pageable) {
        Specification<UserEntity> spec = Specification.where(null);

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

        //map content to DTO
        List<UserDTO> dtoList = page.getContent().stream()
                .map(user -> {
                    UserDTO dto = userMapper.toUserDTO(user);
                    dto.setRole(UserEnum.valueOf(roleCache.getRoleDescriptionById(user.getRoleId())));
                    
                    return dto;
                })
                .collect(Collectors.toList());

        Page<UserDTO> dtoPage = new PageImpl<>(dtoList, pageable, page.getTotalElements());

        return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, COMMON.name(), dtoPage);
    }
}