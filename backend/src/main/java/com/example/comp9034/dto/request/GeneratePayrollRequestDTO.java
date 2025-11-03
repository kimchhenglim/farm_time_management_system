package com.example.comp9034.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Valid
public class GeneratePayrollRequestDTO {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDay;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDay;

    private List<String> employeeIds;
}
