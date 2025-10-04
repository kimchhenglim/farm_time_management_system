package com.example.comp9034.dto.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
public class ClockingFilterDTO {
    @NotBlank(message = "Date to search attendance cannot be null or empty")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu")
    private LocalDate date;

    private String employeeId;
    private String name;
    // private int locationId;
    // private String locationName;

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
