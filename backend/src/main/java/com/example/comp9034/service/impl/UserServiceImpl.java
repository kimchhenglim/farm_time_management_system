package com.example.comp9034.service.impl;

import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.UserService;
import lombok.extern.log4j.Log4j2;

import org.springframework.stereotype.Service;

import static com.example.comp9034.enums.CommonEnum.REGISTER;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;


@Service
@Log4j2
public class UserServiceImpl implements UserService {
    private final ErrorCodeRepository errorCodeRepository;

    public UserServiceImpl(ErrorCodeRepository errorCodeRepository) {
        this.errorCodeRepository = errorCodeRepository;
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

    @Override
    public CompleteResponse<Object> checkUserExisted(String userInput) {
        try {
            return getCompleteResponse(errorCodeRepository, SEARCH_INFO_SUCCESS, REGISTER.name(), null);
        } catch (
                BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("There has been an error in registering a new user!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, REGISTER.name());
        }
    }
}