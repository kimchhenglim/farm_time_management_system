package com.example.comp9034.entity;

import com.example.comp9034.enums.GenderEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Users")
@Getter
@Setter
public class UserEntity {
//    @Serial
//    private static final long serialVersionUID = 12L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "user_code", nullable = false, unique = true, updatable = false)
    private String userCode;

    private String firstName;
    private String lastName;
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    private String email;
    private String mobileNumber;
    private String address;

    @ManyToOne()
    private RoleEntity role;

    private LocalDateTime createdAt =  LocalDateTime.now();
    private LocalDateTime updatedAt =  LocalDateTime.now();

    public UserEntity() {

    }

    public UserEntity(String firstName, String lastName, GenderEnum gender, String email, String mobileNumber, String address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.address = address;
    }
}
