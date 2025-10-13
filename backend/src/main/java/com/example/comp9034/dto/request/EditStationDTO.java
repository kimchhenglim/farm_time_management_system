package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class EditStationDTO {
    @NotNull(message = "Station ID is required")
    private long stationId;

    @NotBlank(message = "Station name is required")
    private String stationName;

    @NotNull(message = "Station location is required")
    private String stationLocation;

    @NotBlank(message = "Station is required")
    private String status;
}

