package com.example.comp9034.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class GetRosterByWeekResponseDTO {
    private LocalDate weekStart;        // normalized Monday
    private LocalDate weekEndInclusive; // Sunday
    private List<CreateRosterResponseDTO> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}


