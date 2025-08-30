package com.example.comp9034.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class ForgotPasswordDTO {
    @NotBlank(message = "New password cannot be null or empty")
    @Size(min = 8, max = 20, message = "Password must be between 3 and 20 characters")
    private String newPassword;

    @NotBlank(message = "Email cannot be null or empty")
    private String email;

    @NotBlank(message = "OTP cannot be null or empty")
    private String otp;

    public ForgotPasswordDTO(String email, String newPassword) {
        this.email = email;
        this.newPassword = newPassword;
    }
}

