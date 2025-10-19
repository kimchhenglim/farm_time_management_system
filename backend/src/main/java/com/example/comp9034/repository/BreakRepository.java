package com.example.comp9034.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.comp9034.entity.BreakEntity;

@Repository
public interface BreakRepository extends JpaRepository<BreakEntity, Integer>, JpaSpecificationExecutor<BreakEntity> {
    Optional<BreakEntity> findByClockingIdAndBreakEndTimeIsNull(Integer clockingId);
}
