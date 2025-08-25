package com.example.comp9034.mapper;

import org.mapstruct.factory.Mappers;

import com.example.comp9034.dto.UpdateUserDTO;
import com.example.comp9034.entity.StaffEntity;
import com.example.comp9034.entity.UserEntity;

public class UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    public static UpdateUserDTO toUpdateUserDTO(UserEntity user, StaffEntity staff) {
        if (user == null && staff == null) return null;

        UpdateUserDTO dto = new UpdateUserDTO();

        if (user != null) {
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setGender(user.getGender());
            dto.setEmail(user.getEmail());
            dto.setMobileNumber(user.getMobileNumber());
            dto.setAddress(user.getAddress());
        }

        if (staff != null) {
            dto.setCardId(staff.getCardId());
            dto.setContractType(staff.getContractType());
            dto.setPayRate(staff.getPayRate());
            dto.setTask(staff.getTask());
            dto.setIsActive(staff.getIsActive());
        }

        return dto;
    }

    public static void updateEntitiesFromDto(UpdateUserDTO dto, UserEntity user, StaffEntity staff) {
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getMobileNumber() != null) user.setMobileNumber(dto.getMobileNumber());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());

        if (dto.getCardId() != null) staff.setCardId(dto.getCardId());
        if (dto.getContractType() != null) staff.setContractType(dto.getContractType());
        if (dto.getPayRate() != null) staff.setPayRate(dto.getPayRate());
        if (dto.getTask() != null) staff.setTask(dto.getTask());
        if (dto.getIsActive() != null) staff.setIsActive(dto.getIsActive());
    }
}
