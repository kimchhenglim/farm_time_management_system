package com.example.comp9034.unit;

import com.example.comp9034.config.TestDataBuilder;
import com.example.comp9034.dto.CreateUserDTO;
import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserServiceImpl.
 * Tests business logic in isolation using mocked dependencies.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceImplTest {

    @Mock
    private ErrorCodeRepository errorCodeRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private CreateUserDTO testUserDTO;
    private ErrorCodeEntity userCreatedError;
    private ErrorCodeEntity searchSuccessError;
    private ErrorCodeEntity internalServerError;

    @BeforeEach
    void setUp() {
        testUserDTO = TestDataBuilder.createTestUserDTO();
        userCreatedError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.USER_CREATED, "REGISTER");
        searchSuccessError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS, "REGISTER");
        internalServerError = TestDataBuilder.createTestErrorCodeWithFlow(ErrorCodeEnum.INTERNAL_SERVER_ERROR, "REGISTER");
    }

    @Test
    @DisplayName("Should create new user successfully")
    void createNewUser_Success() {
        // Given
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER"))
                .thenReturn(Optional.of(userCreatedError));

        // When
        CompleteResponse<Object> response = userService.createNewUser(testUserDTO);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(201);
        assertThat(response.getResponseBody()).isNotNull();
        assertThat(response.getResponseBody().getCode()).isEqualTo(ErrorCodeEnum.USER_CREATED.getCode());

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER");
        verifyNoMoreInteractions(errorCodeRepository);
    }

    @Test
    @DisplayName("Should return default response when error code not found during user creation")
    void createNewUser_ErrorCodeNotFound() {
        // Given
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER"))
                .thenReturn(Optional.empty());
        when(errorCodeRepository.findFirstByErrorEnum(ErrorCodeEnum.USER_CREATED.name()))
                .thenReturn(Optional.empty());

        // When
        CompleteResponse<Object> response = userService.createNewUser(testUserDTO);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(404); // CONFIG_NOT_FOUND

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER");
        verify(errorCodeRepository).findFirstByErrorEnum(ErrorCodeEnum.USER_CREATED.name());
    }

    @Test
    @DisplayName("Should handle repository exception during user creation")
    void createNewUser_RepositoryException() {
        // Given
        when(errorCodeRepository.findByErrorEnumAndFlow(any(String.class), any(String.class)))
                .thenThrow(new RuntimeException("Database connection failed"));

        // When & Then
        assertThatThrownBy(() -> userService.createNewUser(testUserDTO))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.INTERNAL_SERVER_ERROR)
                .hasFieldOrPropertyWithValue("flow", "REGISTER");

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER");
    }

    @Test
    @DisplayName("Should handle null user DTO")
    void createNewUser_NullUserDTO() {
        // Given
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER"))
                .thenReturn(Optional.of(userCreatedError));

        // When
        CompleteResponse<Object> response = userService.createNewUser(null);

        // Then
        assertThat(response).isNotNull();
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_CREATED.name(), "REGISTER");
    }

    @Test
    @DisplayName("Should return null for createNewUserAdmin (not implemented)")
    void createNewUserAdmin_NotImplemented() {
        // When
        CompleteResponse<Object> response = userService.createNewUserAdmin(testUserDTO);

        // Then
        assertThat(response).isNull();
        verifyNoInteractions(errorCodeRepository);
    }

    @Test
    @DisplayName("Should check user existence successfully")
    void checkUserExisted_Success() {
        // Given
        String userInput = "testuser";
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER"))
                .thenReturn(Optional.of(searchSuccessError));

        // When
        CompleteResponse<Object> response = userService.checkUserExisted(userInput);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(200);
        assertThat(response.getResponseBody()).isNotNull();
        assertThat(response.getResponseBody().getCode()).isEqualTo(ErrorCodeEnum.SEARCH_INFO_SUCCESS.getCode());

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER");
        verifyNoMoreInteractions(errorCodeRepository);
    }

    @Test
    @DisplayName("Should return default response when error code not found during user check")
    void checkUserExisted_ErrorCodeNotFound() {
        // Given
        String userInput = "testuser";
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER"))
                .thenReturn(Optional.empty());
        when(errorCodeRepository.findFirstByErrorEnum(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name()))
                .thenReturn(Optional.empty());

        // When
        CompleteResponse<Object> response = userService.checkUserExisted(userInput);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getHttpCode()).isEqualTo(404); // CONFIG_NOT_FOUND

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER");
        verify(errorCodeRepository).findFirstByErrorEnum(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name());
    }

    @Test
    @DisplayName("Should handle repository exception during user existence check")
    void checkUserExisted_RepositoryException() {
        // Given
        String userInput = "testuser";
        when(errorCodeRepository.findByErrorEnumAndFlow(any(String.class), any(String.class)))
                .thenThrow(new RuntimeException("Database connection failed"));

        // When & Then
        assertThatThrownBy(() -> userService.checkUserExisted(userInput))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.INTERNAL_SERVER_ERROR)
                .hasFieldOrPropertyWithValue("flow", "REGISTER");

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER");
    }

    @Test
    @DisplayName("Should handle null user input")
    void checkUserExisted_NullInput() {
        // Given
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER"))
                .thenReturn(Optional.of(searchSuccessError));

        // When
        CompleteResponse<Object> response = userService.checkUserExisted(null);

        // Then
        assertThat(response).isNotNull();
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER");
    }

    @Test
    @DisplayName("Should handle empty user input")
    void checkUserExisted_EmptyInput() {
        // Given
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER"))
                .thenReturn(Optional.of(searchSuccessError));

        // When
        CompleteResponse<Object> response = userService.checkUserExisted("");

        // Then
        assertThat(response).isNotNull();
        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.SEARCH_INFO_SUCCESS.name(), "REGISTER");
    }

    @Test
    @DisplayName("Should propagate BusinessException without wrapping")
    void createNewUser_BusinessExceptionPropagation() {
        // Given
        BusinessException originalException = new BusinessException(ErrorCodeEnum.USER_NOT_FOUND, "TEST");
        when(errorCodeRepository.findByErrorEnumAndFlow(any(String.class), any(String.class)))
                .thenThrow(originalException);

        // When & Then
        assertThatThrownBy(() -> userService.createNewUser(testUserDTO))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCodeEnum", ErrorCodeEnum.USER_NOT_FOUND);
    }
}
