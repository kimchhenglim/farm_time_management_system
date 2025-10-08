package com.example.comp9034.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
@Valid
public class GetRosterByWeekDTO {
    /**
     * Any date inside the target week (ISO: yyyy-MM-dd) normalize to Monday.
     */
    @NotBlank(message = "weekStart cannot be null or empty")
    private String weekStart;

    /**
     * Optional filters
     */
    private List<String> employeeIds;     // one or many employee IDs
    private List<String> stationIds;    // one or many location IDs (added)

    private Boolean includeCancelled = false;
    private Boolean includeArchived = false;

    /**
     * Optional paging (defaults)
     */
    private Integer page = 0;
    private Integer size = 100;
}

