package com.example.comp9034.service;

import com.example.comp9034.dto.request.BreakEndDTO;
import com.example.comp9034.dto.request.BreakStartDTO;
import com.example.comp9034.dto.request.ClockDTO;
import com.example.comp9034.response_template.CompleteResponse;

public interface ClockingService {
    public CompleteResponse<Object> clockIn(ClockDTO dto);
    public CompleteResponse<Object> clockOut(ClockDTO dto);
    public CompleteResponse<Object> breakStart(BreakStartDTO dto);
    public CompleteResponse<Object> breakEnd(BreakEndDTO dto);
}
