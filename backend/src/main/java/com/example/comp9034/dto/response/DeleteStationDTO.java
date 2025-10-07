package com.example.comp9034.dto.response;

import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Setter
@Getter
@Valid
@Builder
public class DeleteStationDTO {
    private long stationId;

    private String stationName;

    private String stationLocation;

    private String status;

    private LocalDateTime processedAt;

    private String action;
}

