package com.example.comp9034.controller;

import com.example.comp9034.dto.request.*;
import com.example.comp9034.response_template.ResponseBody;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin/payroll/")
public interface PayrollController {
    @PostMapping("/email")
    ResponseEntity<ResponseBody<Object>> emailPayroll(@Valid @RequestBody GeneratePayrollRequestDTO dto);

    @PostMapping("/csv")
    ResponseEntity<ResponseBody<Object>> csvPayroll(@Valid @RequestBody GeneratePayrollRequestDTO dto);

    @GetMapping("/info")
    ResponseEntity<ResponseBody<Object>> getInfoPayroll();
}
