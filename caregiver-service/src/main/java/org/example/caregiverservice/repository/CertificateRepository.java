package org.example.caregiverservice.repository;

import org.example.caregiverservice.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByCaregiverId(Long caregiverId);
    void deleteByCaregiverId(Long caregiverId);
}
