package com.example.comp9034.service.impl;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.EMAIL_SENT_FAIL;
import static com.example.comp9034.enums.ErrorCodeEnum.INTERNAL_SERVER_ERROR;
import static com.example.comp9034.util.Common.getConfigValue;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.example.comp9034.repository.ConfigurationRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Log4j2
@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSenderImpl mailSender;
    private final ConfigurationRepository configurationRepository;

    public EmailServiceImpl(JavaMailSender mailSender, ConfigurationRepository configurationRepository) {
        this.mailSender = (JavaMailSenderImpl) mailSender;
        this.configurationRepository = configurationRepository;
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
            log.error("Failed to send email!", e);
            throw new BusinessException(EMAIL_SENT_FAIL, EMAIL.name(), null);
        } catch (Exception e) {
            log.error("There has been an error in sending email!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, EMAIL.name(), null);
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
//            String latestAccessToken =
//                    getConfigValue(EMAIL_ACCESS_TOKEN_CONFIG, configurationRepository, EMAIL.name());
//            mailSender.setPassword(latestAccessToken);

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Whitefield Farm <no-reply@whitefield.com>");
            helper.setTo(to);
            helper.setSubject("Payroll Report: " + start + " to " + end);
            helper.setText(htmlBody != null ? htmlBody : "Please find the payroll report attached.", true);

            helper.addAttachment(filename, new ByteArrayResource(pdfBytes));

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email!", e);
            throw new BusinessException(EMAIL_SENT_FAIL, EMAIL.name(), null);
        } catch (Exception e) {
            log.error("There has been an error in sending email!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, EMAIL.name(), null);
        }
    }

    @Override
    public void sendPayrollCsvEmail(String to, LocalDate start, LocalDate end, byte[] csvBytes, String htmlBody) {
        try {
            String filename = String.format("payroll_%s_%s.csv", start, end);

            MimeMessage message = mailSender.createMimeMessage();
//            String latestAccessToken =
//                    getConfigValue(EMAIL_ACCESS_TOKEN_CONFIG, configurationRepository, EMAIL.name());
//            mailSender.setPassword(latestAccessToken);

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Whitefield Farm <no-reply@whitefield.com>");
            helper.setTo(to);
            helper.setSubject("Payroll CSV: " + start + " to " + end);
            helper.setText(htmlBody != null ? htmlBody : "Please find the payroll CSV attached.", true);

            helper.addAttachment(filename, new ByteArrayResource(csvBytes), "text/csv");

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email!", e);
            throw new BusinessException(EMAIL_SENT_FAIL, EMAIL.name(), null);
        } catch (Exception e) {
            log.error("There has been an error in sending email!", e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, EMAIL.name(), null);
        }
    }
}
