package com.example.comp9034.repository;

import org.springframework.stereotype.Repository;

import com.example.comp9034.entity.ClockingEntity;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


@Repository
public interface ClockingRepository extends JpaRepository<ClockingEntity, Integer>, JpaSpecificationExecutor<ClockingEntity> {

    Optional<ClockingEntity> findById(int id);

    @Query("""
           SELECT DISTINCT c.employeeId
           FROM ClockingEntity c
           WHERE c.clockInTime < :windowEnd
             AND (c.clockOutTime IS NULL OR c.clockOutTime > :windowStart)
           """)
    List<String> findDistinctEmployeeIdsWithOverlap(@Param("windowStart") LocalDateTime windowStart,
                                                    @Param("windowEnd")   LocalDateTime windowEnd);

    /**
     * Check if there exists at least one clocking overlapping the window:
     * Overlap: (clockInTime < windowEnd) AND (clockOutTime IS NULL OR clockOutTime > windowStart)
     */
    @Query("""
           SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
           FROM ClockingEntity c
           WHERE c.employeeId = :employeeId
             AND c.clockInTime < :windowEnd
             AND (c.clockOutTime IS NULL OR c.clockOutTime > :windowStart)
           """)
    boolean existsOverlappingInRange(@Param("employeeId") String employeeId,
                                     @Param("windowStart") LocalDateTime windowStart,
                                     @Param("windowEnd")   LocalDateTime windowEnd);

    /**
     * Find clockings that overlap a given time window:
     * Overlap condition:
     * (clockInTime < windowEnd) AND (clockOutTime IS NULL OR clockOutTime > windowStart)
     * <p>
     * Notes:
     * - This will include shifts that start before the window and/or end after it.
     */
    @Query("""
             SELECT c
                   FROM ClockingEntity c
                   WHERE c.employeeId = :employeeId
                     AND c.clockInTime < :windowEnd
                     AND (c.clockOutTime IS NULL OR c.clockOutTime > :windowStart)
            ORDER BY c.clockInTime ASC
            """)
    List<ClockingEntity> findOverlappingInRange(@Param("employeeId") String employeeId,
                                                @Param("windowStart") LocalDateTime windowStart,
                                                @Param("windowEnd") LocalDateTime windowEnd);

    @Query(
            value = """
                    SELECT 
                        c.id,
                        c.employee_id,
                        CONCAT(u.first_name, ' ', u.last_name) AS employee_name,
                        c.station_id,
                        DATE_FORMAT(c.clock_in_time, '%a %d %b %Y') AS date,
                        TIME_FORMAT(c.clock_in_time, '%H:%i') AS clock_in_time,
                        TIME_FORMAT(c.clock_out_time, '%H:%i') AS clock_out_time,
                        c.is_admin_manual,
                        c.reason_code,
                        COALESCE(
                            c.break_minutes,
                            SUM(TIMESTAMPDIFF(MINUTE, b.break_start_time, b.break_end_time))
                        ) AS break_minutes,
                        u.pay_rate,
                        ROUND(TIMESTAMPDIFF(MINUTE, c.clock_in_time, c.clock_out_time) / 60, 2) AS hours,
                        ROUND((TIMESTAMPDIFF(MINUTE, c.clock_in_time, c.clock_out_time) / 60) * u.pay_rate, 2) AS total
                    FROM clocking c
                    JOIN users u ON u.employee_id = c.employee_id
                    LEFT JOIN break b ON b.clocking_id = c.id
                    WHERE (:employeeId IS NULL OR c.employee_id = :employeeId)
                      AND (:startDate IS NULL OR c.clock_in_time >= :startDate)
                      AND (:endDate IS NULL OR c.clock_out_time <= :endDate OR c.clock_out_time IS NULL)
                    GROUP BY c.id
                    """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM clocking c
                    WHERE (:employeeId IS NULL OR c.employee_id = :employeeId)
                    AND (:startDate IS NULL OR c.clock_in_time >= :startDate)
                    AND (:endDate IS NULL OR c.clock_out_time <= :endDate)
                    """,
            nativeQuery = true
    )
    Page<Object[]> findClockingsNative(
            @Param("employeeId") String employeeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );


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