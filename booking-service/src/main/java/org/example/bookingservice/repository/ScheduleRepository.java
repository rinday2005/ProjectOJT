package org.example.bookingservice.repository;

import org.example.bookingservice.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s WHERE s.careRequest.caregiverId = :caregiverId AND s.workDate = :workDate")
    List<Schedule> findByCaregiverIdAndWorkDate(@Param("caregiverId") Long caregiverId,
            @Param("workDate") LocalDate workDate);
}
