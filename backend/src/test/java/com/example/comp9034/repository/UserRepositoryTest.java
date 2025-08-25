package com.example.comp9034.repository;

import com.example.comp9034.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Sql(scripts = "classpath:data-test.sql")
@Sql(scripts = "classpath:cleanup-test.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
@DisplayName("UserRepository @DataJpaTest")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("findByUsernameAndActive should find active user and not find inactive")
    void findByUsernameAndActive_username() {
        Optional<User> active = userRepository.findByUsernameAndActive("testuser", true);
        Optional<User> inactive = userRepository.findByUsernameAndActive("inactiveuser", true);

        assertThat(active).isPresent();
        assertThat(inactive).isEmpty();
    }

    @Test
    @DisplayName("findByEmailAndActive should respect active flag")
    void findByEmailAndActive_email() {
        Optional<User> active = userRepository.findByEmailAndActive("test@example.com", true);
        Optional<User> inactive = userRepository.findByEmailAndActive("inactive@example.com", true);

        assertThat(active).isPresent();
        assertThat(inactive).isEmpty();
    }

    @Test
    @DisplayName("findByPhoneNumberAndActive should respect active flag")
    void findByPhoneNumberAndActive_phone() {
        Optional<User> active = userRepository.findByPhoneNumberAndActive("+1234567890", true);
        Optional<User> inactive = userRepository.findByPhoneNumberAndActive("+1234567892", true);

        assertThat(active).isPresent();
        assertThat(inactive).isEmpty();
    }
}


