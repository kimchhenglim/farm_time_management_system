package com.example.comp9034.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.core.config.plugins.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "token-black-list")
@Getter
@Setter
public class TokenBlackListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String email;

    @NotBlank
    private String token;


    private LocalDateTime created = LocalDateTime.now();

    public TokenBlackListEntity(String email, String token) {
        this.email = email;
        this.token = token;
    }

    public TokenBlackListEntity() {
    }
}
