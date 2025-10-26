package com.example.comp9034.service.impl;

import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.INTERNAL_SERVER_ERROR;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendRosterEmail(String to, LocalDate weekStart, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Whitefield Farm <no-reply@whitefield.com>");
            helper.setTo(to);
            helper.setSubject("Week " + weekStart.format(DateTimeFormatter.ISO_DATE) + " roster");
            helper.setText(text, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), e.getMessage());
        }
    }

    public void sendPayrollPdfEmail(String to,
                                    LocalDate start,
                                    LocalDate end,
                                    byte[] pdfBytes,
                                    String htmlBody) {
        try {
            String filename = String.format("payroll_%s_%s.pdf", start, end);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Whitefield Farm <no-reply@whitefield.com>");
            helper.setTo(to);
            helper.setSubject("Payroll Report: " + start + " to " + end);
            helper.setText(htmlBody != null ? htmlBody : "Please find the payroll report attached.", true);

            // Attach the PDF (Spring will set correct headers)
            helper.addAttachment(filename, new ByteArrayResource(pdfBytes));

            mailSender.send(message);
        } catch (Exception e) {
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), e.getMessage());
        }
    }

    @Override
    public void sendPayrollCsvEmail(String to, LocalDate start, LocalDate end, byte[] csvBytes, String htmlBody) {
        try {
            String filename = String.format("payroll_%s_%s.csv", start, end);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Whitefield Farm <no-reply@whitefield.com>");
            helper.setTo(to);
            helper.setSubject("Payroll CSV: " + start + " to " + end);
            helper.setText(htmlBody != null ? htmlBody : "Please find the payroll CSV attached.", true);

            // IMPORTANT: content type "text/csv"
            helper.addAttachment(filename, new ByteArrayResource(csvBytes), "text/csv");

            mailSender.send(message);
        } catch (Exception e) {
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), e.getMessage());
        }
    }
}
