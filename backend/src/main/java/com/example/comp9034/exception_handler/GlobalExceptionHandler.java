package com.example.comp9034.exception_handler;

import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Objects;

import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.INVALID_INPUT;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {
    private final ErrorCodeRepository errorCodeRepository;

    public GlobalExceptionHandler(ErrorCodeRepository errorCodeRepository) {
        this.errorCodeRepository = errorCodeRepository;
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ResponseBody<Object>> handleBusinessExceptions(BusinessException ex) {
        CompleteResponse<Object> result = getCompleteResponse(errorCodeRepository, ex.getErrorCodeEnum(), ex.getFlow(), ex.getObject());
        return new ResponseEntity<>(result.getResponseBody(), HttpStatusCode.valueOf(result.getHttpCode()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseBody<Object>> handleMethodValidationExceptions(MethodArgumentNotValidException ex) {
        if (ex.getBindingResult().hasErrors()) {
            String errorMessage = Objects.requireNonNull(ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
            CompleteResponse<Object> result = getCompleteResponse(errorCodeRepository, INVALID_INPUT, COMMON.name(), errorMessage);
            return new ResponseEntity<>(result.getResponseBody(), HttpStatusCode.valueOf(result.getHttpCode()));
        }
        return null;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseBody<Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Invalid request body: " + ex.getCause().getMessage();
        CompleteResponse<Object> result = getCompleteResponse(errorCodeRepository, INVALID_INPUT, COMMON.name(), message);
        return new ResponseEntity<>(result.getResponseBody(), HttpStatusCode.valueOf(result.getHttpCode()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ResponseBody<Object>> handleIllegalArgumentExceptions(IllegalArgumentException ex) {
        CompleteResponse<Object> result = getCompleteResponse(errorCodeRepository, INVALID_INPUT, COMMON.name(), ex.getMessage());
        return new ResponseEntity<>(result.getResponseBody(), HttpStatusCode.valueOf(result.getHttpCode()));
    }
}
