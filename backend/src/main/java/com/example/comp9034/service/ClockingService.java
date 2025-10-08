package com.example.comp9034.service;

import com.example.comp9034.dto.request.BreakEndDTO;
import com.example.comp9034.dto.request.BreakStartDTO;
import com.example.comp9034.dto.request.ClockDTO;
import com.example.comp9034.dto.request.ClockingFilterDTO;
import com.example.comp9034.dto.request.CreateClockingDTO;
import com.example.comp9034.dto.request.UpdateClockingDTO;
import com.example.comp9034.response_template.CompleteResponse;

public interface ClockingService {
    public CompleteResponse<Object> getClockings(ClockingFilterDTO dto);
    public CompleteResponse<Object> createClocking(CreateClockingDTO dto);
    public CompleteResponse<Object> updateClocking(UpdateClockingDTO dto, int clockingId);
    public CompleteResponse<Object> deleteClocking(int clockingId);
    public CompleteResponse<Object> clockIn(ClockDTO dto);
    public CompleteResponse<Object> clockOut(ClockDTO dto);
    public CompleteResponse<Object> breakStart(BreakStartDTO dto);
    public CompleteResponse<Object> breakEnd(BreakEndDTO dto);
}
