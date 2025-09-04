package com.example.comp9034.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;;;


@Getter
@Setter
@Valid
public class UserFilterDTO {
    @Min(1)
    private Integer id;

    private String employeeId;

    private String name;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "\\d+", message = "Mobile number must be numeric")
    private String mobileNumber;

    @Pattern(regexp = "(?i)FULLTIME|PARTTIME|CASUAL", message = "Invalid contract type")
    private String contractType;

    private Boolean isActive;

    @Min(0)
    private Integer page = 0;

    @Min(1)
    @Max(100)
    private Integer size = 10;

    @Pattern(regexp = "(?i)id|name|email|mobileNumber|contractType|isActive", message = "Sort by must be one of id|name|email|mobileNumber|contractType|isActive")
    private String sortBy = "id";

    @Pattern(regexp = "(?i)asc|desc", message = "Sort direction must be 'asc' or 'desc'")
    private String sortDir = "asc";
}
