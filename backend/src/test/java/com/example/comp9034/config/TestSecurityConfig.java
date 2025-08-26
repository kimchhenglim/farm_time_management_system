package com.example.comp9034.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Test-specific security configuration that overrides production SecurityConfig.
 * Uses hardcoded public URLs to avoid database initialization timing issues.
 */
@TestConfiguration
@Profile("test")
public class TestSecurityConfig {

    @Bean
    @Primary  // Overrides the production SecurityConfig
    public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable()
                .authorizeHttpRequests(auth -> 
                    auth
                        // Hardcoded public endpoints for testing
                        .requestMatchers("/public/api/users/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                .headers(headers -> headers.frameOptions().disable()) // For H2 console
                .build();
    }
}
