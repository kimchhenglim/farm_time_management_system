package com.example.comp9034.dto;
import com.example.comp9034.enums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Valid
public class UpdateUserDTO {
    // Optional User fields
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    private LocalDate dob;

    private UserEnum gender;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]*$", message = "Invalid mobile number")
    private String mobileNumber;

    @Size(max = 255, message = "Address too long")
    private String address;

    // Optional Staff fields
    //@Size(max = 20, message = "CardId must be at most 20 characters")
    private String cardId;

    private UserEnum contractType;
    private UserEnum role;

    @Positive(message = "Pay rate must be greater than zero")
    private Double payRate;

    private String task;

    private Boolean isActive;
}
