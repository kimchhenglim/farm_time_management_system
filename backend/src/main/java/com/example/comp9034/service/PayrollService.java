package com.example.comp9034.service;

import com.example.comp9034.dto.request.GeneratePayrollRequestDTO;
import com.example.comp9034.response_template.CompleteResponse;

public interface PayrollService {
    CompleteResponse<Object> emailPayroll(GeneratePayrollRequestDTO dto);

    CompleteResponse<Object> csvPayroll(GeneratePayrollRequestDTO dto);
}
