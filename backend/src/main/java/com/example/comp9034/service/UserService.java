package com.example.comp9034.service;

import com.example.comp9034.dto.*;
import org.springframework.data.domain.Pageable;

import com.example.comp9034.response_template.CompleteResponse;

public interface UserService {
    CompleteResponse<Object> login(LoginDTO registerRequest);

    CompleteResponse<Object> logout(LogoutDTO registerRequest);

    CompleteResponse<Object> forgotPassword(ForgotPasswordDTO forgotPasswordRequest);

    CompleteResponse<Object> createNewUserAdmin(CreateUserDTO registerRequest);

    CompleteResponse<Object> updateUser(UpdateUserDTO updateUserDTO, String employeeId);

    CompleteResponse<Object> getUserByFilter(UserFilterDTO filter);
}
