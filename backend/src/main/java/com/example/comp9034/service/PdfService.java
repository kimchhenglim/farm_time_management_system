package com.example.comp9034.service;

import com.example.comp9034.dto.EmployeePayrollDTO;

import java.time.LocalDate;
import java.util.List;

public interface PdfService {
    byte[] generatePayrollPDF(List<EmployeePayrollDTO> dtoList, LocalDate start, LocalDate end);
}
