package com.example.comp9034.integration;

import com.example.comp9034.config.BaseIntegrationTest;
import com.example.comp9034.config.TestDataBuilder;
import com.example.comp9034.config.TestSecurityConfig;
import com.example.comp9034.dto.CreateUserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.CoreMatchers.nullValue;

/**
 * Integration tests for UserControllerImpl.
 * Tests full HTTP request/response cycle with real database interactions.
 */
@DisplayName("UserController Integration Tests")
@Import(TestSecurityConfig.class)
public class UserControllerImplIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /public/api/users/register - Should successfully create new user")
    void createNewUser_Success() throws Exception {
        // Given
        CreateUserDTO newUser = TestDataBuilder.createTestUserDTO();
        newUser.setUsername("newuser123");
        newUser.setEmail("newuser@test.com");
        newUser.setPhoneNumber("+1234567999");

        // When & Then
        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E000"))
                .andExpect(jsonPath("$.message").value("User created"))
                .andExpect(jsonPath("$.body").value(nullValue()));
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with duplicate username")
    void createNewUser_DuplicateUsername() throws Exception {
        // Given - testuser already exists in data-test.sql
        CreateUserDTO duplicateUser = TestDataBuilder.createTestUserDTO();
        duplicateUser.setUsername("testuser"); // Already exists
        duplicateUser.setEmail("different@email.com");
        duplicateUser.setPhoneNumber("+9999999999");

        // When & Then - Should detect duplicate username and return appropriate error
        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateUser)))
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").exists())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with invalid email format")
    void createNewUser_InvalidEmail() throws Exception {
        // Given
        CreateUserDTO invalidUser = TestDataBuilder.createTestUserDTO();
        invalidUser.setEmail("invalid-email-format"); // Invalid email

        // When & Then
        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E001"))
                .andExpect(jsonPath("$.message").value("Invalid input provided"));
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with missing required fields")
    void createNewUser_MissingRequiredFields() throws Exception {
        // Given
        CreateUserDTO incompleteUser = new CreateUserDTO("testuser123", null); // Missing password
        // Missing email, password, etc.

        // When & Then
        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(incompleteUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E001"))
                .andExpect(jsonPath("$.message").value("Invalid input provided"));
    }

    @Test
    @DisplayName("POST /public/api/users/register/admin - Should successfully create admin user")
    void createNewUserAdmin_Success() throws Exception {
        // Given
        CreateUserDTO adminUser = TestDataBuilder.createTestUserDTO();
        adminUser.setUsername("adminuser123");
        adminUser.setEmail("admin@test.com");
        adminUser.setPhoneNumber("+1234567888");

        // When & Then
        mockMvc.perform(post("/public/api/users/register/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminUser)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E000"))
                .andExpect(jsonPath("$.message").value("User created"))
                .andExpect(jsonPath("$.body").value(nullValue()));
    }

    @Test
    @DisplayName("GET /public/api/users/get/user - Should find existing user")
    void checkUserExisted_UserExists() throws Exception {
        // Given - testuser exists in data-test.sql

        // When & Then
        mockMvc.perform(get("/public/api/users/get/user")
                        .param("userInput", "testuser"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E000"))
                .andExpect(jsonPath("$.message").value("Search info successfully"))
                .andExpect(jsonPath("$.body").value(nullValue()));
    }

    @Test
    @DisplayName("GET /public/api/users/get/user - Should handle non-existent user")
    void checkUserExisted_UserNotFound() throws Exception {
        // Given
        String nonExistentUser = "nonexistentuser123";

        // When & Then
        mockMvc.perform(get("/public/api/users/get/user")
                        .param("userInput", nonExistentUser))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E005"))
                .andExpect(jsonPath("$.message").value("User not found"));
    }

    @Test
    @DisplayName("GET /public/api/users/get/user - Should fail with missing userInput parameter")
    void checkUserExisted_MissingParameter() throws Exception {
        // When & Then
        mockMvc.perform(get("/public/api/users/get/user"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E001"))
                .andExpect(jsonPath("$.message").value("Invalid input provided"));
    }

    @Test
    @DisplayName("GET /public/api/users/get/user - Should find user by email")
    void checkUserExisted_FindByEmail() throws Exception {
        // Given - test@example.com exists in data-test.sql

        // When & Then
        mockMvc.perform(get("/public/api/users/get/user")
                        .param("userInput", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E000"))
                .andExpect(jsonPath("$.message").value("Search info successfully"))
                .andExpect(jsonPath("$.body").value(nullValue()));
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with malformed JSON")
    void createNewUser_MalformedJson() throws Exception {
        // Given
        String malformedJson = "{ \"username\": \"test\", \"email\": }"; // Invalid JSON

        // When & Then
        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with duplicate email")
    void createNewUser_DuplicateEmail() throws Exception {
        CreateUserDTO duplicateEmailUser = TestDataBuilder.createTestUserDTO();
        duplicateEmailUser.setUsername("unique_user_123");
        duplicateEmailUser.setEmail("test@example.com"); // existing in seed data
        duplicateEmailUser.setPhoneNumber("+9999999998");

        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateEmailUser)))
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").exists())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with duplicate phone number")
    void createNewUser_DuplicatePhone() throws Exception {
        CreateUserDTO duplicatePhoneUser = TestDataBuilder.createTestUserDTO();
        duplicatePhoneUser.setUsername("unique_user_456");
        duplicatePhoneUser.setEmail("unique_email_456@test.com");
        duplicatePhoneUser.setPhoneNumber("+1234567890"); // existing in seed data

        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicatePhoneUser)))
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").exists())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail with invalid DOB format")
    void createNewUser_InvalidDobFormat() throws Exception {
        CreateUserDTO invalidDobUser = TestDataBuilder.createTestUserDTO();
        invalidDobUser.setDob("1990-01-01"); // invalid against DD/MM/YYYY

        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDobUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E001"))
                .andExpect(jsonPath("$.message").value("Invalid input provided"));
    }

    @Test
    @DisplayName("POST /public/api/users/register - Should fail when phone exceeds max length")
    void createNewUser_InvalidPhoneTooLong() throws Exception {
        CreateUserDTO invalidPhoneUser = TestDataBuilder.createTestUserDTO();
        invalidPhoneUser.setPhoneNumber("+12345678901234567890"); // > 15 chars

        mockMvc.perform(post("/public/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPhoneUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.code").value("E001"))
                .andExpect(jsonPath("$.message").value("Invalid input provided"));
    }

}
