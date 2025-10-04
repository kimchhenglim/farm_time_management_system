package com.example.comp9034.controller.impl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.example.comp9034.controller.ClockingController;
import com.example.comp9034.dto.request.BreakEndDTO;
import com.example.comp9034.dto.request.BreakStartDTO;
import com.example.comp9034.dto.request.ClockDTO;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.ClockingService;

import jakarta.validation.Valid;

@RestController
public class ClockingControlerImpl implements ClockingController {

    private final ClockingService clockingService;

    public ClockingControlerImpl(ClockingService clockingService) {
        this.clockingService = clockingService;
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> clockIn(@Valid ClockDTO dto) {
        CompleteResponse<Object> response = clockingService.clockIn(dto);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> clockOut(@Valid ClockDTO dto) {
        CompleteResponse<Object> response = clockingService.clockOut(dto);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> breakStart(@Valid BreakStartDTO dto) {
        CompleteResponse<Object> response = clockingService.breakStart(dto);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> breakEnd(@Valid BreakEndDTO dto) {
        CompleteResponse<Object> response = clockingService.breakEnd(dto);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }
    
}
