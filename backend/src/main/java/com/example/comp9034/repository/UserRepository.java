package com.example.comp9034.repository;

import com.example.comp9034.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>, JpaSpecificationExecutor<UserEntity> {

    // /**
    //  * Finds a user by their username.
    //  *
    //  * @param username the username to search for
    //  * @param isActive the active status to search for
    //  * @return an Optional containing the User if found, or empty if not found
    //  */
//    @Query("SELECT u FROM User u WHERE u.username = :username AND u.isActive = :isActive")
//    Optional<User> findByUsernameAndActive(String username, boolean isActive);
//
//    @Query("SELECT u FROM User u WHERE u.phoneNumber = :phoneNumber AND u.isActive = :isActive")
//    Optional<User> findByPhoneNumberAndActive(String phoneNumber, boolean isActive);
//
//    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = :isActive")
//    Optional<User> findByEmailAndActive(String email, boolean isActive);

    Optional<UserEntity> findByUserId(String userId);
}
