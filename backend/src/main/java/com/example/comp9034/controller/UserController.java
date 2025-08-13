package com.example.comp9034.controller;

import com.example.comp9034.dto.CreateUserDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import com.example.comp9034.response_template.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/public/api/users/")
public interface UserController {
    @PostMapping("/register")
    ResponseEntity<ResponseBody<Object>> createNewUser(@Valid @RequestBody CreateUserDTO registerRequest);

    @PostMapping("/register/admin")
    ResponseEntity<ResponseBody<Object>> createNewUserAdmin(@Valid @RequestBody CreateUserDTO registerRequest);

    @GetMapping("/get/user")
    ResponseEntity<ResponseBody<Object>> checkUserExisted(@NotNull @RequestParam(name = "userInput") String userInput);
}