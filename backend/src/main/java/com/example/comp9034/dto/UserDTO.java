package com.example.comp9034.dto;
import com.example.comp9034.enums.*;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
public class UserDTO {
    private int id;
    private String employeeId;

    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String email;
    private String mobileNumber;
    private String address;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String cardId;
    private UserEnum contractType;
    private Double payRate;
    private String location;
    private Boolean isActive;
    private String upComingShift;
}
