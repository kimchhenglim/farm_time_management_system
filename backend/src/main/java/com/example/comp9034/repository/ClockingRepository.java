package com.example.comp9034.repository;

import org.springframework.stereotype.Repository;

import com.example.comp9034.entity.ClockingEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface ClockingRepository extends JpaRepository<ClockingEntity, Integer>, JpaSpecificationExecutor<ClockingEntity> {
    boolean existsByEmployeeIdAndClockOutTimeIsNull(String employeeId);
    Optional<ClockingEntity> findByEmployeeIdAndClockOutTimeIsNull(String employeeId);
}