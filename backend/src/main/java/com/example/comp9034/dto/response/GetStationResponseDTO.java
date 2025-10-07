package com.example.comp9034.dto.response;

import com.example.comp9034.dto.request.StationDTO;
import lombok.*;

import java.util.List;


@Setter
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class GetStationResponseDTO { // Sunday
    private List<StationDTO> stationList;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}


