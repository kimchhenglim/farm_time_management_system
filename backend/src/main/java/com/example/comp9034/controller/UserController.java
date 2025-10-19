package com.example.comp9034.controller;

import com.example.comp9034.dto.*;
import com.example.comp9034.dto.request.CreateUserDTO;
import com.example.comp9034.dto.request.ForgotPasswordDTO;
import com.example.comp9034.dto.request.LoginDTO;
import com.example.comp9034.dto.request.LogoutDTO;
import jakarta.validation.Valid;
import com.example.comp9034.response_template.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
public interface UserController {
    @PostMapping("/admin/register")
    ResponseEntity<ResponseBody<Object>> createNewUserAdmin(@Valid @RequestBody CreateUserDTO registerRequest);

    @PostMapping("/login")
    ResponseEntity<ResponseBody<Object>> login(@Valid @RequestBody LoginDTO loginRequest);

    @PostMapping("/admin/logout")
    ResponseEntity<ResponseBody<Object>> logout(@Valid @RequestBody LogoutDTO logoutRequest);

    @PostMapping("/forgot-pass")
    ResponseEntity<ResponseBody<Object>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordRequest);

    @PutMapping("/admin/users/{employeeId}")
    ResponseEntity<ResponseBody<Object>> updateUser(@Valid @RequestBody UpdateUserDTO updateUserDTO, @PathVariable("employeeId") String employeeId);

     @GetMapping("/users")
     ResponseEntity<ResponseBody<Object>> getUsers(@Validated @ModelAttribute UserFilterDTO filter);
}