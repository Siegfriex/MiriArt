package com.miriart.api.domain.event.repository;

import com.miriart.api.domain.event.entity.UserCohort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCohortRepository extends JpaRepository<UserCohort, Long> {

    Optional<UserCohort> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
