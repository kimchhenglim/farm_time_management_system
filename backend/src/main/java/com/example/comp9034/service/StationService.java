package com.example.comp9034.service;

import com.example.comp9034.dto.request.CreateStationDTO;
import com.example.comp9034.dto.request.EditStationDTO;
import com.example.comp9034.response_template.CompleteResponse;

import java.util.List;


public interface StationService {
    CompleteResponse<Object> createStation(CreateStationDTO registerRequest);

    CompleteResponse<Object> getStation(String status, List<Long> stationIds, int page, int size);

    CompleteResponse<Object>  deleteStation(Long stationId, Boolean hard);

    CompleteResponse<Object>  updateStation(EditStationDTO request);
}
