package com.example.comp9034.controller;

import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.EditRosterDTO;
import com.example.comp9034.response_template.ResponseBody;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/admin/roster/")
public interface RosterController {
    @PostMapping("create")
    ResponseEntity<ResponseBody<Object>> createRoster(@Valid @RequestBody CreateRosterDTO registerRequest);

    @GetMapping("get")
    ResponseEntity<ResponseBody<Object>> getRoster(@RequestParam String weekStart,
                                                   @RequestParam(required = false) List<String> employeeId,
                                                   @RequestParam(required = false) List<String> locations,
                                                   @RequestParam(defaultValue = "false") boolean includeCancelled,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "100") int size);

    @DeleteMapping("delete")
    ResponseEntity<ResponseBody<Object>> deleteRoster(@RequestParam Long rosterId,
                                                      @RequestParam(required = false) Boolean hardDelete);

    @PutMapping("update")
    ResponseEntity<ResponseBody<Object>> updateRoster(@Valid @RequestBody EditRosterDTO registerRequest);

}