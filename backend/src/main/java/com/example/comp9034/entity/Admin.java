package com.example.comp9034.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @OneToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User User;

    @Column(unique = true, nullable = false)
    private String UserName;

    @Column(nullable = false)
    private String Password;
}
