package com.example.comp9034.mapper;

import com.example.comp9034.dto.UpdateUserDTO;
import com.example.comp9034.dto.UserDTO;
import com.example.comp9034.entity.UserEntity;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {UserDataMapperHelper.class} // so MapStruct can use your helper methods
)
public interface DataMapper {

    // DTO -> Entity
    @Mapping(target = "dob", source = "dob", qualifiedByName = "stringToLocalDate")
    @Mapping(target = "gender", source = "gender", qualifiedByName = "mapGender")
    @Mapping(target = "role", source = "role", qualifiedByName = "mapRole")
    UserEntity toUserEntity(UpdateUserDTO dto);

    // Update fields of an existing entity from DTO (only non-null values will be copied)
    @Mapping(target = "dob", source = "dob", qualifiedByName = "stringToLocalDate")
    @Mapping(target = "gender", expression = "java(dto.getGender() != null ? userDataMapperHelper.mapGender(dto.getGender()) : entity.getGender())")
    @Mapping(target = "role", expression = "java(dto.getRole() != null ? userDataMapperHelper.mapRole(dto.getRole()) : entity.getRole())")
    void updateEntityFromDto(UpdateUserDTO dto, @MappingTarget UserEntity entity);

    // Single entity → DTO
    @Mapping(target = "gender", source = "gender", qualifiedByName = "mapGenderToString")
    @Mapping(target = "role", source = "role", qualifiedByName = "mapRoleToString")
    @Mapping(target = "contractType", source = "contractType")
    UserDTO toUserDto(UserEntity entity);

    // List of entities → List of DTOs
    List<UserDTO> toUserDtoList(List<UserEntity> entities);
}
