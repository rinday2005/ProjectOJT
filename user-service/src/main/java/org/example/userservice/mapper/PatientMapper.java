package org.example.userservice.mapper;

import org.example.userservice.dto.request.PatientRequest;
import org.example.userservice.dto.response.PatientDto;
import org.example.userservice.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PatientMapper {

    @Mapping(source = "family.id", target = "familyId")
    @Mapping(source = "family.fullName", target = "familyName")
    @Mapping(source = "name", target = "fullName")
    @Mapping(source = "dob", target = "dateOfBirth")
    @Mapping(source = "medicalHistory", target = "medicalConditions")
    PatientDto toDto(Patient patient);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "family", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "name", expression = "java(request.getResolvedName())")
    @Mapping(target = "dob", expression = "java(request.getResolvedDob())")
    @Mapping(target = "medicalHistory", expression = "java(request.getResolvedMedicalHistory())")
    Patient toEntity(PatientRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "family", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "currentCondition", ignore = true)
    @Mapping(target = "name", expression = "java(request.getResolvedName())")
    @Mapping(target = "dob", expression = "java(request.getResolvedDob())")
    @Mapping(target = "medicalHistory", expression = "java(request.getResolvedMedicalHistory())")
    void updateEntityFromRequest(PatientRequest request, @MappingTarget Patient patient);
}
