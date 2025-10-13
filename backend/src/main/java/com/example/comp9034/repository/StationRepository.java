package com.example.comp9034.repository;

import com.example.comp9034.entity.StationEntity;
import com.example.comp9034.enums.StationEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<StationEntity, Long>, JpaSpecificationExecutor<StationEntity> {
    Optional<StationEntity> findByStationNameAndStationLocationAndStatus(String stationName, String stationLocation, StationEnum status);

    Optional<StationEntity> findByStationId(long stationid);
}
