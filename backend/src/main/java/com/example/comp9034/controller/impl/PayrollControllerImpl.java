package com.example.comp9034.controller.impl;

import com.example.comp9034.controller.PayrollController;
import com.example.comp9034.dto.request.*;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.PayrollService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PayrollControllerImpl implements PayrollController {

    private final PayrollService payrollService;

    public PayrollControllerImpl(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> getInfoPayroll() {
        CompleteResponse<Object> response = payrollService.getInfoPayroll();
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> emailPayroll(GeneratePayrollRequestDTO dto) {
        CompleteResponse<Object> response = payrollService.emailPayroll(dto);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }

    @Override
    public ResponseEntity<ResponseBody<Object>> csvPayroll(GeneratePayrollRequestDTO dto) {
        CompleteResponse<Object> response = payrollService.csvPayroll(dto);
        return new ResponseEntity<>(response.getResponseBody(), HttpStatus.valueOf(response.getHttpCode()));
    }
}
