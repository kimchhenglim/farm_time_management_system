package com.example.comp9034.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Valid
public class UpdateClockingDTO {
    @Pattern(regexp = "^$|.*\\S.*", message = "EmployeeId must not be blank if provided")
    private String employeeId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime clockInTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime clockOutTime;

    // private int stationId;
    @Min(0)
    private int breakMinutes;

    private boolean isAdminManual = true;
    
    @NotNull(message = "manual override reason cannot be null or empty")
    @Pattern(regexp = "Card Failure|Emergency Leave|Missing clocking|Not Rostered", message = "Manual reason can only be Card Failure | Emergency Leave | Missing clocking | Not Rostered")
    private String reasonCode; //manual override reason
}
