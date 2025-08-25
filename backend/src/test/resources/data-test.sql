-- Test data setup script
-- This script is executed before each test method

-- Insert test error codes (removed non-existent http_code column)
INSERT INTO error_codes (error_enum, error_code, error_message) VALUES
('USER_CREATED', 'E000', 'User created'),
('USER_NOT_FOUND', 'E005', 'User not found'),
('SEARCH_INFO_SUCCESS', 'E000', 'Search info successfully'),
('INTERNAL_SERVER_ERROR', 'E017', 'Internal server error'),
('TOKEN_GENERATE_SUCCESS', 'E000', 'Token generate successfully'),
('TOKEN_GENERATE_FAIL', 'E014', 'Token generate fail'),
('TOKEN_VERIFY_SUCCESS', 'E000', 'Token verified successfully'),
('TOKEN_VERIFY_FAIL', 'E015', 'Token verify fail'),
('TOKEN_EXPIRE', 'E016', 'Token expires'),
('INVALID_INPUT', 'E001', 'Invalid input provided'),
('UNDEFINED_ERROR_CODE', 'E008', 'Undefined error code'),
('UNDEFINED_HTTP_CODE', 'E009', 'Undefined http status code'),
('CONFIG_NOT_FOUND', 'E018', 'Config not found');

-- Insert test configuration data (fixed table name and added required config_message field)
INSERT INTO configuration (config_code, config_value, config_message) VALUES
('ACCESS_TOKEN_EXPIRATION_TIME', '300000', 'Token expiration time in milliseconds'),
('SECRET_KEY_CONFIG', 'testSecretKeyThatIsAtLeast256BitsLongForHS512AlgorithmTesting123456789', 'JWT secret key for token signing'),
('NON_AUTHENTICATED_REQUEST', '/The-Project/api/user/register,/The-Project/api/user/login,/h2-console/**', 'URLs that do not require authentication'),
('ALLOWED_CORS_URL_CONFIG', 'http://localhost:3000,http://localhost:8080', 'Allowed CORS origins for cross-origin requests');

-- Insert test users
INSERT INTO users (username, password, email, dob, created_date, phone_num, is_active, is_OAuth2) VALUES
('testuser', '$2a$10$DowJonesIsCool', 'test@example.com', '1990-01-01', CURRENT_DATE, '+1234567890', true, false),
('oauth2user', '$2a$10$DowJonesIsCool', 'oauth2@example.com', '1990-01-01', CURRENT_DATE, '+1234567891', true, true),
('inactiveuser', '$2a$10$DowJonesIsCool', 'inactive@example.com', '1990-01-01', CURRENT_DATE, '+1234567892', false, false);
