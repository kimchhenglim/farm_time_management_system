package com.example.comp9034.unit;

import com.example.comp9034.config.TestDataBuilder;
import com.example.comp9034.entity.ConfigurationEntity;
import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.enums.CommonEnum;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.enums.HttpStatusCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.util.Common;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

/**
 * Unit tests for Common utility class.
 * Tests static utility methods for error code handling, configuration management, and data conversion.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Common Utility Tests")
class CommonTest {

    @Mock
    private ConfigurationRepository configurationRepository;

    private ErrorCodeEntity testErrorCodeEntity;
    private ConfigurationEntity testConfigurationEntity;

    @BeforeEach
    void setUp() {
        testErrorCodeEntity = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.USER_CREATED, "COMMON");
        testConfigurationEntity = TestDataBuilder.createTestConfiguration("TEST_CONFIG", "test_value");
    }

    @Test
    @DisplayName("Should return correct HTTP status code from error code")
    void getHttpFromErrorCode_Success() {
        // Given
        String errorCode = "USER_CREATED";

        // When
        HttpStatusCodeEnum result = Common.getHttpFromErrorCode(errorCode);

        // Then
        assertThat(result).isEqualTo(HttpStatusCodeEnum.CREATED);
    }

    @Test
    @DisplayName("Should return undefined HTTP status for empty error code")
    void getHttpFromErrorCode_EmptyErrorCode() {
        // Given
        String errorCode = "";

        // When
        HttpStatusCodeEnum result = Common.getHttpFromErrorCode(errorCode);

        // Then
        assertThat(result).isEqualTo(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should throw BusinessException for invalid error code")
    void getHttpFromErrorCode_InvalidErrorCode() {
        // Given
        String errorCode = "INVALID_ERROR_CODE";

        // When & Then
        assertThatThrownBy(() -> Common.getHttpFromErrorCode(errorCode))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.UNDEFINED_HTTP_CODE);
    }

    @Test
    @DisplayName("Should return error code from ErrorCodeEntity")
    void getErrorCode_Success() {
        // When
        String result = Common.getErrorCode(testErrorCodeEntity);

        // Then
        assertThat(result).isEqualTo("E000");
    }

    @Test
    @DisplayName("Should return undefined error code for null entity")
    void getErrorCode_NullEntity() {
        // When
        String result = Common.getErrorCode(null);

        // Then
        assertThat(result).isEqualTo(ErrorCodeEnum.UNDEFINED_ERROR_CODE.getCode());
    }

    @Test
    @DisplayName("Should return error message from ErrorCodeEntity")
    void getErrorCodeMessage_Success() {
        // When
        String result = Common.getErrorCodeMessage(testErrorCodeEntity);

        // Then
        assertThat(result).isEqualTo("User created");
    }

    @Test
    @DisplayName("Should return undefined error message for null entity")
    void getErrorCodeMessage_NullEntity() {
        // When
        String result = Common.getErrorCodeMessage(null);

        // Then
        assertThat(result).isEqualTo(ErrorCodeEnum.UNDEFINED_ERROR_CODE.getMessage());
    }

    @Test
    @DisplayName("Should return config value by CommonEnum")
    void getConfigValue_ByCommonEnum_Success() {
        // Given
        CommonEnum configEnum = CommonEnum.COMMON;
        when(configurationRepository.findByConfigCode("COMMON"))
                .thenReturn(Optional.of(testConfigurationEntity));

        // When
        String result = Common.getConfigValue(configEnum, configurationRepository, "TEST_FLOW");

        // Then
        assertThat(result).isEqualTo("test_value");
        verify(configurationRepository).findByConfigCode("COMMON");
    }

    @Test
    @DisplayName("Should throw BusinessException when config not found by CommonEnum")
    void getConfigValue_ByCommonEnum_NotFound() {
        // Given
        CommonEnum configEnum = CommonEnum.COMMON;
        when(configurationRepository.findByConfigCode("COMMON"))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> Common.getConfigValue(configEnum, configurationRepository, "TEST_FLOW"))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.CONFIG_NOT_FOUND);

        verify(configurationRepository).findByConfigCode("COMMON");
    }

    @Test
    @DisplayName("Should return config value by string key")
    void getConfigValue_ByString_Success() {
        // Given
        String key = "TEST_CONFIG";
        when(configurationRepository.findByConfigCode(key))
                .thenReturn(Optional.of(testConfigurationEntity));

        // When
        String result = Common.getConfigValue(key, configurationRepository, "default_value");

        // Then
        assertThat(result).isEqualTo("test_value");
        verify(configurationRepository).findByConfigCode(key);
    }

    @Test
    @DisplayName("Should return default value when config not found by string key")
    void getConfigValue_ByString_NotFound() {
        // Given
        String key = "MISSING_CONFIG";
        String defaultValue = "default_value";
        when(configurationRepository.findByConfigCode(key))
                .thenReturn(Optional.empty());

        // When
        String result = Common.getConfigValue(key, configurationRepository, defaultValue);

        // Then
        assertThat(result).isEqualTo(defaultValue);
        verify(configurationRepository).findByConfigCode(key);
    }

    @Test
    @DisplayName("Should convert string to long successfully")
    void convertStringToLong_Success() {
        // Given
        String stringValue = "123456789";

        // When
        long result = Common.convertStringToLong(stringValue);

        // Then
        assertThat(result).isEqualTo(123456789L);
    }

    @Test
    @DisplayName("Should throw BusinessException for invalid string to long conversion")
    void convertStringToLong_InvalidString() {
        // Given
        String invalidString = "not_a_number";

        // When & Then
        assertThatThrownBy(() -> Common.convertStringToLong(invalidString))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should throw BusinessException for null string to long conversion")
    void convertStringToLong_NullString() {
        // When & Then
        assertThatThrownBy(() -> Common.convertStringToLong(null))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should return non-authenticated URLs array")
    void getNonAuthenticatedUrls_Success() {
        // Given
        ConfigurationEntity urlsConfig = TestDataBuilder.createNonAuthenticatedUrlsConfig();
        when(configurationRepository.findByConfigCode("NON_AUTHENTICATED_REQUEST"))
                .thenReturn(Optional.of(urlsConfig));

        // When
        String[] result = Common.getNonAuthenticatedUrls(configurationRepository);

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result).contains("/The-Project/api/user/register", "/The-Project/api/user/login");
        verify(configurationRepository).findByConfigCode("NON_AUTHENTICATED_REQUEST");
    }

    @Test
    @DisplayName("Should return empty array when non-authenticated URLs config not found")
    void getNonAuthenticatedUrls_NotFound() {
        // Given
        when(configurationRepository.findByConfigCode("NON_AUTHENTICATED_REQUEST"))
                .thenReturn(Optional.empty());

        // When
        String[] result = Common.getNonAuthenticatedUrls(configurationRepository);

        // Then
        assertThat(result).isEmpty();
        verify(configurationRepository).findByConfigCode("NON_AUTHENTICATED_REQUEST");
    }

    @Test
    @DisplayName("Should return allowed CORS URLs array")
    void getAllowedCORSUrls_Success() {
        // Given
        ConfigurationEntity corsConfig = TestDataBuilder.createCorsUrlsConfig();
        when(configurationRepository.findByConfigCode("ALLOWED_CORS_URL_CONFIG"))
                .thenReturn(Optional.of(corsConfig));

        // When
        String[] result = Common.getAllowedCORSUrls(configurationRepository);

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result).contains("http://localhost:3000", "http://localhost:8080");
        verify(configurationRepository).findByConfigCode("ALLOWED_CORS_URL_CONFIG");
    }

    @Test
    @DisplayName("Should return empty array when CORS URLs config not found")
    void getAllowedCORSUrls_NotFound() {
        // Given
        when(configurationRepository.findByConfigCode("ALLOWED_CORS_URL_CONFIG"))
                .thenReturn(Optional.empty());

        // When
        String[] result = Common.getAllowedCORSUrls(configurationRepository);

        // Then
        assertThat(result).isEmpty();
        verify(configurationRepository).findByConfigCode("ALLOWED_CORS_URL_CONFIG");
    }

    @Test
    @DisplayName("Should filter out non-HTTP URLs from CORS configuration")
    void getAllowedCORSUrls_FilterNonHttpUrls() {
        // Given
        ConfigurationEntity corsConfig = TestDataBuilder.createTestConfiguration(
                "ALLOWED_CORS_URL_CONFIG", 
                "http://localhost:3000,https://example.com,ftp://invalid.com,invalid-url"
        );
        when(configurationRepository.findByConfigCode("ALLOWED_CORS_URL_CONFIG"))
                .thenReturn(Optional.of(corsConfig));

        // When
        String[] result = Common.getAllowedCORSUrls(configurationRepository);

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).contains("http://localhost:3000", "https://example.com");
        assertThat(result).doesNotContain("ftp://invalid.com", "invalid-url");
    }

    @Test
    @DisplayName("Should handle complex URL configuration with brackets and whitespace")
    void testUrlConfigurationParsing() {
        // Given
        ConfigurationEntity complexConfig = TestDataBuilder.createTestConfiguration(
                "NON_AUTHENTICATED_REQUEST", 
                "{/api/public,\\n  /api/health\\n,/api/status}"
        );
        when(configurationRepository.findByConfigCode("NON_AUTHENTICATED_REQUEST"))
                .thenReturn(Optional.of(complexConfig));

        // When
        String[] result = Common.getNonAuthenticatedUrls(configurationRepository);

        // Then
        assertThat(result).contains("/api/public", "/api/health", "/api/status");
        assertThat(result).allMatch(url -> !url.contains("{") && !url.contains("}") && !url.contains("\\n"));
    }
}
