package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class StationDTO {
    private long stationId;

    private String stationName;

    private String stationLocation;

    private String status;
}

