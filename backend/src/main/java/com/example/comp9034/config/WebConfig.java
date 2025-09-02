package com.example.comp9034.config;

import com.example.comp9034.repository.ConfigurationRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static com.example.comp9034.util.Common.getAllowedCORSUrls;

@Configuration
public class WebConfig {
    private final ConfigurationRepository configurationRepository;

    public WebConfig(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(getAllowedCORSUrls(configurationRepository))
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // .allowedHeaders("*")
                        .allowedHeaders("Authorization","Content-Type","Accept","Origin","X-Requested-With")
                        .allowCredentials(true);
            }
        };
    }
}
