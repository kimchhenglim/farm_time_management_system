package com.example.comp9034.service;

import com.example.comp9034.dto.*;
import com.example.comp9034.dto.request.CreateUserDTO;
import com.example.comp9034.dto.request.ForgotPasswordDTO;
import com.example.comp9034.dto.request.LoginDTO;
import com.example.comp9034.dto.request.LogoutDTO;
import org.springframework.data.domain.Pageable;

import com.example.comp9034.response_template.CompleteResponse;

public interface UserService {
    CompleteResponse<Object> login(LoginDTO registerRequest);

    CompleteResponse<Object> logout(LogoutDTO registerRequest);

    CompleteResponse<Object> forgotPassword(ForgotPasswordDTO forgotPasswordRequest);

    CompleteResponse<Object> createNewUserAdmin(CreateUserDTO registerRequest);

    CompleteResponse<Object> updateUser(UpdateUserDTO updateUserDTO, String employeeId);

    CompleteResponse<Object> getUserByFilter(Integer id, String employeeId, String name, String email, String mobileNumber, Pageable pageable);
}
