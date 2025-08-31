package com.example.comp9034.mapper;

import com.example.comp9034.entity.RoleEntity;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.enums.UserEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import static com.example.comp9034.enums.CommonEnum.COMMON;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class UserDataMapperHelper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final RoleRepository roleRepository;

    @Named("mapRole")
    public RoleEntity mapRole(String role) {
        if (role == null) return null;
        return roleRepository.findByName(role.toUpperCase())
                .orElseThrow(() -> new BusinessException(ErrorCodeEnum.INVALID_USER_ROLE, COMMON.name()));
    }


    @Named("mapRoleToString")
    public String mapRoleToString(RoleEntity role) {
        return role != null ? role.getName() : null;
    }

    @Named("mapGender")
    public UserEnum mapGender(String gender) {
        if (gender == null) return null;
        return UserEnum.valueOf(gender.toUpperCase());
    }

    @Named("mapGenderToString")
    // Convert UserEnum -> String for DTO
    public String mapGenderToString(UserEnum gender) {
        return gender != null ? gender.name() : null;
    }

    @Named("stringToLocalDate")
    public static LocalDate stringToLocalDate(String date) {
        return (date == null || date.isBlank()) ? null : LocalDate.parse(date, FORMATTER);
    }

    @Named("localDateToString")
    public static String localDateToString(LocalDate date) {
        return (date == null) ? null : date.format(FORMATTER);
    }
}
