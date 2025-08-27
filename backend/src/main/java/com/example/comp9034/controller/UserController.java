package com.example.comp9034.controller;

import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.dto.ForgotPasswordDTO;
import com.example.comp9034.dto.LoginDTO;
import com.example.comp9034.dto.UpdateUserDTO;
import jakarta.validation.Valid;
import com.example.comp9034.response_template.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface UserController {
    @PostMapping("/register/admin")
    ResponseEntity<ResponseBody<Object>> createNewUserAdmin(@Valid @RequestBody CreateUserDTO registerRequest);

    @PostMapping("/login")
    ResponseEntity<ResponseBody<Object>> login(@Valid @RequestBody LoginDTO loginRequest);

    @PostMapping("/logout")
    ResponseEntity<ResponseBody<Object>> logout(@Valid @RequestBody LoginDTO logoutRequest);

    @PostMapping("/forgot-pass")
    ResponseEntity<ResponseBody<Object>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO forgotPasswordRequest);


    @PutMapping("/users/{userId}")
    ResponseEntity<ResponseBody<Object>> updateUser(@Valid @RequestBody UpdateUserDTO updateUserDTO, @PathVariable("userId") String userId);

     @GetMapping("/users")
     ResponseEntity<ResponseBody<Object>> getAllUsers(
        @RequestParam(required = false) String userId,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String phoneNumber,
        @RequestParam(defaultValue = "0") int page,   // page number
        @RequestParam(defaultValue = "10") int size,  // page size
        @RequestParam(defaultValue = "id") String sortBy, // sort field
        @RequestParam(defaultValue = "asc") String sortDir // asc or desc
     );
}