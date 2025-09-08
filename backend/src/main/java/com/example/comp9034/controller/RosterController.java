package com.example.comp9034.controller;

import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.DeleteRosterDTO;
import com.example.comp9034.dto.request.GetRosterByWeekDTO;
import com.example.comp9034.response_template.ResponseBody;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin/roster/")
public interface RosterController {
    @PostMapping("create")
    ResponseEntity<ResponseBody<Object>> createRoster(@Valid @RequestBody CreateRosterDTO registerRequest);

    @GetMapping()
    ResponseEntity<ResponseBody<Object>> getRoster(@Valid @RequestBody GetRosterByWeekDTO registerRequest);

    @DeleteMapping("delete")
    ResponseEntity<ResponseBody<Object>> deleteRoster(@Valid @RequestBody DeleteRosterDTO registerRequest);

    @PutMapping()
    ResponseEntity<ResponseBody<Object>> updateRoster(@Valid @RequestBody CreateRosterDTO registerRequest);

}