package org.example.userservice.repository;

import org.example.userservice.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {

    List<Patient> findByFamilyKeycloakId(String keycloakId);

    @Query("SELECT p FROM Patient p WHERE " +
            "(:familyId IS NULL OR p.family.id = :familyId) AND " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) AND " +
            "(:status IS NULL OR LOWER(p.status) = LOWER(CAST(:status AS string))) AND " +
            "(:currentCondition IS NULL OR LOWER(p.currentCondition) LIKE LOWER(CONCAT('%', CAST(:currentCondition AS string), '%')))")
    List<Patient> searchPatients(
            @Param("familyId") Long familyId,
            @Param("name") String name,
            @Param("status") String status,
            @Param("currentCondition") String currentCondition);
}
