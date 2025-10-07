package com.example.comp9034.controller.impl;

import com.example.comp9034.controller.StationController;
import com.example.comp9034.dto.request.CreateStationDTO;
import com.example.comp9034.dto.request.EditStationDTO;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.StationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StationControllerImpl implements StationController {
    private final StationService stationService;

    public StationControllerImpl(StationService stationService) {
        this.stationService = stationService;
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> createStation(CreateStationDTO registerRequest) {
        CompleteResponse<Object> response = stationService.createStation(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> getStation(String status, List<Long> stationIds,
                                                          int page, int size) {
        CompleteResponse<Object> response = stationService.getStation(status, stationIds, page, size);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> deleteStation(Long stationId, Boolean hard) {
        CompleteResponse<Object> response = stationService.deleteStation(stationId, hard);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> updateStation(EditStationDTO request) {
        CompleteResponse<Object> response = stationService.updateStation(request);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }
}


