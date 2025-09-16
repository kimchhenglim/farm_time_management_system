package com.example.comp9034.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeFormatUtil {

    private DateTimeFormatUtil() {
    }

    public static LocalDate toLocalDate(String date) {
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return LocalDate.parse(date, formatter);
    }

    public static String formatLocalDate(LocalDate date) {
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return date.format(formatter);
    }

    public static String reformatDateTime(LocalDateTime input) {
        // Desired formatter: dd-MM-uuuu HH:mm
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd-MM-uuuu HH:mm");
        return input.format(outputFormatter);
    }
}
