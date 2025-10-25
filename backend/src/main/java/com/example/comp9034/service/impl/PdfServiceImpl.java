package com.example.comp9034.service.impl;

import com.example.comp9034.dto.EmployeePayrollDTO;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.service.PdfService;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.INTERNAL_SERVER_ERROR;

@Service
public class PdfServiceImpl implements PdfService {
    private static final Font FONT_TITLE = new Font(Font.HELVETICA, 16, Font.BOLD);
    private static final Font FONT_SUB = new Font(Font.HELVETICA, 11, Font.NORMAL);
    private static final Font FONT_HEADER = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
    private static final Font FONT_CELL = new Font(Font.HELVETICA, 10, Font.NORMAL);

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final NumberFormat CURRENCY = NumberFormat.getCurrencyInstance(Locale.US); // change to Locale for your currency

    public PdfServiceImpl() {
    }

    @Override
    public byte[] generatePayrollPDF(List<EmployeePayrollDTO> dtoList, LocalDate start, LocalDate end) {
        if (dtoList == null || dtoList.isEmpty()) {
            throw new IllegalArgumentException("No payroll to render.");
        }
        // If you trust the DTO dates, you can also read start/end from the first row.
        if (start == null) start = dtoList.get(0).getStartDate();
        if (end == null) end = dtoList.get(0).getEndDate();

        var baos = new ByteArrayOutputStream();
        var document = new Document(PageSize.A4.rotate(), 24, 24, 24, 24); // landscape A4 for wide table

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Header (title + time frame)
            Paragraph title = new Paragraph("Payroll Report", FONT_TITLE);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);

            Paragraph sub = new Paragraph(
                    "Time Frame: " + (start != null ? start.format(DATE_FMT) : "?")
                            + " to " + (end != null ? end.format(DATE_FMT) : "?"),
                    FONT_SUB
            );
            sub.setSpacingAfter(12f);
            document.add(sub);

            // Table
            PdfPTable table = new PdfPTable(12);  // columns
            table.setWidthPercentage(100);
            table.setWidths(new float[]{
                    18f,  // Employee ID
                    28f,  // Employee name
                    36f,  // Employee email
                    20f,  // Regular Minutes
                    20f,  // OT Minutes
                    20f,  // Regular Hours
                    20f,  // OT Hours
                    24f,  // Regular Wage
                    24f,  // OT Wage
                    26f,  // Total Wage
                    24f,  // Period Start
                    24f   // Period End
            });

            // Header row
            addHeaderCell(table, "Employee ID");
            addHeaderCell(table, "Employee name");
            addHeaderCell(table, "Employee email");
            addHeaderCell(table, "Regular Minutes");
            addHeaderCell(table, "OT Minutes");
            addHeaderCell(table, "Regular Hours");
            addHeaderCell(table, "OT Hours");
            addHeaderCell(table, "Regular Wage");
            addHeaderCell(table, "OT Wage");
            addHeaderCell(table, "Total Wage");
            addHeaderCell(table, "Period Start");
            addHeaderCell(table, "Period End");

            long sumRegMin = 0;
            long sumOtMin = 0;
            long sumRegWage = 0;
            long sumOtWage = 0;
            long sumTotalWage = 0;

            for (var r : dtoList) {
                sumRegMin += r.getRegularMinutes();
                sumOtMin += r.getOtMinutes();
                sumRegWage += r.getRegularWage();
                sumOtWage += r.getOtWage();
                sumTotalWage += r.getTotalWage();

                addCell(table, r.getEmployeeId());
                addCellCenter(table, r.getEmployeeName());
                addCellCenter(table, r.getEmail());
                addCellCenter(table, String.valueOf(r.getRegularMinutes()));
                addCellCenter(table, String.valueOf(r.getOtMinutes()));
                addCellCenter(table, String.valueOf(r.getRegularHours()));
                addCellCenter(table, String.valueOf(r.getOtHours()));
                addCellCenter(table, CURRENCY.format(r.getRegularWage()));
                addCellCenter(table, CURRENCY.format(r.getOtWage()));
                addCellCenter(table, CURRENCY.format(r.getTotalWage()));
                addCellCenter(table, r.getStartDate() != null ? r.getStartDate().format(DATE_FMT) : "");
                addCellCenter(table, r.getEndDate() != null ? r.getEndDate().format(DATE_FMT) : "");
            }

            // Totals row
            PdfPCell totalLabel = new PdfPCell(new Phrase("TOTALS", FONT_HEADER));
            totalLabel.setBackgroundColor(new Color(33, 37, 41));
            totalLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totalLabel.setColspan(3);
            totalLabel.setPadding(6f);
            table.addCell(totalLabel);

            addTotalCellRight(table, String.valueOf(sumRegMin));
            addTotalCellRight(table, String.valueOf(sumOtMin));
            addTotalCellRight(table, ""); // hours total optional; derive if needed
            addTotalCellRight(table, "");
            addTotalCellRight(table, CURRENCY.format(sumRegWage));
            addTotalCellRight(table, CURRENCY.format(sumOtWage));
            addTotalCellRight(table, CURRENCY.format(sumTotalWage));
            addTotalCellRight(table, "");
            addTotalCellRight(table, "");

            document.add(table);

            // Footer note (optional)
            Paragraph foot = new Paragraph("Generated at: " + java.time.LocalDateTime.now(), FONT_SUB);
            foot.setSpacingBefore(12f);
            document.add(foot);

        } catch (Exception ex) {
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), "Failed to build payroll PDF");
        } finally {
            document.close();
        }
        return baos.toByteArray();
    }

    private void addCellCenter(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text == null ? "" : text, FONT_CELL));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5f);
        table.addCell(cell);
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_HEADER));
        cell.setBackgroundColor(new Color(33, 37, 41));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6f);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text == null ? "" : text, FONT_CELL));
        cell.setPadding(5f);
        table.addCell(cell);
    }

    private void addTotalCellRight(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text == null ? "" : text, FONT_HEADER));
        cell.setBackgroundColor(new Color(33, 37, 41));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setPadding(6f);
        table.addCell(cell);
    }
}
