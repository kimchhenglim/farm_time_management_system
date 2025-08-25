package com.example.comp9034.service;

import org.springframework.data.domain.Pageable;

import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.dto.UpdateUserDTO;
import com.example.comp9034.response_template.CompleteResponse;

public interface UserService {
    CompleteResponse<Object> createNewUser(CreateUserDTO registerRequest);

    CompleteResponse<Object> createNewUserAdmin(CreateUserDTO registerRequest);

    CompleteResponse<Object> updateUser(UpdateUserDTO updateUserDTO, String userId);

    CompleteResponse<Object> getUserByFilter(String userId, String name, String email, String mobileNumber, Pageable pageable);
}
