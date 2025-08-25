package com.example.comp9034.repository;

import com.example.comp9034.entity.StaffEntity;
import com.example.comp9034.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<StaffEntity, Integer> {
    Optional<StaffEntity> findByUser(UserEntity user);
}
