package com.example.comp9034.controller.impl;

import com.example.comp9034.controller.RosterController;
import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.DeleteRosterDTO;
import com.example.comp9034.dto.request.GetRosterByWeekDTO;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.RosterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<ResponseBody<Object>> getRoster(GetRosterByWeekDTO registerRequest) {
        CompleteResponse<Object> response = rosterService.getRoster(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> deleteRoster(DeleteRosterDTO registerRequest) {
        CompleteResponse<Object> response = rosterService.deleteRoster(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> updateRoster(CreateRosterDTO registerRequest) {
        CompleteResponse<Object> response = rosterService.updateRoster(registerRequest);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }
}


