package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona, Long> {

    Optional<Persona> findByUserIdAndBoardScope(Long userId, String boardScope);
}
