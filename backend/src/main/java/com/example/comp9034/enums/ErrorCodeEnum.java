package com.example.comp9034.enums;

import lombok.Getter;
import lombok.extern.log4j.Log4j2;

import static com.example.comp9034.enums.CommonEnum.*;

@Log4j2
@Getter
public enum ErrorCodeEnum {
    USER_CREATED("E000", "User created", REGISTER, HttpStatusCodeEnum.CREATED),
    LOGIN_SUCCESS("E000", "Log in successfully", LOGIN, HttpStatusCodeEnum.OK),
    LOGOUT_SUCCESS("E000", "Log out successfully", LOGOUT, HttpStatusCodeEnum.OK),
    TOKEN_GENERATE_SUCCESS("E000", "Token generate successfully", TOKEN, HttpStatusCodeEnum.OK),
    TOKEN_RETRIEVE_SUCCESS("E000", "Token retrieved successfully", TOKEN, HttpStatusCodeEnum.OK),
    TOKEN_VERIFY_SUCCESS("E000", "Token verified successfully", TOKEN, HttpStatusCodeEnum.OK),
    OTP_VERIFICATION_SUCCESS("E000", "OTP code verification successfully", OTP, HttpStatusCodeEnum.OK),
    OTP_CREATED_SUCCESS("E000", "Otp created successfully", OTP, HttpStatusCodeEnum.CREATED),
    OTP_SENT_SUCCESS("E000", "Otp sent successfully", OTP, HttpStatusCodeEnum.OK),
    SMS_SENT_SUCCESS("E000", "Sms sent successfully", SMS, HttpStatusCodeEnum.OK),
    EMAIL_SENT_SUCCESS("E000", "Email sent successfully", EMAIL, HttpStatusCodeEnum.OK),
    USER_DETAILS_VERIFIED("E000", "Users details pass the verification", REGISTER, HttpStatusCodeEnum.OK),
    PASSWORD_UPDATED_SUCCESS("E000", "New password updated successfully", REGISTER, HttpStatusCodeEnum.OK),
    SEARCH_INFO_SUCCESS("E000", "Search info successfully", COMMON, HttpStatusCodeEnum.OK),
    UPDATE_USER_SUCCESS("E000", "User updated successfully", COMMON, HttpStatusCodeEnum.OK),
    CREATE_ROSTER_SUCCESS("E000", "Roster created successfully", ROSTER, HttpStatusCodeEnum.OK),
    DELETE_ROSTER_SUCCESS("E000", "Roster deleted successfully", ROSTER, HttpStatusCodeEnum.OK),

    INVALID_INPUT("E001", "Invalid input provided", COMMON, HttpStatusCodeEnum.BAD_REQUEST),
    USERNAME_TAKEN("E002", "Username taken", REGISTER, HttpStatusCodeEnum.CONFLICT),
    EMAIL_TAKEN("E003", "Email taken", REGISTER, HttpStatusCodeEnum.CONFLICT),
    PASSWORD_NOT_QUALIFIED("E004", "Password not qualified", REGISTER, HttpStatusCodeEnum.BAD_REQUEST),
    USER_NOT_FOUND("E005", "User not found", COMMON, HttpStatusCodeEnum.NOT_FOUND),
    CLIENT_SERVER_ERROR("E006", "Client internal server error", COMMON, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    PASSWORD_NOT_CORRECT("E007", "Password not correct", LOGIN, HttpStatusCodeEnum.UNAUTHORIZED),
    UNDEFINED_ERROR_CODE("E008", "Undefined error code", COMMON, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    UNDEFINED_HTTP_CODE("E009", "Undefined http status code", COMMON, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    EMAIL_PATTERN_INVALID("E010", "Email form is invalid", REGISTER, HttpStatusCodeEnum.BAD_REQUEST),
    PHONE_FORMAT_INVALID("E011", "Phone format is invalid", REGISTER, HttpStatusCodeEnum.BAD_REQUEST),
    SMS_NOT_CONFIG("E012", "Sms config is not found", SMS, HttpStatusCodeEnum.NOT_FOUND),
    USERNAME_FORMAT_INVALID("E013", "Username format invalid", REGISTER, HttpStatusCodeEnum.BAD_REQUEST),
    TOKEN_GENERATE_FAIL("E014", "Token generate fail", TOKEN, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    TOKEN_VERIFY_FAIL("E015", "Token verify fail", TOKEN, HttpStatusCodeEnum.UNAUTHORIZED),
    TOKEN_EXPIRE("E016", "Token expires", TOKEN, HttpStatusCodeEnum.UNAUTHORIZED),
    INTERNAL_SERVER_ERROR("E017", "Internal server error", COMMON, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    CONFIG_NOT_FOUND("E018", "Config not found", COMMON, HttpStatusCodeEnum.NOT_FOUND),
    INPUT_FORMAT_INVALID("E019", "Input format invalid", COMMON, HttpStatusCodeEnum.BAD_REQUEST),
    OTP_VERIFICATION_FAIL("E020", "OTP code verification fail", COMMON, HttpStatusCodeEnum.UNAUTHORIZED),
    TOKEN_NOT_FOUND("E021", "Token not found", TOKEN, HttpStatusCodeEnum.NOT_FOUND),
    MAX_SESSIONS_REACHED("E022", "Max session reached", LOGIN, HttpStatusCodeEnum.TOO_MANY_REQUESTS),
    SESSION_TOKEN_INVALID("E023", "Token session invalid", TOKEN, HttpStatusCodeEnum.UNAUTHORIZED),
    SMS_SENT_FAIL("E024", "Sms sent failed", SMS, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    EMAIL_SENT_FAIL("E025", "Email sent failed", SMS, HttpStatusCodeEnum.INTERNAL_SERVER_ERROR),
    MAX_OTP_RETRY("E026", "Max OTP retry exceeded", OTP, HttpStatusCodeEnum.TOO_MANY_REQUESTS),
    VERIFICATION_OTP_EXPIRED("E027", "Verification OTP expired", OTP, HttpStatusCodeEnum.GONE),
    OTP_BLOCKED_OR_NOT_FOUND("E028", "OTP is currently blocked or not found", OTP, HttpStatusCodeEnum.NOT_FOUND),
    USER_EXISTED("E029", "User existed", COMMON, HttpStatusCodeEnum.CONFLICT),
    REFRESH_TOKEN_INVALID("E030", "Token refresh invalid", TOKEN, HttpStatusCodeEnum.UNAUTHORIZED),
    REFRESH_TOKEN_EXPIRED("E031", "Token refresh expired", TOKEN, HttpStatusCodeEnum.UNAUTHORIZED),
    INVALID_USER_ROLE("E032", "Invalid user role", COMMON, HttpStatusCodeEnum.BAD_REQUEST),
    WEEKLY_HOUR_LIMIT_EXCEEDED("E033", "Weekly hour exceeded", ROSTER, HttpStatusCodeEnum.BAD_REQUEST),
    ROSTER_IMMUTABLE("E034", "Past rosters cannot be changed", ROSTER, HttpStatusCodeEnum.BAD_REQUEST),
    SHIFT_ALREADY_CANCELED("E035", "Shift already cancelled", ROSTER, HttpStatusCodeEnum.BAD_REQUEST),
    ROSTER_NOT_FOUND("E036", "Roster not found!", ROSTER, HttpStatusCodeEnum.NOT_FOUND),
    ;


    private final String code;
    private final String message;
    private final CommonEnum flow;
    private final HttpStatusCodeEnum httpStatusCodeEnum;

    ErrorCodeEnum(String code, String message, CommonEnum flow, HttpStatusCodeEnum httpStatusCodeEnum) {
        this.code = code;
        this.message = message;
        this.flow = flow;
        this.httpStatusCodeEnum = httpStatusCodeEnum;
    }
}
