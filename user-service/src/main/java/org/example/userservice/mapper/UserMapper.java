package org.example.userservice.mapper;

import org.example.userservice.dto.response.UserDto;
import org.example.userservice.dto.request.UserProfileRequest;
import org.example.userservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserDto toDto(User user);

    User toEntity(UserDto dto);

    void updateEntityFromRequest(UserProfileRequest request, @MappingTarget User user);
}
