package com.example.comp9034.mapper;

import com.example.comp9034.dto.UpdateUserDTO;
import com.example.comp9034.dto.UserDTO;
import com.example.comp9034.entity.UserEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DataMapper {
    //Entity to UserDTO
//    @Mapping(target = "role", expression = "java(helper.mapRoleToString(user.getRole()))")
//    @Mapping(target = "gender", expression = "java(helper.mapGenderToString(user.getGender()))")
    UserDTO toUserDTO(UserEntity user, @Context UserDataMapperHelper helper);

    // DTO -> Entity (update only non-null fields)
//    @Mapping(target = "role", expression = "java(helper.mapRole(dto.getRole()))")
//    @Mapping(target = "gender", expression = "java(helper.mapGender(dto.getGender()))")
    @Mapping(target = "authorities", ignore = true)
    void updateUserEntityFromDto(UpdateUserDTO dto, @MappingTarget UserEntity entity, @Context UserDataMapperHelper helper);
}
