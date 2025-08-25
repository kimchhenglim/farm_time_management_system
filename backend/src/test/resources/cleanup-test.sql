-- Test data cleanup script
-- This script is executed after each test method to ensure clean state

-- Clean up test data in reverse order of dependencies
DELETE FROM users WHERE username IN ('testuser', 'oauth2user', 'inactiveuser');
DELETE FROM configurations WHERE config_code IN (
    'ACCESS_TOKEN_EXPIRATION_TIME', 
    'SECRET_KEY_CONFIG', 
    'NON_AUTHENTICATED_REQUEST', 
    'ALLOWED_CORS_URL_CONFIG'
);
DELETE FROM error_codes WHERE error_enum IN (
    'USER_CREATED', 'USER_NOT_FOUND', 'SEARCH_INFO_SUCCESS', 'INTERNAL_SERVER_ERROR',
    'TOKEN_GENERATE_SUCCESS', 'TOKEN_GENERATE_FAIL', 'TOKEN_VERIFY_SUCCESS', 
    'TOKEN_VERIFY_FAIL', 'TOKEN_EXPIRE', 'INVALID_INPUT', 
    'UNDEFINED_ERROR_CODE', 'UNDEFINED_HTTP_CODE', 'CONFIG_NOT_FOUND'
);
