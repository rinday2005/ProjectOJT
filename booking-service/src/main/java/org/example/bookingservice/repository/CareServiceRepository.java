package org.example.bookingservice.repository;

import org.example.bookingservice.entity.CareService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareServiceRepository extends JpaRepository<CareService, Long> {
}
