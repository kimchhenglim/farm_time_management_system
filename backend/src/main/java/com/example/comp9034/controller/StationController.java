package com.example.comp9034.controller;

import com.example.comp9034.dto.request.CreateStationDTO;
import com.example.comp9034.dto.request.EditStationDTO;
import com.example.comp9034.response_template.ResponseBody;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/admin/station/")
public interface StationController {
    @PostMapping("create")
    ResponseEntity<ResponseBody<Object>> createStation(@Valid @RequestBody CreateStationDTO registerRequest);

    @GetMapping("get")
    ResponseEntity<ResponseBody<Object>> getStation(@RequestParam(required = false) String status, @RequestParam(required = false) List<Long> stationIds,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "100") int size);

    @DeleteMapping("delete")
    ResponseEntity<ResponseBody<Object>> deleteStation(@RequestParam Long stationId,
                                                      @RequestParam(required = false) Boolean hardDelete);

    @PutMapping("update")
    ResponseEntity<ResponseBody<Object>> updateStation(@Valid @RequestBody EditStationDTO updateRequest);
}