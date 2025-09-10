package com.example.comp9034.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class EditRosterDTO {
    @NotNull(message = "Start time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime endTime;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotNull(message = "Roster ID is required")
    private Long rosterId;

    @NotBlank(message = "Location is required")
    private String location;
}

