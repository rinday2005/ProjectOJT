package org.example.userservice.repository;

import org.example.userservice.entity.UserAppeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserAppealRepository extends JpaRepository<UserAppeal, Long> {
    List<UserAppeal> findAllByOrderByCreatedAtDesc();
}
