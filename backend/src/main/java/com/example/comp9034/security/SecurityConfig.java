package com.example.comp9034.security;
import com.example.comp9034.enums.UserEnum;
import com.example.comp9034.repository.ConfigurationRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

import static com.example.comp9034.util.Common.getNonAuthenticatedUrls;


@Log4j2
@Configuration
@Profile("!test")  // Exclude this config when test profile is active
public class SecurityConfig {
    private final ConfigurationRepository configurationRepository;

    public SecurityConfig(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, TokenFilter tokenFilter) throws Exception {
        // Configure HttpSecurity with dynamic non-authenticated URLs
        http
                .csrf().disable()
                .logout().disable()
                .authorizeHttpRequests(auth -> {
                    // Permit the non-authenticated URLs dynamically
                    Arrays.stream(getNonAuthenticatedUrls(configurationRepository))
                            .filter(url -> url != null && !url.trim().isEmpty())
                            .forEach(url -> {
                                log.info("Permitting public URL: {}", url);
                                auth.requestMatchers(url).permitAll();
                            });
                    // Secure admin-only APIs
                    auth.requestMatchers("/admin/**").hasRole(UserEnum.ADMIN.name());
                    //auth.requestMatchers("/admin/**").hasAuthority("ROLE_" + UserEnum.ADMIN.name());
                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class); // Add the token filter
        return http.build();
    }

    @Bean
    public SessionRegistryImpl sessionRegistry() {
        return new SessionRegistryImpl();
    }
}

