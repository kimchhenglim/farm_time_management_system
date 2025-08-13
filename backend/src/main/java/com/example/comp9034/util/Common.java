package com.example.comp9034.util;

import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.enums.HttpStatusCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import lombok.extern.log4j.Log4j2;

import java.util.Optional;

import static com.example.comp9034.enums.CommonEnum.COMMON;
import static com.example.comp9034.enums.ErrorCodeEnum.UNDEFINED_ERROR_CODE;
import static com.example.comp9034.enums.ErrorCodeEnum.UNDEFINED_HTTP_CODE;


@Log4j2
public class Common {
    private Common() {
    }

    public static HttpStatusCodeEnum getHttpFromErrorCode(String errorCode) {
        if (errorCode.isEmpty()) {
            log.info("Error code is null, returning undefined HTTP status code.");
            return UNDEFINED_ERROR_CODE.getHttpStatusCodeEnum();
        }
        try {
            // Map the HTTP code using the ErrorCode object
            HttpStatusCodeEnum httpStatusCode = HttpStatusCodeEnum.resolve(ErrorCodeEnum.valueOf(errorCode).getHttpStatusCodeEnum().value);
            return Optional.ofNullable(httpStatusCode)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "No matching constant for [" + httpStatusCode + "]"
                            )
                    );
        } catch (IllegalArgumentException e) {
            // Log and return default if mapping fails
            log.error("There is an error extracting http code for {}",
                    errorCode);
            throw new BusinessException(UNDEFINED_HTTP_CODE, COMMON.name());
        }
    }

    public static String getErrorCode(ErrorCodeEntity errorCodeEntity) {
        if (errorCodeEntity == null) {
            log.info("Error code is null, returning undefined error code.");
            return UNDEFINED_ERROR_CODE.getCode();
        }
        try {
            return errorCodeEntity.getErrorCode();
        } catch (IllegalArgumentException e) {
            log.error("There is an error extracting error code for {}!",
                    errorCodeEntity.getErrorEnum());
            throw new BusinessException(UNDEFINED_ERROR_CODE, COMMON.name());
        }
    }

    public static String getErrorCodeMessage(ErrorCodeEntity errorCodeEntity) {
        if (errorCodeEntity == null) {
            log.info("Error code message is null, returning undefined error code message.");
            return UNDEFINED_ERROR_CODE.getMessage();
        }
        try {
            return errorCodeEntity.getErrorMessage();
        } catch (IllegalArgumentException e) {
            log.error("There is an error extracting error code message for {}",
                    errorCodeEntity.getErrorEnum());
            throw new BusinessException(UNDEFINED_ERROR_CODE, COMMON.name());
        }
    }
}
