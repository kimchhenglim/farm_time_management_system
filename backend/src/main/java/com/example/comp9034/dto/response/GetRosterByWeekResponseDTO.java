package com.example.comp9034.dto.response;

import com.example.comp9034.dto.RosterDTO;
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
    private LocalDate weekEnd; // Sunday
    private List<RosterDTO> rosterList;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}


