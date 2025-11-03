package com.example.comp9034.mapper;

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
public interface ClockingMapper {
    ClockingDTO toClockingDTO(ClockingEntity entity);

    ClockingEntity toClockingEntity(CreateClockingDTO dto);

    void updateEntityFromDto(UpdateClockingDTO dto, @MappingTarget ClockingEntity entity);
}
