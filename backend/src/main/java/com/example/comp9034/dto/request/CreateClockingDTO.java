package com.example.comp9034.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.Valid;
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
public class CreateClockingDTO {

    @NotBlank(message = "Employee cannot be null or empty")
    private String employeeId;

    @NotNull(message = "Station cannot be null or empty")
    private Integer stationId;

    @NotNull(message = "Clock in time cannot be null or empty")
    @PastOrPresent(message = "Clock in time can only be in the past")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime clockInTime;

    @NotNull(message = "Clock out time cannot be null or empty")
    @PastOrPresent(message = "Clock out time can only be in the past")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private java.time.LocalDateTime clockOutTime;

    private boolean isAdminManual = true;

    @NotNull(message = "manual override reason cannot be null or empty")
    @Pattern(regexp = "Card Failure|Emergency Leave|Missing clocking|Not Rostered", message = "Manual reason can only be Card Failure | Emergency Leave | Missing clocking | Not Rostered")
    private String reasonCode; //manual override reason

    @Min(0)
    @NotNull(message = "break minutes cannot be null or empty")
    private Integer breakMinutes;
}
