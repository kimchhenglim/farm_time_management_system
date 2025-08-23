package com.example.comp9034.service.impl;

import com.example.comp9034.entity.User;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.repository.UserRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.TokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

import static com.example.comp9034.enums.CommonEnum.*;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;
import static com.example.comp9034.util.Common.convertStringToLong;
import static com.example.comp9034.util.Common.getConfigValue;


@Log4j2
@Service
public class TokenServiceImpl implements TokenService {
    private final ConfigurationRepository configurationRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private final UserRepository userRepository;

    public TokenServiceImpl(ConfigurationRepository configurationRepository, ErrorCodeRepository errorCodeRepository, UserRepository userRepository) {
        this.configurationRepository = configurationRepository;
        this.errorCodeRepository = errorCodeRepository;
        this.userRepository = userRepository;
    }

    // Generate a Bearer Token based on the username
    public CompleteResponse<Object> generateAccessToken(String username) {
        try {
            log.info("Start generating access token!");
            long expirationTime = convertStringToLong(getConfigValue(ACCESS_TOKEN_EXPIRATION_TIME.name(), configurationRepository, "300000L"));
//            User user = userRepository.findByUsernameAndActive(username, true).orElseGet(() -> {
//                log.error("There is user as {}", username);
//                throw new BusinessException(USER_NOT_FOUND, COMMON.name());
//            });
            String token = Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(new Date())
                    /*.claim("roles", user.getAuthorities())*/
                    .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                    .signWith(getSecretKey()) // Specify the signing algorithm
                    .compact();
            ErrorCodeEnum errorCodeEnum = Optional.of(token).filter(t -> !t.isEmpty()) // Check if token is not empty
                    .map(t -> TOKEN_GENERATE_SUCCESS).orElseGet(() -> {
                        log.error("There is an error generating access token!");
                        return TOKEN_GENERATE_FAIL;
                    });
            return getCompleteResponse(errorCodeRepository, errorCodeEnum, TOKEN.name(), token);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Jwt token generated failed!");
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name());
        }
    }

    @Override
    public CompleteResponse<Object> refreshAccessToken(String authorizationHeader, String sessionTokenHeader, String userName) {
        log.info("Start refreshing token!");
        String username = SecurityContextHolder.getContext().getAuthentication().getCredentials().toString();
        return generateAccessToken(username);
    }

    // Validate the token and extract the phone number
    public CompleteResponse<Object> validateAccessToken(String accessToken) {
        log.info("Start validating access token!");
        String username;
        Claims claims;
        Optional<User> userOptional;
        try {
            claims = Jwts.parserBuilder().setSigningKey(getSecretKey()).build().parseClaimsJws(accessToken) // This validates the token
                    .getBody();
            username = claims.getSubject();
            // Validate if the token's user exists
            log.info("Start checking if user {} is registered!", username);
//            userOptional = userRepository.findByUsernameAndActive(username, true);
//            if (userOptional.isEmpty()) {
//                log.error("There is no user as {}", username);
//                return getCompleteResponse(errorCodeRepository, USER_NOT_FOUND, TOKEN.name(), null);
//            }
            log.info("The token is valid for user {}", username);
            return getCompleteResponse(errorCodeRepository, TOKEN_VERIFY_SUCCESS, TOKEN.name(), claims);
        } catch (ExpiredJwtException e) {
            log.error("Access token expires!");
            return getCompleteResponse(errorCodeRepository, TOKEN_EXPIRE, TOKEN.name(), null);
        } catch (Exception e) {
            log.error("There is an error in validating access token!");
            return getCompleteResponse(errorCodeRepository, TOKEN_VERIFY_FAIL, TOKEN.name(), null);
        }
    }

    // Method to get the SECRET key dynamically
    private SecretKey getSecretKey() {
        String secret = getConfigValue(SECRET_KEY_CONFIG, configurationRepository, TOKEN.name());
        // Ensure the key is at least 256 bits for HS512
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            log.error("Secret key must be at least 256 bits (32 bytes) for HS512!");
            throw new BusinessException(INTERNAL_SERVER_ERROR, COMMON.name());
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
