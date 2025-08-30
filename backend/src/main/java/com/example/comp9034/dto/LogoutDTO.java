package com.example.comp9034.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class LogoutDTO {
    @NotBlank(message = "Email cannot be null or empty")
    private String email;

    public LogoutDTO(String email) {
        this.email = email;
    }
}

