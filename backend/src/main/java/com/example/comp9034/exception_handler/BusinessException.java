package com.example.comp9034.exception_handler;

import com.example.comp9034.enums.ErrorCodeEnum;
import lombok.Getter;

import java.io.Serial;

@Getter
public class BusinessException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    private final ErrorCodeEnum errorCodeEnum;
    private final String flow;
    private final Object object;

    public BusinessException(ErrorCodeEnum errorCodeEnum, String flow, Object object) {
        this.errorCodeEnum = errorCodeEnum;
        this.flow = flow;
        this.object = object;
    }
}
