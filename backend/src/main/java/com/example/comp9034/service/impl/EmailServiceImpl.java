package com.example.comp9034.service.impl;

import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.INTERNAL_SERVER_ERROR;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.mail.SimpleMailMessage;
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
}
