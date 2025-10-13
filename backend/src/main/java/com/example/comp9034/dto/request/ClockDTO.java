package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Valid
public class ClockDTO {
    @NotBlank(message = "CardId cannot be null or empty")
    private String cardId;

    @NotBlank(message = "Station cannot be null or empty")
    private int stationId;
}
