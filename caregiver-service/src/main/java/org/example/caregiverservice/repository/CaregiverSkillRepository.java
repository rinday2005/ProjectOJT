package org.example.caregiverservice.repository;

import org.example.caregiverservice.entity.CaregiverSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaregiverSkillRepository extends JpaRepository<CaregiverSkill, Long> {
    List<CaregiverSkill> findByCaregiverId(Long caregiverId);

    void deleteByCaregiverId(Long caregiverId);
}
