package org.example.bookingservice.repository;

import org.example.bookingservice.entity.CareRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareRequestRepository extends JpaRepository<CareRequest, Long> {
    List<CareRequest> findByFamilyId(Long familyId);

    List<CareRequest> findByStatus(String status);
}
