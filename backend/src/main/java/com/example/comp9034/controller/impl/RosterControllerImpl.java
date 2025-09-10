package com.example.comp9034.controller.impl;

import com.example.comp9034.controller.RosterController;
import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.EditRosterDTO;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.RosterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RosterControllerImpl implements RosterController {
    private final RosterService rosterService;

    public RosterControllerImpl(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> createRoster(CreateRosterDTO registerRequest) {
        CompleteResponse<Object> response = rosterService.createRoster(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> getRoster(String weekStart, List<String> employeeId, List<String> locations, boolean includeCancelled,
                                                          int page, int size) {
        CompleteResponse<Object> response = rosterService.getRoster(weekStart, employeeId, locations, includeCancelled, page, size);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> deleteRoster(Long rosterId, Boolean hard) {
        CompleteResponse<Object> response = rosterService.deleteRoster(rosterId, hard);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> updateRoster(EditRosterDTO request) {
        CompleteResponse<Object> response = rosterService.updateRoster(request);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }
}


