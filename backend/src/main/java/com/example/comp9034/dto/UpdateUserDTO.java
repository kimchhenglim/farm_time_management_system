package com.example.comp9034.dto;
import com.example.comp9034.enums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Valid
public class UpdateUserDTO {
    // Optional User fields
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    @Pattern(regexp = "^(0[1-9]|[12]\\d|3[01])/(0[1-9]|1[0-2])/\\d{4}$", message = "Invalid date format, must be DD/MM/YYYY")
    private String dob;

    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Gender can only be MALE | FEMALE | OTHER")
    private String gender;

    @Email(regexp = "^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" ,message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]*$", message = "Invalid mobile number")
    private String mobileNumber;

    @Size(max = 255, message = "Address too long")
    private String address;

    private String cardId;

//    @Pattern(regexp = "FULLTIME|PARTTIME|CASUAL", message = "Contract type can only be FULLTIME | PARTTIME | CASUAL")
    private UserEnum contractType;

    @Pattern(regexp = "ADMIN|STAFF", message = "Role can only be ADMIN | STAFF")
    private String role;

    @Positive(message = "Pay rate must be greater than zero")
    private Double payRate;

    private String Location;

    private String employeeId;

    private Boolean isActive;
}
