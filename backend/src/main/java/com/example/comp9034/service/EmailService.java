package com.example.comp9034.service;

import java.time.LocalDate;

public interface EmailService {
    void sendRosterEmail(String to, LocalDate weekStart, String text);

    void sendPayrollPdfEmail(String to, LocalDate start, LocalDate end, byte[] pdfBytes, String htmlBody);

    void sendPayrollCsvEmail(String to, LocalDate start, LocalDate end, byte[] csvBytes, String htmlBody);
}