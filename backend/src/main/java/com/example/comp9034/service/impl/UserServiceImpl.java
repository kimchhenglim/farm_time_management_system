package com.example.comp9034.service.impl;

import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.dto.UpdateUserDTO;
import com.example.comp9034.dto.UserDTO;
import com.example.comp9034.entity.UserEntity;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.mapper.UserMapper;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.UserService;
import lombok.extern.log4j.Log4j2;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.CommonEnum.REGISTER;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;


@Service
@Log4j2
public class UserServiceImpl implements UserService {
    private final ErrorCodeRepository errorCodeRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(ErrorCodeRepository errorCodeRepository, UserRepository userRepository,  UserMapper userMapper) {
        this.errorCodeRepository = errorCodeRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public CompleteResponse<Object> createNewUser(CreateUserDTO registerRequest) {
        try {
            return getCompleteResponse(errorCodeRepository, USER_CREATED, REGISTER.name(), null);
        } catch (
                BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("There has been an error in registering a new user!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, REGISTER.name());
        }
    }

    @Override
    public CompleteResponse<Object> createNewUserAdmin(CreateUserDTO registerRequest) {
        return null;
    }

//    @Override
//    public CompleteResponse<Object> checkUserExisted(String userInput) {
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
    public CompleteResponse<Object> updateUser(UpdateUserDTO updateUserDTO, String userId) {
        UserEntity existingUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("User not found with code: {}", userId);
                    return new BusinessException(USER_NOT_FOUND, COMMON.name());
                });


        //update entity
        userMapper.updateEntityFromDto(updateUserDTO, existingUser);
        existingUser.setUpdatedAt(LocalDateTime.now());

        userRepository.save(existingUser);

        UserDTO responseDTO = userMapper.toUserDTO(existingUser);
        return getCompleteResponse(errorCodeRepository, UPDATE_USER_SUCCESS,  COMMON.name(),responseDTO);
    }

    @Override
    public CompleteResponse<Object> getUserByFilter(String userId, String name, String email, String mobileNumber, Pageable pageable) {
        Specification<UserEntity> spec = Specification.where(null);

        if (userId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("userId"), userId));
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
                                    .map(userMapper::toUserDTO)
                                    .collect(Collectors.toList());

        Page<UserDTO> dtoPage = new PageImpl<>(dtoList, pageable, page.getTotalElements());

        return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, COMMON.name(), dtoPage);
    }
}