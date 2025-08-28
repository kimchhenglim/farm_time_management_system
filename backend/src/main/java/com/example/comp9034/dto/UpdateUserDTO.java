package com.example.comp9034.dto;
import com.example.comp9034.enums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import org.springframework.data.util.Pair;

@Setter
@Getter
@Valid
public class UpdateUserDTO {
    // Optional User fields
    @Size(max = 50, message = "First name must be at most 50 characters")
    @NotBlank
    private String firstName;

    @Size(max = 50, message = "Last name must be at most 50 characters")
    @NotBlank
    private String lastName;

    private LocalDate dob;

    private UserEnum gender;

    @Email(message = "Invalid email format")
    @NotNull
    private String email;

    @Pattern(regexp = "^\\+?[0-9]*$", message = "Invalid mobile number")
    @NotNull
    private String mobileNumber;

    @Size(max = 255, message = "Address too long")
    private String address;

    // Optional Staff fields
    //@Size(max = 20, message = "CardId must be at most 20 characters")
    private String cardId;

    private UserEnum contractType;

    @NotNull
    private UserEnum role;

    @Positive(message = "Pay rate must be greater than zero")
    private Double payRate;

    private String task;

    @NotNull
    private Boolean isActive;

    public Pair<Boolean, String> validateEnumValues() {
        if (this.getGender() != null && this.getGender().getGroup() != UserEnum.Group.GENDER) {
            return Pair.of(false, "Gender can only be MALE | FEMALE | OTHER");
        }

        if (this.getContractType() != null && this.getContractType().getGroup() != UserEnum.Group.CONTRACT_TYPE) {
            return Pair.of(false, "Contract type can only be FULLTIME | PARTTIME | CASUAL");
        }

        if (this.getRole() != null && this.getRole().getGroup() != UserEnum.Group.ROLE) {
            return Pair.of(false, "Role can only be ADMIN | STAFF");
        }

        return Pair.of(true, "");
    }
}
