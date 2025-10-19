package com.example.comp9034.service;

import java.time.LocalDate;

public interface EmailService {
    public void sendRosterEmail(String to, LocalDate weekStart, String text);
}
