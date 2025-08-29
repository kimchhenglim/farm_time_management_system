package com.example.comp9034.mapper;

import com.example.comp9034.entity.RoleEntity;
import com.example.comp9034.enums.ErrorCodeEnum;
import com.example.comp9034.enums.UserEnum;
import com.example.comp9034.exception_handler.BusinessException;
import com.example.comp9034.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import static com.example.comp9034.enums.CommonEnum.COMMON;

@Component
@RequiredArgsConstructor
public class UserDataMapperHelper {

    private final RoleRepository roleRepository;

    public RoleEntity mapRole(String role) {
        if (role == null) return null;
        return roleRepository.findByName(role.toUpperCase())
                .orElseThrow(() -> new BusinessException(ErrorCodeEnum.INVALID_USER_ROLE, COMMON.name()));
    }

    public String mapRoleToString(RoleEntity role) {
        return role != null ? role.getName() : null;
    }

    public UserEnum mapGender(String gender) {
        if (gender == null) return null;
        return UserEnum.valueOf(gender.toUpperCase());
    }

    // Convert UserEnum -> String for DTO
    public String mapGenderToString(UserEnum gender) {
        return gender != null ? gender.name() : null;
    }
}
