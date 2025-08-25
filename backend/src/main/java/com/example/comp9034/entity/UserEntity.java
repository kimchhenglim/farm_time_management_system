package com.example.comp9034.entity;

import com.example.comp9034.enums.ContractTypeEnum;
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

    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private String userId;

    private String firstName;
    private String lastName;
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    private String email;
    private String mobileNumber;
    private String address;

    @Column(unique = true)
    private String cardId;

    @Enumerated(EnumType.STRING)
    private ContractTypeEnum contractType;

    private Double payRate;
    private String task;
    private Boolean isActive = true;

    @Column(unique = true)
    private String userName;

    private String password;

    private LocalDateTime createdAt =  LocalDateTime.now();
    private LocalDateTime updatedAt =  LocalDateTime.now();

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PayslipEntity> payslips;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<RosterEntity> rosters;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ClockingEntity> clockings;

    @ManyToOne()
    private RoleEntity role;

    public UserEntity() {

    }

    public UserEntity(int id, String userId, String firstName, String lastName, LocalDate dob,
                  GenderEnum gender, String email, String mobileNumber, String address,
                  String cardId, ContractTypeEnum contractType, Double payRate, String task,
                  Boolean isActive, String userName, String password,
                  LocalDateTime createdAt, LocalDateTime updatedAt,
                  List<PayslipEntity> payslips, List<RosterEntity> rosters,
                  List<ClockingEntity> clockings, RoleEntity role) {
        this.id = id;
        this.userId = userId;
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
        this.isActive = isActive;
        this.userName = userName;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.payslips = payslips;
        this.rosters = rosters;
        this.clockings = clockings;
        this.role = role;
    }
}
