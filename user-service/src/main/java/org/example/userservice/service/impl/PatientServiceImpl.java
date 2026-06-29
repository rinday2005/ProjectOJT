package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.dto.request.PatientRequest;
import org.example.userservice.dto.response.PatientDto;
import org.example.userservice.entity.Patient;
import org.example.userservice.entity.User;
import org.example.userservice.exception.PatientNotFoundException;
import org.example.userservice.exception.UserNotFoundException;
import org.example.userservice.mapper.PatientMapper;
import org.example.userservice.repository.PatientRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.PatientService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientMapper patientMapper;

    @Override
    @Transactional
    public PatientDto createPatient(String keycloakId, PatientRequest request) {
        User requester = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new UserNotFoundException("Không tìm thấy người dùng với Keycloak ID: " + keycloakId));

        User familyOwner;
        if ("FAMILY".equalsIgnoreCase(requester.getRole())) {
            familyOwner = requester;
        } else if ("ADMIN".equalsIgnoreCase(requester.getRole()) || "OPERATOR".equalsIgnoreCase(requester.getRole())) {
            if (request.familyId() == null) {
                throw new IllegalArgumentException("familyId bắt buộc phải có khi nhân viên tạo hồ sơ bệnh nhân!");
            }
            familyOwner = userRepository.findById(request.familyId())
                    .orElseThrow(() -> new UserNotFoundException(
                            "Không tìm thấy tài khoản gia đình sở hữu với ID: " + request.familyId()));
            if (!"FAMILY".equalsIgnoreCase(familyOwner.getRole())) {
                throw new IllegalArgumentException("Tài khoản sở hữu được chỉ định phải có vai trò FAMILY!");
            }
        } else {
            throw new AccessDeniedException("Bạn không có quyền tạo hồ sơ bệnh nhân!");
        }

        Patient patient = patientMapper.toEntity(request);
        patient.setFamily(familyOwner);

        Patient saved = patientRepository.save(patient);
        log.info("Requester {} created patient profile with ID: {} for family {}", requester.getEmail(), saved.getId(),
                familyOwner.getEmail());
        return patientMapper.toDto(saved);
    }

    @Override
    @Transactional
    public PatientDto updatePatient(String keycloakId, Long id, PatientRequest request) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new UserNotFoundException("Không tìm thấy người dùng với Keycloak ID: " + keycloakId));

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Không tìm thấy bệnh nhân với ID: " + id));

        // Ownership validation for FAMILY
        if ("FAMILY".equalsIgnoreCase(user.getRole())) {
            if (patient.getFamily() == null || !patient.getFamily().getId().equals(user.getId())) {
                throw new AccessDeniedException("Bạn không có quyền sửa đổi hồ sơ bệnh nhân của gia đình khác!");
            }
            // Family updates everything EXCEPT status and currentCondition
            patientMapper.updateEntityFromRequest(request, patient);
        } else if ("OPERATOR".equalsIgnoreCase(user.getRole()) || "ADMIN".equalsIgnoreCase(user.getRole())) {
            // Operator/Admin updates the patient info
            patientMapper.updateEntityFromRequest(request, patient);
            if (request.status() != null) {
                patient.setStatus(request.status());
            }
            if (request.currentCondition() != null) {
                patient.setCurrentCondition(request.currentCondition());
            }
        } else {
            throw new AccessDeniedException("Vai trò của bạn không được phép sửa đổi hồ sơ bệnh nhân!");
        }

        Patient updated = patientRepository.save(patient);
        log.info("User {} updated patient profile ID: {}", user.getEmail(), updated.getId());
        return patientMapper.toDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientDto getPatientById(String keycloakId, Long id) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new UserNotFoundException("Không tìm thấy người dùng với Keycloak ID: " + keycloakId));

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Không tìm thấy bệnh nhân với ID: " + id));

        // Ownership validation for FAMILY
        if ("FAMILY".equalsIgnoreCase(user.getRole())) {
            if (patient.getFamily() == null || !patient.getFamily().getId().equals(user.getId())) {
                throw new AccessDeniedException("Bạn không có quyền xem hồ sơ bệnh nhân của gia đình khác!");
            }
        }

        return patientMapper.toDto(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientDto> getPatients(String keycloakId, String name, String status, String currentCondition,
            Long familyId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new UserNotFoundException("Không tìm thấy người dùng với Keycloak ID: " + keycloakId));

        List<Patient> patients;

        if ("FAMILY".equalsIgnoreCase(user.getRole())) {
            // Family can only see their own patients
            patients = patientRepository.findByFamilyKeycloakId(keycloakId);
        } else if ("OPERATOR".equalsIgnoreCase(user.getRole()) || "ADMIN".equalsIgnoreCase(user.getRole())) {
            // Operator/Admin can search across all patients with optional filters
            patients = patientRepository.searchPatients(familyId, name, status, currentCondition);
        } else {
            throw new AccessDeniedException("Vai trò của bạn không được phép truy xuất danh sách bệnh nhân!");
        }

        return patients.stream()
                .map(patientMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePatient(String keycloakId, Long id) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(
                        () -> new UserNotFoundException("Không tìm thấy người dùng với Keycloak ID: " + keycloakId));

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Không tìm thấy bệnh nhân với ID: " + id));

        // Ownership validation for FAMILY
        if ("FAMILY".equalsIgnoreCase(user.getRole())) {
            if (patient.getFamily() == null || !patient.getFamily().getId().equals(user.getId())) {
                throw new AccessDeniedException("Bạn không có quyền xóa hồ sơ bệnh nhân của gia đình khác!");
            }
        } else if ("OPERATOR".equalsIgnoreCase(user.getRole())) {
            throw new AccessDeniedException("Nhân viên vận hành (OPERATOR) không có quyền xóa hồ sơ bệnh nhân!");
        } else if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new AccessDeniedException("Bạn không có quyền xóa hồ sơ bệnh nhân!");
        }

        patientRepository.delete(patient);
        log.info("User {} deleted patient profile ID: {}", user.getEmail(), id);
    }
}
