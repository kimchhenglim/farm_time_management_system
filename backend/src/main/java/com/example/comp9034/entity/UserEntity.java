package com.example.comp9034.entity;

import com.example.comp9034.enums.GenderEnum;
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

    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private String userId;

    private String firstName;
    private String lastName;
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

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

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PayslipEntity> payslips;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<RosterEntity> rosters;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ClockingEntity> clockings;

    private String role;

    public UserEntity() {

    }
    public UserEntity(String userId, String firstName, String lastName, LocalDate dob, GenderEnum gender, String email, String mobileNumber, String address, String cardId, LocalDateTime createdAt, String role, String password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.cardId = cardId;
        this.createdAt = createdAt;
        this.role = role;
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
