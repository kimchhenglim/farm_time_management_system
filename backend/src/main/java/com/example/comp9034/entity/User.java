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
public class User implements Serializable {
    @Serial
    private static final long serialVersionUID = 12L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    @Column(nullable = false, unique = true, updatable = false)
    private String UserCode;

    private String FirstName;
    private String LastName;
    private LocalDate Dob;

    @Enumerated(EnumType.STRING)
    private GenderEnum Gender;

    private String Email;
    private String MobileNumber;
    private String Address;

    @ManyToOne(fetch = FetchType.LAZY)
    private Role Role;

    private LocalDateTime CreatedAt =  LocalDateTime.now();
    private LocalDateTime UpdatedAt =  LocalDateTime.now();

    // Relationships
    @OneToMany(mappedBy = "User", cascade = CascadeType.ALL)
    private List<Payslip> Payslips;

    @OneToMany(mappedBy = "User", cascade = CascadeType.ALL)
    private List<Roster> Rosters;

    @OneToMany(mappedBy = "User", cascade = CascadeType.ALL)
    private List<Clocking> Clockings;

    public User() {

    }

    public User(String FirstName, String LastName, GenderEnum Gender, String Email, String MobileNumber, String Address) {
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Gender = Gender;
        this.Email = Email;
        this.MobileNumber = MobileNumber;
        this.Address = Address;
    }
}
