package org.example.caregiverservice.repository;

import org.example.caregiverservice.dto.response.ReviewStats;
import org.example.caregiverservice.entity.CaregiverReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaregiverReviewRepository extends JpaRepository<CaregiverReview, Long> {

    @Query("SELECT new org.example.caregiverservice.dto.response.ReviewStats(r.caregiver.id, COALESCE(AVG(r.rating), 0.0), COUNT(r)) FROM CaregiverReview r GROUP BY r.caregiver.id")
    List<ReviewStats> getAverageRatingAndCountForAllCaregivers();

    @Query("SELECT new org.example.caregiverservice.dto.response.ReviewStats(r.caregiver.id, COALESCE(AVG(r.rating), 0.0), COUNT(r)) FROM CaregiverReview r WHERE r.caregiver.id = :caregiverId GROUP BY r.caregiver.id")
    Optional<ReviewStats> getAverageRatingAndCountByCaregiverId(@Param("caregiverId") Long caregiverId);
}
