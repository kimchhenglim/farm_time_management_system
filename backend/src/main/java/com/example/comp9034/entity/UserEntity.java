package com.example.comp9034.entity;

import com.example.comp9034.enums.UserEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity implements Serializable, UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, updatable = false)
    private String employeeId;

    private String firstName;
    private String lastName;
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private UserEnum gender;

    @Column(unique = true)
    private String email;

    private String mobileNumber;
    private String address;

    @Column(unique = true)
    private String cardId;

    @Enumerated(EnumType.STRING)
    private UserEnum contractType;

    private Double payRate;
    private String task;
    private Boolean isActive = true;

    private String password;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    private int roleId;

    public UserEntity() {

    }
    public UserEntity(String employeeId, String firstName, String lastName, LocalDate dob, UserEnum gender, String email, String mobileNumber, String address, String cardId, UserEnum contractType, Double payRate, String task, LocalDateTime createdAt, int roleId, String password) {
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.cardId = cardId;
        this.contractType = contractType;
        this.payRate = payRate;
        this.task = task;
        this.createdAt = createdAt;
        this.roleId = roleId;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return "";
    }
}
