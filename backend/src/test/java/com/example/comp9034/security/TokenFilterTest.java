package com.example.comp9034.security;

import com.example.comp9034.repository.ConfigurationRepository;
import com.example.comp9034.repository.ErrorCodeRepository;
import com.example.comp9034.response_template.CompleteResponse;
import com.example.comp9034.response_template.ResponseBody;
import com.example.comp9034.service.impl.TokenServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TokenFilter Unit Tests")
class TokenFilterTest {

    @Mock
    private TokenServiceImpl tokenServiceImpl;
    @Mock
    private ConfigurationRepository configurationRepository;
    @Mock
    private ErrorCodeRepository errorCodeRepository;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private TokenFilter tokenFilter;

    @Test
    @DisplayName("Should bypass filter for public endpoints")
    void bypassPublicEndpoints() throws Exception {
        when(request.getRequestURI()).thenReturn("/public/api/users/register");
        when(configurationRepository.findByConfigCode("NON_AUTHENTICATED_REQUEST")).thenReturn(java.util.Optional.of(
                com.example.comp9034.config.TestDataBuilder.createNonAuthenticatedUrlsConfig()
        ));

        tokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        verifyNoInteractions(tokenServiceImpl);
    }

    @Test
    @DisplayName("Should return 401 when Authorization header is missing for protected endpoints")
    void missingAuthorizationHeader() throws Exception {
        when(request.getRequestURI()).thenReturn("/protected/resource");
        when(request.getHeader("Authorization")).thenReturn(null);
        when(configurationRepository.findByConfigCode("NON_AUTHENTICATED_REQUEST")).thenReturn(java.util.Optional.of(
                com.example.comp9034.config.TestDataBuilder.createNonAuthenticatedUrlsConfig()
        ));

        tokenFilter.doFilterInternal(request, response, filterChain);

        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verifyNoInteractions(tokenServiceImpl);
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    @DisplayName("Should map invalid token to 401 with JSON body")
    void invalidTokenMapsTo401() throws Exception {
        when(request.getRequestURI()).thenReturn("/protected/resource");
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid");
        when(configurationRepository.findByConfigCode("NON_AUTHENTICATED_REQUEST")).thenReturn(java.util.Optional.of(
                com.example.comp9034.config.TestDataBuilder.createNonAuthenticatedUrlsConfig()
        ));

        // Simulate token service returning TOKEN_VERIFY_FAIL
        ResponseBody<Object> body = new ResponseBody<>("E015", "Token verify fail", "TOKEN", "Test description for TOKEN_VERIFY_FAIL");
        CompleteResponse<Object> complete = new CompleteResponse<>(body, 401);
        when(tokenServiceImpl.validateAccessToken("invalid")).thenReturn(complete);

        tokenFilter.doFilterInternal(request, response, filterChain);

        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(filterChain, never()).doFilter(any(), any());
    }
}


