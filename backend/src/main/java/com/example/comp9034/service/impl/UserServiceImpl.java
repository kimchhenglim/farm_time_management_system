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

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

    // @Override
    // public CompleteResponse<Object> getAllSortedByActive() {
    //     List<StaffEntity> staffs = staffRepository.findAll(Sort.by(Sort.Direction.ASC, "isActive"));
    //     return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, COMMON.name(), UserMapper.toUpdateUserDTOs(staffs));
    // }
}