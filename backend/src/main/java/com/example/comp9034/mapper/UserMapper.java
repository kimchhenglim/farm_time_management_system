package com.example.comp9034.mapper;

import com.example.comp9034.dto.UpdateUserDTO;
import com.example.comp9034.dto.UserDTO;
import com.example.comp9034.entity.UserEntity;

import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    //Entity to UserDTO
//    @Mapping(source = "userId", target = "userId")
//    UserDTO toUserDTO(UserEntity user);

 //   List<UserDTO> toUserDTOList(List<UserEntity> users);

//    // DTO -> Entity (update only non-null fields)
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void updateEntityFromDto(UpdateUserDTO dto, @MappingTarget UserEntity entity);
}
