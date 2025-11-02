package com.example.comp9034.mapper;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.example.comp9034.dto.ClockingDTO;
import com.example.comp9034.dto.request.CreateClockingDTO;
import com.example.comp9034.dto.request.UpdateClockingDTO;
import com.example.comp9034.entity.ClockingEntity;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public abstract class ClockingMapper {
    
    /**
     * Maps entity to DTO and converts UTC times to Adelaide timezone
     */
    public ClockingDTO toClockingDTO(ClockingEntity entity) {
        if (entity == null) {
            return null;
        }
        
        ClockingDTO dto = new ClockingDTO();
        dto.setId(entity.getId());
        dto.setEmployeeId(entity.getEmployeeId());
        dto.setStationId(entity.getStationId());
        dto.setAdminManual(entity.isAdminManual());
        dto.setReasonCode(entity.getReasonCode());
        dto.setBreakMinutes(entity.getBreakMinutes());
        
        // Convert UTC times to Adelaide time for frontend
        dto.setClockInTime(convertToAdelaideTime(entity.getClockInTime()));
        dto.setClockOutTime(convertToAdelaideTime(entity.getClockOutTime()));
        
        return dto;
    }

    public abstract ClockingEntity toClockingEntity(CreateClockingDTO dto);

    public abstract void updateEntityFromDto(UpdateClockingDTO dto, @MappingTarget ClockingEntity entity);

    /**
     * Converts UTC LocalDateTime to Adelaide time zone for frontend display
     */
    protected LocalDateTime convertToAdelaideTime(LocalDateTime utcTime) {
        if (utcTime == null) {
            return null;
        }
        return ZonedDateTime.of(utcTime, ZoneOffset.UTC)
            .withZoneSameInstant(ZoneId.of("Australia/Adelaide"))
            .toLocalDateTime();
    }
}
