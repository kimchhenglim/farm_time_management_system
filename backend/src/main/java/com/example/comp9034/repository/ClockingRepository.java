package com.example.comp9034.repository;

import org.springframework.stereotype.Repository;

import com.example.comp9034.entity.ClockingEntity;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface ClockingRepository extends JpaRepository<ClockingEntity, Integer>, JpaSpecificationExecutor<ClockingEntity> {

    Optional<ClockingEntity> findById(int id);

    boolean existsByEmployeeIdAndClockOutTimeIsNull(String employeeId);
    Optional<ClockingEntity> findByEmployeeIdAndClockOutTimeIsNull(String employeeId);

    @Query("""
            SELECT COUNT(c) > 0
            FROM ClockingEntity c
            WHERE c.employeeId = :employeeId
            AND c.clockInTime < :clockOutTime
            AND c.clockOutTime > :clockInTime
            """)
    boolean existOverlap(@Param("employeeId") String employeeId,
                        @Param("clockInTime") LocalDateTime clockInTime,
                        @Param("clockOutTime") LocalDateTime clockOutTime);

    @Query("""
            SELECT COUNT(c) > 0
            FROM ClockingEntity c
            WHERE c.employeeId = :employeeId
            AND c.clockInTime < :clockOutTime
            AND c.clockOutTime > :clockInTime
            AND c.id <> :clockingId
            """)
    boolean existOverlapExcept(@Param("employeeId") String employeeId,
                        @Param("clockInTime") LocalDateTime clockInTime,
                        @Param("clockOutTime") LocalDateTime clockOutTime,
                        @Param("clockingId") int clockingId);
}