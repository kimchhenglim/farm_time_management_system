package com.example.comp9034.repository;

import com.example.comp9034.entity.RosterEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RosterRepository extends JpaRepository<RosterEntity, Integer> {
    
    @Query("""
        SELECT r.employeeId, MIN(r.startTime), MIN(r.endTime)
        FROM RosterEntity r
        WHERE r.employeeId IN :employeeIds AND r.startTime > CURRENT_TIMESTAMP
        GROUP BY r.employeeId
    """)
    List<Object[]> findUpcomingShiftsForUsers(@Param("employeeIds") List<String> employeeIds);
}
