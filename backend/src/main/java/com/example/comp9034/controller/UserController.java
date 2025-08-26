package com.example.comp9034.controller;

import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.dto.UpdateUserDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import com.example.comp9034.response_template.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public interface UserController {
    @PostMapping("/register")
    ResponseEntity<ResponseBody<Object>> createNewUser(@Valid @RequestBody CreateUserDTO registerRequest);

    @PostMapping("/register/admin")
    ResponseEntity<ResponseBody<Object>> createNewUserAdmin(@Valid @RequestBody CreateUserDTO registerRequest);

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