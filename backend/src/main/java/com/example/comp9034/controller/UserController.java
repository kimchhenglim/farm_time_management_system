package com.example.comp9034.controller;

import com.example.comp9034.dto.*;
import jakarta.validation.Valid;
import com.example.comp9034.response_template.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface UserController {
    @PostMapping("/admin/register")
    ResponseEntity<ResponseBody<Object>> createNewUserAdmin(@Valid @RequestBody CreateUserDTO registerRequest);

    @PostMapping("/login")
    ResponseEntity<ResponseBody<Object>> login(@Valid @RequestBody LoginDTO loginRequest);

    @PostMapping("/logout")
    ResponseEntity<ResponseBody<Object>> logout(@Valid @RequestBody LogoutDTO logoutRequest);

    @PostMapping("/forgot-pass")
    ResponseEntity<ResponseBody<Object>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordRequest);

    @PutMapping("/admin/users/{employeeId}")
    ResponseEntity<ResponseBody<Object>> updateUser(@Valid @RequestBody UpdateUserDTO updateUserDTO, @PathVariable("employeeId") String employeeId);

     @GetMapping("/users")
     ResponseEntity<ResponseBody<Object>> getUsers(
        @RequestParam(required = false) String employeeId,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String phoneNumber,
        @RequestParam(defaultValue = "0") int page,   // page number
        @RequestParam(defaultValue = "10") int size,  // page size
        @RequestParam(defaultValue = "id") String sortBy, // sort field
        @RequestParam(defaultValue = "asc") String sortDir // asc or desc
     );
}