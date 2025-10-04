package com.example.comp9034.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.comp9034.dto.request.ClockDTO;
import com.example.comp9034.dto.request.BreakEndDTO;
import com.example.comp9034.dto.request.BreakStartDTO;
import com.example.comp9034.dto.request.ClockingFilterDTO;
import com.example.comp9034.dto.request.CreateClockingDTO;
import com.example.comp9034.dto.request.UpdateClockingDTO;
import com.example.comp9034.response_template.ResponseBody;

import jakarta.validation.Valid;

public interface ClockingController {
    // @GetMapping("/admin/clockings")
    // ResponseEntity<ResponseBody<Object>> getClockings(@Valid @ModelAttribute ClockingFilterDTO dto);

    // @PostMapping("admin/clocking")
    // ResponseEntity<ResponseBody<Object>> createClocking(@Valid @RequestBody CreateClockingDTO dto); 

    // @PutMapping("/admin/clocking/{clockingId}")
    // ResponseEntity<ResponseBody<Object>> updateClocking(@Valid @RequestBody UpdateClockingDTO dto, @PathVariable("clockingId") String clockingId);
    
    // @DeleteMapping("/admin/clocking/{clockingId}")
    // ResponseEntity<ResponseBody<Object>> deleteClocking();

    @PostMapping("/clocking/in")
    ResponseEntity<ResponseBody<Object>> clockIn(@Valid @RequestBody ClockDTO dto);

    @PostMapping("/clocking/out")
    ResponseEntity<ResponseBody<Object>> clockOut(@Valid @RequestBody ClockDTO dto);

    @PostMapping("/clocking/break/start")
    ResponseEntity<ResponseBody<Object>> breakStart(@Valid @RequestBody BreakStartDTO dto);

    @PostMapping("/clocking/break/end")
    ResponseEntity<ResponseBody<Object>> breakEnd(@Valid @RequestBody BreakEndDTO dto);
}
