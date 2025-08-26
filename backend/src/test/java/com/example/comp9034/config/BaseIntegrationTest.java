package com.example.comp9034.config;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

/**
 * Base class for integration tests providing common configuration.
 * Sets up Spring Boot test context with H2 database and test profile.
 */
@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
@Sql(scripts = "classpath:data-test.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(scripts = "classpath:cleanup-test.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
@Transactional
@AutoConfigureMockMvc
public abstract class BaseIntegrationTest {
    
    /**
     * Common setup that can be inherited by integration test classes.
     * Override this method to add specific test setup logic.
     */
    protected void setUp() {
        // Common setup logic for integration tests
    }
    
    /**
     * Common teardown that can be inherited by integration test classes.
     * Override this method to add specific test cleanup logic.
     */
    protected void tearDown() {
        // Common cleanup logic for integration tests
    }
}
