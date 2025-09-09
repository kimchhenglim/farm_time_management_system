package com.example.comp9034.repository;

import com.example.comp9034.entity.RosterEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RosterRepository extends JpaRepository<RosterEntity, Long>, JpaSpecificationExecutor<RosterEntity> {
    
    @Query("""
        SELECT r.employeeId, MIN(r.startTime), MIN(r.endTime)
        FROM RosterEntity r
        WHERE r.employeeId IN :employeeIds AND r.startTime > CURRENT_TIMESTAMP
        GROUP BY r.employeeId
    """)
    List<Object[]> findUpcomingShiftsForUsers(@Param("employeeIds") List<String> employeeIds);


    @Query("""
        SELECT COUNT(s) > 0 FROM RosterEntity s
        WHERE s.employeeId = :empId
          AND s.isCancelled = false
          AND s.startTime < :end
          AND s.endTime   > :start
    """)
    boolean existsOverlap(@Param("empId") String empId,
                          @Param("start") LocalDateTime start,
                          @Param("end") LocalDateTime end);

    @Query(value = """
        SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, r.start_time, r.end_time) - r.break_minutes), 0)
        FROM roster r
        WHERE r.employee_id = :empId
          AND r.date >= :weekStart
          AND r.date <  DATE_ADD(:weekStart, INTERVAL 7 DAY)
          AND r.is_cancelled = 0
    """, nativeQuery = true)
    long sumWeekMinutes(@Param("empId") String empId,
                        @Param("weekStart") LocalDate weekStart);

    Optional<RosterEntity> findByStartTimeAndEndTimeAndEmployeeId(LocalDateTime startTime, LocalDateTime endTime, String employeeId);

    Optional<RosterEntity> findById (Long rosterId);
//
//    Page<RosterEntity> findByDateBetweenAndIsCancelledFalse(LocalDate startInclusive,
//                                                            LocalDate endInclusive,
//                                                            Pageable pageable);
//
//    Page<RosterEntity> findByEmployeeIdAndDateBetweenAndIsCancelledFalse(String employeeId,
//                                                                         LocalDate startInclusive,
//                                                                         LocalDate endInclusive,
//                                                                         Pageable pageable);
}
