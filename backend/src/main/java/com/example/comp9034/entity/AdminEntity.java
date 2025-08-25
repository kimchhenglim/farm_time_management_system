package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Admin")
@Getter
@Setter
public class AdminEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne()
    @JoinColumn(name = "userId", nullable = false)
    private UserEntity user;

    @Column(unique = true, nullable = false)
    private String userName;

    @Column(nullable = false)
    private String password;
}
