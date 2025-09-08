package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class DeleteRosterDTO {
    @NotNull(message = "Start time for shift cannot be null or empty")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "uuuu-MM-dd HH:mm")
    private java.time.LocalDateTime startTime;

    @NotNull(message = "End time for shift cannot be null or empty")
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "uuuu-MM-dd HH:mm")
    private java.time.LocalDateTime endTime;

    @NotBlank(message = "employeeId is required")
    private String employeeId;

    private Boolean hardDelete;
}

