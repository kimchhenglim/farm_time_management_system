package com.example.comp9034.config;

import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.entity.ConfigurationEntity;
import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.entity.User;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.enums.HttpStatusCodeEnum;

import java.time.LocalDate;

/**
 * Utility class for building test data objects.
 * Provides factory methods for creating consistent test data across all tests.
 */
public class TestDataBuilder {

    private TestDataBuilder() {
        // Utility class
    }

    /**
     * Creates a basic User entity for testing.
     */
    public static User createTestUser() {
        return new User(
                "testuser",
                "password123",
                "test@example.com"
        );
    }

    /**
     * Creates a User entity with all fields populated.
     */
    public static User createCompleteTestUser() {
        return new User(
                "testuser",
                "password123",
                "+1234567890",
                LocalDate.of(1990, 1, 1),
                LocalDate.now(),
                "test@example.com",
                true
        );
    }

    /**
     * Creates a User entity with OAuth2 configuration.
     */
    public static User createOAuth2TestUser() {
        return new User(
                "oauth2user",
                "password123",
                LocalDate.of(1990, 1, 1),
                LocalDate.now(),
                "oauth2@example.com",
                true,
                true
        );
    }

    /**
     * Creates a CreateUserDTO for testing registration endpoints.
     */
    public static CreateUserDTO createTestUserDTO() {
        CreateUserDTO dto = new CreateUserDTO("testuser", "password123");
        dto.setEmail("test@example.com");
        dto.setPhoneNumber("+1234567890");
        dto.setDob("01/01/1990");
        dto.setReferredCode("REF123");
        return dto;
    }

    /**
     * Creates a ConfigurationEntity for testing configuration repository.
     */
    public static ConfigurationEntity createTestConfiguration(String configCode, String configValue) {
        ConfigurationEntity config = new ConfigurationEntity();
        config.setConfigCode(configCode);
        config.setConfigValue(configValue);
        return config;
    }

    /**
     * Creates an ErrorCodeEntity for testing error code repository.
     */
    public static ErrorCodeEntity createTestErrorCode(ErrorCodeEnum errorCode) {
        ErrorCodeEntity entity = new ErrorCodeEntity();
        entity.setErrorEnum(errorCode.name());
        entity.setErrorCode(errorCode.getCode());
        entity.setErrorMessage(errorCode.getMessage());
        entity.setErrorDescription("Test description for " + errorCode.name());
        entity.setFlow("COMMON");
        entity.setCreatedDate(LocalDate.now());
        return entity;
    }

    /**
     * Creates an ErrorCodeEntity with specific flow for testing.
     */
    public static ErrorCodeEntity createTestErrorCodeWithFlow(ErrorCodeEnum errorCode, String flow) {
        ErrorCodeEntity entity = new ErrorCodeEntity();
        entity.setErrorEnum(errorCode.name());
        entity.setErrorCode(errorCode.getCode());
        entity.setErrorMessage(errorCode.getMessage());
        entity.setErrorDescription("Test description for " + errorCode.name());
        entity.setFlow(flow);
        entity.setCreatedDate(LocalDate.now());
        return entity;
    }

    /**
     * Creates a valid JWT secret key for testing.
     */
    public static String createTestJwtSecret() {
        return "testSecretKeyThatIsAtLeast256BitsLongForHS512AlgorithmTesting123456789";
    }

    /**
     * Creates test configuration for ACCESS_TOKEN_EXPIRATION_TIME.
     */
    public static ConfigurationEntity createTokenExpirationConfig() {
        return createTestConfiguration("ACCESS_TOKEN_EXPIRATION_TIME", "300000");
    }

    /**
     * Creates test configuration for SECRET_KEY_CONFIG.
     */
    public static ConfigurationEntity createSecretKeyConfig() {
        return createTestConfiguration("SECRET_KEY_CONFIG", createTestJwtSecret());
    }

    /**
     * Creates test configuration for NON_AUTHENTICATED_REQUEST.
     */
    public static ConfigurationEntity createNonAuthenticatedUrlsConfig() {
        return createTestConfiguration("NON_AUTHENTICATED_REQUEST", 
                "/The-Project/api/user/register,/The-Project/api/user/login,/h2-console/**");
    }

    /**
     * Creates test configuration for ALLOWED_CORS_URL_CONFIG.
     */
    public static ConfigurationEntity createCorsUrlsConfig() {
        return createTestConfiguration("ALLOWED_CORS_URL_CONFIG", 
                "http://localhost:3000,http://localhost:8080");
    }
}
