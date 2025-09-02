package com.example.comp9034.controller.impl;

import com.example.comp9034.controller.UserController;
import com.example.comp9034.dto.*;

import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.UserService;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserControllerImpl implements UserController {
    private final UserService userService;

    public UserControllerImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> login(LoginDTO registerRequest) {
        CompleteResponse<Object> response = userService.login(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> logout(LogoutDTO registerRequest) {
        CompleteResponse<Object> response = userService.logout(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> forgotPassword(ForgotPasswordDTO forgotPasswordRequest) {
        CompleteResponse<Object> response = userService.forgotPassword(forgotPasswordRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> createNewUserAdmin(CreateUserDTO registerRequest) {
        CompleteResponse<Object> response = userService.createNewUserAdmin(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> updateUser(UpdateUserDTO updateUserDTO, String employeeId) {
        CompleteResponse<Object> response = userService.updateUser(updateUserDTO, employeeId);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> getUsers(Integer id, String employeeId, String name, String email, String phoneNumber, int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
        
        CompleteResponse<Object> response = userService.getUserByFilter(id, employeeId, name, email, phoneNumber, pageable);
        
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }
}


