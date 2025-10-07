package com.example.comp9034.entity;

import com.example.comp9034.enums.StationEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "station")
@Getter
@Setter
public class StationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long stationId;

    @Column(name = "station_location", nullable = false)
    private String stationLocation;

    @Column(name = "station_name", nullable = false)
    private String stationName;

    @Enumerated(EnumType.STRING)
    private StationEnum status;

    public StationEntity(String stationLocation, String stationName, StationEnum status, String createdBy) {
        this.stationLocation = stationLocation;
        this.stationName = stationName;
        this.status = status;
        this.createdBy = createdBy;
    }

    private String createdBy;
    private LocalDateTime createdAt = LocalDateTime.now();


    public StationEntity() {
    }
}
