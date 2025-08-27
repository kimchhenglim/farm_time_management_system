package com.example.comp9034.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class LoginDTO {
    @NotBlank(message = "Username  cannot be null or empty")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @NotBlank(message = "Password cannot be null or empty")
    @Size(min = 8, max = 20, message = "Password must be between 3 and 20 characters")
    private String password;

    @NotBlank(message = "Email cannot be null or empty")
    private String email;

    public LoginDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }
}

