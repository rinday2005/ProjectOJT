package org.example.userservice.service;

import org.example.userservice.dto.request.UserProfileRequest;
import org.example.userservice.dto.response.UserDto;
import org.example.userservice.dto.response.PatientDto;
import org.example.userservice.dto.response.DashboardStatsResponse;
import org.example.userservice.dto.response.RecentActivityResponse;

import java.util.List;

public interface UserService {
    UserDto getProfileByKeycloakId(String keycloakId);
    UserDto updateProfile(String keycloakId, UserProfileRequest request);
    UserDto updateAvatar(String keycloakId, String avatarData);
    List<PatientDto> getPatientsByKeycloakId(String keycloakId);


    // Administrative CRUD operations
    UserDto createUser(UserDto userDto);
    UserDto updateUser(Long id, UserDto userDto);
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers();
    void deleteUser(Long id);
    UserDto toggleUserStatus(Long id, boolean active);
    DashboardStatsResponse getDashboardStats();
    List<RecentActivityResponse> getRecentActivities(int limit);
}
