package com.example.comp9034.dto.request;

import com.example.comp9034.enums.StationEnum;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Valid
public class CreateStationDTO {
    private Long stationId;

    @NotNull(message = "Station name cannot be null or empty")
    private String name;

    @NotNull(message = "Station location cannot be null or empty")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-uuuu HH:mm")
    private String location;

    private StationEnum status;

    public CreateStationDTO(String name, String location, StationEnum status) {
        this.name = name;
        this.location = location;
        this.status = status;
    }
}

