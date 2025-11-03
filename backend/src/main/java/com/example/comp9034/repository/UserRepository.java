package com.example.comp9034.repository;

import com.example.comp9034.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>, JpaSpecificationExecutor<UserEntity> {

    Optional<UserEntity> findByEmployeeId(String employeeId);

    Optional<UserEntity> findByCardId(String cardId);

    @Query("SELECT u FROM UserEntity u WHERE u.email = :email AND u.isActive = :isActive")
    Optional<UserEntity> findByEmailAndActive(String email, boolean isActive);

    @Query("SELECT u FROM UserEntity u WHERE u.email = :email AND u.isActive = :isActive")
    Optional<UserEntity> findByEmailAndActiveAndRole(String email, boolean isActive, String role);

    @Query("SELECT u FROM UserEntity u WHERE u.employeeId = :employeeId AND u.isActive = :isActive")
    Optional<UserEntity> findByEmployeeIdAndActive(String employeeId, boolean isActive);
}
