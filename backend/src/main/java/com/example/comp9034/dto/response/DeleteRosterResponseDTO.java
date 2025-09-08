package com.example.comp9034.dto.response;

import com.example.comp9034.enums.RosterEnum;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class DeleteRosterResponseDTO {
    private Long shiftId;
    private String employeeId;
    private String action;             // "CANCELLED" or "DELETED"
    private RosterEnum status;
    private Boolean isCancelled;       // true if soft-cancelled
    private LocalDateTime processedAt; // server time
}

