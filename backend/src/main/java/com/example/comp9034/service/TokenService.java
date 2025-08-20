package com.example.comp9034.service;


import com.example.comp9034.response_template.CompleteResponse;

public interface TokenService {
    CompleteResponse<Object> generateAccessToken(String userName);

    CompleteResponse<Object> refreshAccessToken(String authorizationHeader, String sessionToken, String userName);


}
