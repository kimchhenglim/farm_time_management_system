package com.example.comp9034.service;

import com.example.comp9034.dto.request.CreateRosterDTO;
import com.example.comp9034.dto.request.DeleteRosterDTO;
import com.example.comp9034.dto.request.GetRosterByWeekDTO;
import com.example.comp9034.response_template.CompleteResponse;

public interface RosterService {
    CompleteResponse<Object> createRoster(CreateRosterDTO registerRequest);

    CompleteResponse<Object> getRoster(GetRosterByWeekDTO registerRequest);

    CompleteResponse<Object> deleteRoster(DeleteRosterDTO registerRequest);

    CompleteResponse<Object> updateRoster(CreateRosterDTO registerRequest);
}
