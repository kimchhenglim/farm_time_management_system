package com.example.comp9034.service.impl;

import com.example.comp9034.dto.request.CreateStationDTO;
import com.example.comp9034.dto.request.EditStationDTO;
import com.example.comp9034.dto.request.StationDTO;
import com.example.comp9034.dto.response.CreateStationResponseDTO;
import com.example.comp9034.dto.response.DeleteStationDTO;
import com.example.comp9034.dto.response.GetStationResponseDTO;
import com.example.comp9034.entity.StationEntity;
import com.example.comp9034.enums.StationEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.mapper.RosterMapper;
import com.example.comp9034.mapper.StationMapper;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.StationRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.StationService;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;


@Service
@Log4j2
public class StationServiceImpl implements StationService {
    private final StationRepository stationRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final StationMapper stationMapper;

    public StationServiceImpl(StationRepository stationRepository, ErrorCodeRepository errorCodeRepository, StationMapper stationMapper) {
        this.errorCodeRepository = errorCodeRepository;
        this.stationRepository = stationRepository;
        this.stationMapper = stationMapper;
    }

    @Override
    public CompleteResponse<Object> createStation(CreateStationDTO createDTO) {
        try {

            String stationName = createDTO.getName().trim();
            String stationLocation = createDTO.getLocation();
            Optional<StationEntity> stationOptional = stationRepository.findByStationNameAndStationLocationAndStatus(stationName, stationLocation, StationEnum.ACTIVE);
            if (stationOptional.isPresent()) {
                String msg = "Station " + stationName + " already exist!";
                log.error(msg);
                throw new BusinessException(STATION_EXISTED, STATION.name(), msg);
            }
            StationEntity newStation = new StationEntity(stationLocation, stationName, StationEnum.ACTIVE, SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());
            stationRepository.save(newStation);
            log.info("Created new station {} succesfully with location: {}", stationName, stationLocation);
            CreateStationResponseDTO response = new CreateStationResponseDTO()
                    .toBuilder()
                    .stationName(stationName)
                    .stationLocation(stationLocation)
                    .createdBy(newStation.getCreatedBy())
                    .status(newStation.getStatus())
                    .build();
            return getCompleteResponse(errorCodeRepository, CREATE_STATION_SUCCESS, STATION.name(), response);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error creating new station " + createDTO.getName() + " " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    @Override
    public CompleteResponse<Object> getStation(String status, List<Long> stationIds, int page, int size) {
        try {
            size = Math.min(Math.max(size, 1), 500);
            page = Math.max(page, 0);

            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.ASC, "stationName")
                            .and(Sort.by(Sort.Direction.ASC, "status")) // works because @Enumerated(STRING)
            );

            Specification<StationEntity> spec = buildStationSpec(parseStatus(status), safeList(stationIds));

            Page<StationEntity> result = stationRepository.findAll(spec, pageable);

            log.info("Fetched {} stations (page {}/{}) filters: status={}, ids={}",
                    result.getNumberOfElements(), result.getNumber() + 1, result.getTotalPages(), status, stationIds);

            List<StationDTO> stations = stationMapper.toStationDtos(result.getContent()); // <-- method name fix

            GetStationResponseDTO response = GetStationResponseDTO.builder()
                    .page(page)
                    .size(size)
                    .totalElements(result.getTotalElements())
                    .totalPages(result.getTotalPages())
                    .stationList(stations)
                    .build();

            return getCompleteResponse(errorCodeRepository, GET_STATION_SUCCESS, STATION.name(), response);

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error getting stations: " + e;
            log.error(msg, e);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    private Specification<StationEntity> buildStationSpec(StationEnum status, List<Long> stationIds) {
        return (root, query, cb) -> {
            List<Predicate> ps = new ArrayList<>();

            if (status != null) {
                ps.add(cb.equal(root.get("status"), status)); // enum compare
            }

            if (stationIds != null && !stationIds.isEmpty()) {
                ps.add(root.get("stationId").in(stationIds)); // correct PK field
            }

            // Optional: enforce case-insensitive DB-level sort by name
            // query.orderBy(cb.asc(cb.lower(root.get("stationName"))));

            return cb.and(ps.toArray(new Predicate[0]));
        };
    }

    private StationEnum parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            return StationEnum.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            log.warn("Ignoring unknown status '{}'", status);
            return null;
        }
    }

    private List<Long> safeList(List<Long> list) {
        return (list == null) ? Collections.emptyList() : list;
    }

    @Override
    public CompleteResponse<Object> deleteStation(Long stationId, Boolean hard) {
        try {
            StationEntity stationEntity = stationRepository.findByStationId(stationId).orElseThrow(() -> {
                String msg = "Station with ID " + stationId + " not found.";
                log.error(msg);
                return new BusinessException(STATION_NOT_FOUND, STATION.name(), msg);
            });

            if (!Boolean.TRUE.equals(hard) && StationEnum.INACTIVE.equals(stationEntity.getStatus())) {
                String msg = "Station with ID: " + stationId + " is already inactive.";
                log.error(msg);
                throw new BusinessException(STATION_ALREADY_INACTIVE, STATION.name(), msg);
            }
            DeleteStationDTO response = DeleteStationDTO
                    .builder()
                    .stationId(stationId)
                    .stationName(stationEntity.getStationName())
                    .stationLocation(stationEntity.getStationLocation())
                    .status(stationEntity.getStatus().name())
                    .processedAt(LocalDateTime.now())
                    .build();
            if (Boolean.TRUE.equals(hard)) {
                // Hard delete
                stationRepository.delete(stationEntity);
                log.info("Hard-deleted station with ID {}", stationId);
                response.setAction("DELETED");
            } else {
                stationEntity.setStatus(StationEnum.INACTIVE);
                stationRepository.save(stationEntity);
                log.info("Deactivate station ID {}", stationEntity.getStationId());
                response.setAction("DEACTIVATE");
            }
            return getCompleteResponse(errorCodeRepository, DELETE_STATION_SUCCESS, STATION.name(), response);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error deleting station with ID {}";
            log.error(msg, stationId);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }

    @Override
    public CompleteResponse<Object> updateStation(EditStationDTO request) {
        long stationId = request.getStationId();
        try {
            StationEntity stationEntity = stationRepository.findByStationId(stationId).orElseThrow(() -> {
                String msg = "Station with ID: " + stationId + " not found.";
                log.error(msg);
                return new BusinessException(STATION_NOT_FOUND, STATION.name(), msg);
            });

            stationEntity.setStationLocation(request.getStationLocation());
            stationEntity.setStationName(request.getStationName().trim());
            if (Objects.equals(request.getStatus(), StationEnum.ACTIVE.name()) || Objects.equals(request.getStatus(), StationEnum.INACTIVE.name())) {
                stationEntity.setStatus(StationEnum.valueOf(request.getStatus()));
            }
            stationRepository.save(stationEntity);
            log.info("Update station with ID {} succesfully", Long.toString(stationId));
            return getCompleteResponse(errorCodeRepository, UPDATE_STATION_SUCCESS, STATION.name(), request);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            String msg = "There has been an error updating station with ID {}";
            log.error(msg, request.getStationId());
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), msg);
        }
    }
}