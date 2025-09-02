package com.example.comp9034.security;

import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.service.impl.TokenServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.Claims;
import lombok.NonNull;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.comp9034.enums.CommonEnum.TOKEN;
import static com.example.comp9034.enums.ErrorCodeEnum.*;
import static com.example.comp9034.response_template.CompleteResponse.getCompleteResponse;
import static com.example.comp9034.util.Common.getNonAuthenticatedUrls;

@Log4j2
@Component
@Profile("!test")  // Exclude this filter when test profile is active
public class TokenFilter extends OncePerRequestFilter {

    private final TokenServiceImpl tokenServiceImpl;
    private final ConfigurationRepository configurationRepository;
    private final ErrorCodeRepository errorCodeRepository;
    private static final String ROLES_CLAIM = "roles";

    public TokenFilter(TokenServiceImpl tokenServiceImpl, ConfigurationRepository configurationRepository, ErrorCodeRepository errorCodeRepository) {
        this.tokenServiceImpl = tokenServiceImpl;
        this.configurationRepository = configurationRepository;
        this.errorCodeRepository = errorCodeRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Skip token validation for non-required-authenticated URLs
        if (isNonAuthenticatedRequest(request)) {
            log.info("Skipping token validation for public URL: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }
        // Token validation for required-authenticated URLs
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            CompleteResponse<Object> validateTokenResponse = tokenServiceImpl.validateAccessToken(token);
            String responseCode = validateTokenResponse.getResponseBody().getCode();
            try {
                if (responseCode.equals(TOKEN_VERIFY_SUCCESS.getCode())) {
                    handleSuccessfulTokenValidation(request, response, filterChain, validateTokenResponse);
                } else {
                    log.warn("Token validation failed for reason: {}", responseCode);
                    handleFailTokenValidation(responseCode);
                }
            } catch (BusinessException e) {
                log.error("Business exception occurred: {}", e.getMessage(), e);
                handleBusinessException(response, e);
            } catch (Exception e) {
                log.error("There has been an error in {}!", this.getClass(), e);
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private boolean isNonAuthenticatedRequest(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        String normalizedURI = requestURI.replaceFirst("^/The-Project", "").replaceAll("^/+", "").replaceAll("/+$", "");

        return Arrays.stream(getNonAuthenticatedUrls(configurationRepository))
                .map(p -> p.trim().replaceAll("^/+", "").replaceAll("/+$", ""))
                .anyMatch(pattern -> matchesUrlPattern(pattern, normalizedURI));
    }

    private boolean matchesUrlPattern(String pattern, String requestURI) {
        String normalizedPattern = pattern.trim().replaceAll("^/+", "").replaceAll("/+$", "");
        String normalizedURI = requestURI.trim().replaceFirst("^/The-Project", "").replaceAll("^/+", "").replaceAll("/+$", "");

        if (normalizedPattern.contains("**")) {
            return normalizedURI.matches(normalizedPattern.replace("**", ".*"));
        }
        return normalizedPattern.equals(normalizedURI);
    }

    private void handleSuccessfulTokenValidation(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, CompleteResponse<Object> validateTokenResponse)
            throws ServletException, IOException {
        // Populate SecurityContext with authenticated user
        Claims claims = (Claims) validateTokenResponse.getResponseBody().getBody();
        String userName = claims.getSubject();
        // Validate session token globally (fallback mechanism)
        // All checks passed => populate SecurityContext
        // Extract the roles stored as Strings (authorities) from the claims
        List<GrantedAuthority> authorities = ((List<?>) claims.get(ROLES_CLAIM)).stream()
                .map(role -> new SimpleGrantedAuthority((String) role))
                .collect(Collectors.toList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userName, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);  // Allow the request to proceed
    }

    private void handleFailTokenValidation(String responseCode) {
        if (responseCode.equals(USER_NOT_FOUND.getCode())) {
            String message = "No user found as " + SecurityContextHolder.getContext().getAuthentication().getCredentials();
            log.error(message);
            throw new BusinessException(USER_NOT_FOUND, TOKEN.name(), message);
        } else if (responseCode.equals(TOKEN_EXPIRE.getCode())) {
            String message = "Token expires!";
            log.error(message);
            throw new BusinessException(TOKEN_EXPIRE, TOKEN.name(), message);
        } else {
            String message = "Token verification failed!";
            log.error(message);
            throw new BusinessException(TOKEN_VERIFY_FAIL, TOKEN.name(), message);
        }
    }

    private void handleBusinessException(HttpServletResponse response, BusinessException ex) throws IOException {
        CompleteResponse<Object> result = getCompleteResponse(errorCodeRepository, ex.getErrorCodeEnum(), ex.getFlow(), null);
        response.setStatus(HttpStatusCode.valueOf(result.getHttpCode()).value());
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(result.getResponseBody()));
    }
}

