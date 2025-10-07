package com.example.comp9034.dto.response;

import com.example.comp9034.enums.StationEnum;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CreateStationResponseDTO {
    private long stationId;
    private String stationLocation;
    private String stationName;

    private StationEnum status;

    private String createdBy;
    private LocalDateTime createdAt;




}
