package com.example.comp9034.util;
import com.example.comp9034.entity.ConfigurationEntity;
import com.example.comp9034.entity.ErrorCodeEntity;
import com.example.comp9034.enums.CommonEnum;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.enums.HttpStatusCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ConfigurationRepository;
import lombok.extern.log4j.Log4j2;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;


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
            String message = "There is an error extracting http code for {}" + errorCode;
            log.error(message);
            throw new BusinessException(UNDEFINED_HTTP_CODE, COMMON.name(), message);
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
            String message = "There is an error extracting error code for {}!" + errorCodeEntity.getErrorEnum();
            log.error(message);
            throw new BusinessException(UNDEFINED_ERROR_CODE, COMMON.name(), message);
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
            String message = "There is an error extracting error code message for " + errorCodeEntity.getErrorEnum();
            log.error(message);
            throw new BusinessException(UNDEFINED_ERROR_CODE, COMMON.name(), message);
        }
    }

    public static String getConfigValue(CommonEnum commonEnum, ConfigurationRepository configurationRepository, String flow) {
        return configurationRepository.findByConfigCode(commonEnum.name())
                .map(ConfigurationEntity::getConfigValue)
                .orElseGet(() -> {
                    String message = "There is no config value for " + commonEnum.name();
                    log.error(message);
                    throw new BusinessException(CONFIG_NOT_FOUND, flow, message);
                });
    }

    public static String getConfigValue(String key, ConfigurationRepository configurationRepository, String defaultValue) {
        return configurationRepository.findByConfigCode(key)
                .map(ConfigurationEntity::getConfigValue)
                .orElseGet(() -> {
                    log.error("There is no config value for {} ---> Getting default value {}!", key, defaultValue);
                    return defaultValue;
                });
    }

    public static long convertStringToLong(String string) {
        try {
            return Long.parseLong(string);
        } catch (NumberFormatException e) {
            String message = "There is an error converting the string to a long" + e;
            log.error(message);
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name(), message);
        }
    }

    public static String[] getNonAuthenticatedUrls(ConfigurationRepository configurationRepository) {
        Optional<ConfigurationEntity> nonAuthenRequestUrlOptional = configurationRepository.findByConfigCode(NON_AUTHENTICATED_REQUEST.name());
        if (nonAuthenRequestUrlOptional.isPresent()) {
            // Clean and split the configuration value to get individual URLs
            String[] nonAuthenticatedUrls = nonAuthenRequestUrlOptional.get().getConfigValue()
                    .replaceAll("[{}]", "") // Remove curly braces
                    .split(","); // Split by commas to get individual URLs
            // Clean up each URL in the array (remove newlines, trim spaces)
            return Arrays.stream(nonAuthenticatedUrls)
                    .map(url -> url.replace("\\n", "").trim()) // Remove newline characters and trim spaces
                    .toArray(String[]::new);
        } else {
            log.warn("There is no config for {}", NON_AUTHENTICATED_REQUEST);
            return new String[0];
        }
    }

    public static String[] getAllowedCORSUrls(ConfigurationRepository configurationRepository) {
        Optional<ConfigurationEntity> getAllowedCORSUrlsOptional = configurationRepository.findByConfigCode(ALLOWED_CORS_URL_CONFIG.name());
        if (getAllowedCORSUrlsOptional.isPresent()) {
            String[] getAllowedCORSUrls = getAllowedCORSUrlsOptional.get().getConfigValue()
                    .replaceAll("[{}]", "") // Remove curly braces
                    .split(","); // Split by commas to get individual URLs
            return Arrays.stream(getAllowedCORSUrls)
                    .map(url -> url.replace("\\n", "").trim())
                    .filter(url -> url.startsWith("http"))
                    .toArray(String[]::new);
        } else {
            log.warn("There is no config for {}", ALLOWED_CORS_URL_CONFIG);
            return new String[0];
        }
    }
}
