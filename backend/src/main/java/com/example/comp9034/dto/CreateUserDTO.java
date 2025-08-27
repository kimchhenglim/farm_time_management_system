package com.example.comp9034.dto;

import com.example.comp9034.enums.ContractTypeEnum;
import com.example.comp9034.enums.GenderEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Setter
@Getter
@Valid
public class CreateUserDTO {
    @NotBlank(message = "Password cannot be null or empty")
    @Size(min = 8, max = 20, message = "Password must be between 3 and 20 characters")
    private String password;

    @NotBlank(message = "Email cannot be null or empty")
    private String email;

    @Size(max = 15, message = "Phone number must be between 9 and 15 characters")
    private String mobileNumber;

    @NotNull(message = "Date of birth cannot be null or empty")
    @Pattern(regexp = "^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$", message = "Invalid date format, must be DD/MM/YYYY")
    private String dob;

    private String otp;

    @NotBlank(message = "First name cannot be null or empty")
    private String firstName;

    @NotBlank(message = "Last name cannot be null or empty")
    private String lastName;

    @NotBlank(message = "Gender name cannot be null or empty")
    private GenderEnum gender;

    @NotBlank(message = "Address name cannot be null or empty")
    private String address;

    @NotBlank(message = "Role name cannot be null or empty")
    private String role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String cardId;

    private ContractTypeEnum contractType;

    private Double payRate;

    private String task;

    @NotBlank(message = "Activity status name cannot be null or empty")
    private Boolean isActive;

    public CreateUserDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
}

