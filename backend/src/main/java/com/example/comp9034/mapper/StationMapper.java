package com.example.comp9034.mapper;

import com.example.comp9034.dto.request.StationDTO;
import com.example.comp9034.entity.StationEntity;
import com.example.comp9034.enums.StationEnum;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface StationMapper {
    @Mapping(target = "stationId", source = "stationId")
    @Mapping(target = "stationName", source = "stationName")
    @Mapping(target = "status", source = "status", qualifiedByName = "enumToString")
    StationDTO toStationDto(StationEntity e);

    List<StationDTO> toStationDtos(List<StationEntity> entities);

    @Named("enumToString")
    static String enumToString(StationEnum status) {
        return status == null ? null : status.name();
    }
}
