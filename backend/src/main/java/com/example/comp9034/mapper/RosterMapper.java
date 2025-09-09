package com.example.comp9034.mapper;

import com.example.comp9034.dto.RosterDTO;
import com.example.comp9034.entity.RosterEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface RosterMapper {
    @Mapping(target = "rosterId", expression = "java(String.valueOf(e.getId()))")
    @Mapping(
            target = "netMinutes",
            expression = "java( Math.max(0L, " +
                    "java.time.Duration.between(e.getStartTime(), e.getEndTime()).toMinutes() - " +
                    "(e.getBreakMinutes() == null ? 0 : e.getBreakMinutes()) ) )"
    )
    RosterDTO toWeekDto(RosterEntity e);

    List<RosterDTO> toWeekDtos(List<RosterEntity> entities);
}
