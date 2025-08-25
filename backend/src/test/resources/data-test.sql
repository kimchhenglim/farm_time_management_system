-- Test data setup script
-- This script is executed before each test method

-- Insert test error codes
INSERT INTO error_codes (error_enum, error_code, error_message, http_code) VALUES
('USER_CREATED', 'USR_001', 'User created successfully', 201),
('USER_NOT_FOUND', 'USR_404', 'User not found', 404),
('SEARCH_INFO_SUCCESS', 'SRC_200', 'Search completed successfully', 200),
('INTERNAL_SERVER_ERROR', 'SRV_500', 'Internal server error', 500),
('TOKEN_GENERATE_SUCCESS', 'TKN_201', 'Token generated successfully', 201),
('TOKEN_GENERATE_FAIL', 'TKN_400', 'Token generation failed', 400),
('TOKEN_VERIFY_SUCCESS', 'TKN_200', 'Token verified successfully', 200),
('TOKEN_VERIFY_FAIL', 'TKN_401', 'Token verification failed', 401),
('TOKEN_EXPIRE', 'TKN_401', 'Token has expired', 401),
('INVALID_INPUT', 'VAL_400', 'Invalid input provided', 400),
('UNDEFINED_ERROR_CODE', 'UND_500', 'Undefined error code', 500),
('UNDEFINED_HTTP_CODE', 'UND_500', 'Undefined HTTP code', 500),
('CONFIG_NOT_FOUND', 'CFG_404', 'Configuration not found', 404);

-- Insert test configuration data
INSERT INTO configurations (config_code, config_value) VALUES
('ACCESS_TOKEN_EXPIRATION_TIME', '300000'),
('SECRET_KEY_CONFIG', 'testSecretKeyThatIsAtLeast256BitsLongForHS512AlgorithmTesting123456789'),
('NON_AUTHENTICATED_REQUEST', '/The-Project/api/user/register,/The-Project/api/user/login,/h2-console/**'),
('ALLOWED_CORS_URL_CONFIG', 'http://localhost:3000,http://localhost:8080');

-- Insert test users
INSERT INTO users (username, password, email, dob, created_date, phone_num, is_active, is_OAuth2) VALUES
('testuser', '$2a$10$DowJonesIsCool', 'test@example.com', '1990-01-01', CURRENT_DATE, '+1234567890', true, false),
('oauth2user', '$2a$10$DowJonesIsCool', 'oauth2@example.com', '1990-01-01', CURRENT_DATE, '+1234567891', true, true),
('inactiveuser', '$2a$10$DowJonesIsCool', 'inactive@example.com', '1990-01-01', CURRENT_DATE, '+1234567892', false, false);
