package com.example.comp9034.unit;

import com.example.comp9034.config.TestDataBuilder;
import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.exception_handler.GlobalExceptionHandler;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.response_template.ResponseBody;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for GlobalExceptionHandler.
 * Tests exception mapping to HTTP responses and error message formatting.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("GlobalExceptionHandler Unit Tests")
class GlobalExceptionHandlerTest {

    @Mock
    private ErrorCodeRepository errorCodeRepository;

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    private ErrorCodeEntity userNotFoundError;
    private ErrorCodeEntity invalidInputError;
    private ErrorCodeEntity internalServerError;

    @BeforeEach
    void setUp() {
        userNotFoundError = TestDataBuilder.createTestErrorCode(ErrorCodeEnum.USER_NOT_FOUND);
        invalidInputError = TestDataBuilder.createTestErrorCode(ErrorCodeEnum.INVALID_INPUT);
        internalServerError = TestDataBuilder.createTestErrorCode(ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Should handle BusinessException correctly")
    void handleBusinessExceptions_Success() {
        // Given
        BusinessException exception = new BusinessException(ErrorCodeEnum.USER_NOT_FOUND, "TEST_FLOW");
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.USER_NOT_FOUND.name(), "TEST_FLOW"))
                .thenReturn(Optional.of(userNotFoundError));

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleBusinessExceptions(exception);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getCode()).isEqualTo("E005");
        assertThat(response.getBody().getMessage()).isEqualTo("User not found");

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_NOT_FOUND.name(), "TEST_FLOW");
        verifyNoMoreInteractions(errorCodeRepository);
    }

    @Test
    @DisplayName("Should handle BusinessException with different error codes")
    void handleBusinessExceptions_DifferentErrorCodes() {
        // Given
        BusinessException exception = new BusinessException(ErrorCodeEnum.INTERNAL_SERVER_ERROR, "REGISTER");
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.INTERNAL_SERVER_ERROR.name(), "REGISTER"))
                .thenReturn(Optional.of(internalServerError));

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleBusinessExceptions(exception);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getCode()).isEqualTo("E017");
        assertThat(response.getBody().getMessage()).isEqualTo("Internal server error");

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.INTERNAL_SERVER_ERROR.name(), "REGISTER");
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException with validation errors")
    void handleMethodValidationExceptions_WithValidationErrors() throws Exception {
        // Given
        MethodArgumentNotValidException exception = createMethodArgumentNotValidException();
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.INVALID_INPUT.name(), "COMMON"))
                .thenReturn(Optional.of(invalidInputError));

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleMethodValidationExceptions(exception);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getCode()).isEqualTo("E001");
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid input provided");
        assertThat(response.getBody().getBody()).isEqualTo("Test validation error message");

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.INVALID_INPUT.name(), "COMMON");
    }

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException without binding errors")
    void handleMethodValidationExceptions_NoBindingErrors() throws Exception {
        // Given
        MethodArgumentNotValidException exception = createMethodArgumentNotValidExceptionWithoutErrors();

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleMethodValidationExceptions(exception);

        // Then
        assertThat(response).isNull();
        verifyNoInteractions(errorCodeRepository);
    }

    @Test
    @DisplayName("Should handle multiple validation errors and return first one")
    void handleMethodValidationExceptions_MultipleErrors() throws Exception {
        // Given
        MethodArgumentNotValidException exception = createMethodArgumentNotValidExceptionWithMultipleErrors();
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.INVALID_INPUT.name(), "COMMON"))
                .thenReturn(Optional.of(invalidInputError));

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleMethodValidationExceptions(exception);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getBody()).isEqualTo("First validation error");

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.INVALID_INPUT.name(), "COMMON");
    }

    @Test
    @DisplayName("Should handle BusinessException when error code entity not found")
    void handleBusinessExceptions_ErrorCodeEntityNotFound() {
        // Given
        BusinessException exception = new BusinessException(ErrorCodeEnum.USER_NOT_FOUND, "TEST_FLOW");
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.USER_NOT_FOUND.name(), "TEST_FLOW"))
                .thenReturn(Optional.empty());

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleBusinessExceptions(exception);

        // Then
        assertThat(response).isNotNull();
        // Should still create response even if error code entity not found
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.USER_NOT_FOUND.name(), "TEST_FLOW");
    }

    @Test
    @DisplayName("Should handle validation exception when error code entity not found")
    void handleMethodValidationExceptions_ErrorCodeEntityNotFound() throws Exception {
        // Given
        MethodArgumentNotValidException exception = createMethodArgumentNotValidException();
        when(errorCodeRepository.findByErrorEnumAndFlow(ErrorCodeEnum.INVALID_INPUT.name(), "COMMON"))
                .thenReturn(Optional.empty());

        // When
        ResponseEntity<ResponseBody<Object>> response = globalExceptionHandler.handleMethodValidationExceptions(exception);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        verify(errorCodeRepository).findByErrorEnumAndFlow(ErrorCodeEnum.INVALID_INPUT.name(), "COMMON");
    }

    private MethodArgumentNotValidException createMethodArgumentNotValidException() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "testObject");
        FieldError fieldError = new FieldError("testObject", "testField", "Test validation error message");
        bindingResult.addError(fieldError);
        
        return new MethodArgumentNotValidException(methodParameter, bindingResult);
    }

    private MethodArgumentNotValidException createMethodArgumentNotValidExceptionWithoutErrors() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "testObject");
        
        return new MethodArgumentNotValidException(methodParameter, bindingResult);
    }

    private MethodArgumentNotValidException createMethodArgumentNotValidExceptionWithMultipleErrors() throws Exception {
        MethodParameter methodParameter = mock(MethodParameter.class);
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "testObject");
        
        FieldError firstError = new FieldError("testObject", "field1", "First validation error");
        FieldError secondError = new FieldError("testObject", "field2", "Second validation error");
        
        bindingResult.addError(firstError);
        bindingResult.addError(secondError);
        
        return new MethodArgumentNotValidException(methodParameter, bindingResult);
    }
}
