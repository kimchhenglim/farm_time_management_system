package com.example.comp9034.dto.request;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
public class ClockingFilterDTO {
    @NotNull(message = "Start date cannot be null or empty")
    @PastOrPresent(message = "Start date must be in the past")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;

    @NotNull(message = "End date cannot be null or empty")
    @PastOrPresent(message = "End date must be in the past")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate endDate;

    private String employeeId;

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
