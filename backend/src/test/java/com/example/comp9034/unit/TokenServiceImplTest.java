package com.example.comp9034.unit;

import com.example.comp9034.config.TestDataBuilder;
import com.example.comp9034.entity.ConfigurationEntity;
import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.entity.User;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.impl.TokenServiceImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TokenServiceImpl.
 * Tests JWT token generation, validation, and refresh functionality.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TokenService Unit Tests")
class TokenServiceImplTest {

    @Mock
    private ConfigurationRepository configurationRepository;

    @Mock
    private ErrorCodeRepository errorCodeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TokenServiceImpl tokenService;

    private User testUser;
    private ConfigurationEntity secretKeyConfig;
    private ConfigurationEntity expirationTimeConfig;
    private ErrorCodeEntity tokenGenerateSuccessError;
    private ErrorCodeEntity tokenGenerateFailError;
    private ErrorCodeEntity tokenVerifySuccessError;
    private ErrorCodeEntity tokenVerifyFailError;
    private ErrorCodeEntity tokenExpiredError;
    private ErrorCodeEntity userNotFoundError;
    private ErrorCodeEntity internalServerError;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.createTestUser();
        secretKeyConfig = TestDataBuilder.createSecretKeyConfig();
        expirationTimeConfig = TestDataBuilder.createTokenExpirationConfig();
        
        tokenGenerateSuccessError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.TOKEN_GENERATE_SUCCESS, "TOKEN");
        tokenGenerateFailError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.TOKEN_GENERATE_FAIL, "TOKEN");
        tokenVerifySuccessError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.TOKEN_VERIFY_SUCCESS, "TOKEN");
        tokenVerifyFailError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.TOKEN_VERIFY_FAIL, "TOKEN");
        tokenExpiredError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.TOKEN_EXPIRE, "TOKEN");
        userNotFoundError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.USER_NOT_FOUND, "TOKEN");
        internalServerError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.INTERNAL_SERVER_ERROR, "COMMON");
    }

    @Test
    @DisplayName("Should generate access token successfully")
    void generateAccessToken_Success() {
        // Given
        String username = "testuser";
        when(configurationRepository.findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME"))
                .thenReturn(Optional.of(expirationTimeConfig));
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(userRepository.findByUsernameAndActive(username, true))
                .thenReturn(Optional.of(testUser));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_GENERATE_SUCCESS.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenGenerateSuccessError));

        // When
        CompleteResponse<Object> response = tokenService.generateAccessToken(username);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(200);
        assertThat(response.getResponseBody()).isNotNull();
        assertThat(response.getResponseBody().getBody()).isNotNull();
        assertThat(response.getResponseBody().getBody().toString()).isNotEmpty();

        verify(userRepository).findByUsernameAndActive(username, true);
        verify(configurationRepository).findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME");
        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_GENERATE_SUCCESS.name(), "TOKEN");
    }

    @Test
    @DisplayName("Should throw BusinessException when user not found during token generation")
    void generateAccessToken_UserNotFound() {
        // Given
        String username = "nonexistentuser";
        when(configurationRepository.findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME"))
                .thenReturn(Optional.of(expirationTimeConfig));
        when(userRepository.findByUsernameAndActive(username, true))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> tokenService.generateAccessToken(username))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.USER_NOT_FOUND);

        verify(userRepository).findByUsernameAndActive(username, true);
        verify(configurationRepository).findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME");
    }

    @Test
    @DisplayName("Should throw BusinessException when secret key is too short")
    void generateAccessToken_ShortSecretKey() {
        // Given
        String username = "testuser";
        ConfigurationEntity shortSecretConfig = TestDataBuilder.createTestConfiguration("SECRET_KEY_CONFIG", "short");
        
        when(configurationRepository.findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME"))
                .thenReturn(Optional.of(expirationTimeConfig));
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(shortSecretConfig));
        when(userRepository.findByUsernameAndActive(username, true))
                .thenReturn(Optional.of(testUser));

        // When & Then
        assertThatThrownBy(() -> tokenService.generateAccessToken(username))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.INTERNAL_SERVER_ERROR);

        verify(userRepository).findByUsernameAndActive(username, true);
        verify(configurationRepository).findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME");
        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
    }

    @Test
    @DisplayName("Should successfully generate token when config not found (using default value)")
    void generateAccessToken_ConfigNotFound_ShouldSucceed() {
        // Given
        String username = "testuser";
        when(configurationRepository.findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME"))
                .thenReturn(Optional.empty()); // Config not found - should gracefully use default
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(userRepository.findByUsernameAndActive(username, true))
                .thenReturn(Optional.of(testUser));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_GENERATE_SUCCESS.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenGenerateSuccessError));

        // When - This should succeed but will fail due to production bug
        CompleteResponse<Object> response = tokenService.generateAccessToken(username);

        // Then - Expected behavior: graceful fallback to default expiration time
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(200);
        assertThat(response.getResponseBody()).isNotNull();
        assertThat(response.getResponseBody().getBody()).isNotNull();
        assertThat(response.getResponseBody().getBody().toString()).isNotEmpty();

        verify(configurationRepository).findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME");
        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
        verify(userRepository).findByUsernameAndActive(username, true);
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_GENERATE_SUCCESS.name(), "TOKEN");
    }

    @Test
    @DisplayName("Should throw INTERNAL_SERVER_ERROR when token expiration config contains invalid data")
    void generateAccessToken_InvalidExpirationConfig() {
        // Given
        String username = "testuser";
        ConfigurationEntity invalidConfig = new ConfigurationEntity();
        invalidConfig.setConfigCode("ACCESS_TOKEN_EXPIRATION_TIME");
        invalidConfig.setConfigValue("not_a_number"); // Invalid numeric string from database
        
        when(configurationRepository.findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME"))
                .thenReturn(Optional.of(invalidConfig)); // Return config with invalid value

        // When & Then
        // This is LEGITIMATE error handling - database contains corrupted data
        assertThatThrownBy(() -> tokenService.generateAccessToken(username))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.INTERNAL_SERVER_ERROR)
                .hasNoCause(); // BusinessException doesn't preserve original NumberFormatException

        verify(configurationRepository).findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME");
    }

    @Test
    @DisplayName("Should validate access token successfully")
    void validateAccessToken_Success() {
        // Given
        String validToken = createValidTestToken();
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(userRepository.findByUsernameAndActive("testuser", true))
                .thenReturn(Optional.of(testUser));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_VERIFY_SUCCESS.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenVerifySuccessError));

        // When
        CompleteResponse<Object> response = tokenService.validateAccessToken(validToken);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(200);
        assertThat(response.getResponseBody().getBody()).isInstanceOf(Claims.class);

        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
        verify(userRepository).findByUsernameAndActive("testuser", true);
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_VERIFY_SUCCESS.name(), "TOKEN");
    }

    @Test
    @DisplayName("Should return user not found when validating token for non-existent user")
    void validateAccessToken_UserNotFound() {
        // Given
        String validToken = createValidTestToken();
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(userRepository.findByUsernameAndActive("testuser", true))
                .thenReturn(Optional.empty());
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.USER_NOT_FOUND.name(), "TOKEN"))
                .thenReturn(Optional.of(userNotFoundError));

        // When
        CompleteResponse<Object> response = tokenService.validateAccessToken(validToken);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(404);
        assertThat(response.getResponseBody().getBody()).isEqualTo("Test description for USER_NOT_FOUND");

        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
        verify(userRepository).findByUsernameAndActive("testuser", true);
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_NOT_FOUND.name(), "TOKEN");
    }

    @Test
    @DisplayName("Should return token verification fail for invalid token")
    void validateAccessToken_InvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_VERIFY_FAIL.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenVerifyFailError));

        // When
        CompleteResponse<Object> response = tokenService.validateAccessToken(invalidToken);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(401);
        assertThat(response.getResponseBody().getBody()).isEqualTo("Test description for TOKEN_VERIFY_FAIL");

        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_VERIFY_FAIL.name(), "TOKEN");
    }

    @Test
    @DisplayName("Should return token expired for expired token")
    void validateAccessToken_ExpiredToken() {
        // Given
        String expiredToken = createExpiredTestToken();
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_EXPIRE.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenExpiredError));

        // When
        CompleteResponse<Object> response = tokenService.validateAccessToken(expiredToken);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(401);
        assertThat(response.getResponseBody().getBody()).isEqualTo("Test description for TOKEN_EXPIRE");

        verify(configurationRepository).findByConfigCode("SECRET_KEY_CONFIG");
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_EXPIRE.name(), "TOKEN");
    }

    @Test
    @DisplayName("Should refresh access token successfully")
    void refreshAccessToken_Success() {
        // Given
        String authHeader = "Bearer old-token";
        String sessionToken = "session-token";
        String userName = "testuser";
        
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getCredentials()).thenReturn("testuser");
        
        when(configurationRepository.findByConfigCode("ACCESS_TOKEN_EXPIRATION_TIME"))
                .thenReturn(Optional.of(expirationTimeConfig));
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(userRepository.findByUsernameAndActive("testuser", true))
                .thenReturn(Optional.of(testUser));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_GENERATE_SUCCESS.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenGenerateSuccessError));

        // When
        CompleteResponse<Object> response = tokenService.refreshAccessToken(authHeader, sessionToken, userName);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(200);
        assertThat(response.getResponseBody().getBody()).isNotNull();

        verify(securityContext).getAuthentication();
        verify(authentication).getCredentials();
    }

    @Test
    @DisplayName("Should handle null or empty parameters gracefully")
    void testMethodsWithNullParameters() {
        // Test generateAccessToken with null username
        assertThatThrownBy(() -> tokenService.generateAccessToken(null))
                .isInstanceOf(BusinessException.class);

        // Test validateAccessToken with null token
        when(configurationRepository.findByConfigCode("SECRET_KEY_CONFIG"))
                .thenReturn(Optional.of(secretKeyConfig));
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.TOKEN_VERIFY_FAIL.name(), "TOKEN"))
                .thenReturn(Optional.of(tokenVerifyFailError));

        CompleteResponse<Object> response = tokenService.validateAccessToken(null);
        assertThat(response.getHttpCode()).isEqualTo(401);
    }

    private String createValidTestToken() {
        SecretKey key = Keys.hmacShaKeyFor(TestDataBuilder.createTestJwtSecret().getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 300000))
                .signWith(key)
                .compact();
    }

    private String createExpiredTestToken() {
        SecretKey key = Keys.hmacShaKeyFor(TestDataBuilder.createTestJwtSecret().getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 600000))
                .setExpiration(new Date(System.currentTimeMillis() - 300000))
                .signWith(key)
                .compact();
    }
}
