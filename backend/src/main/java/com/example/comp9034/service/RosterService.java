package com.example.comp9034.service;

import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.EditRosterDTO;
import com.example.comp9034.response_template.CompleteResponse;

import java.util.List;

public interface RosterService {
    CompleteResponse<Object> createRoster(CreateRosterDTO registerRequest);

    CompleteResponse<Object> getRoster(String weekStart, List<String> employeeId, List<String> locations, boolean includeCancelled, int page, int size);

    CompleteResponse<Object> deleteRoster(Long rosterId, Boolean hard);

    CompleteResponse<Object> updateRoster(EditRosterDTO request);

    CompleteResponse<Object> getRosterLocations(String keyword);
}
