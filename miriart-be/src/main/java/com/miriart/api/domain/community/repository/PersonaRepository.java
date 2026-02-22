package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 가명(페르소나) JPA 리포지토리. 사용자+보드 스코프별 단건 조회(동일 스코프면 동일 가명).
 *
 * <p>연계: 게시글/답변 작성 시 가명 결정, 목록 노출 시 displayName 사용.</p>
 *
 * @author MiriArt Team
 */
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    Optional<Persona> findByUserIdAndBoardScope(Long userId, String boardScope);
}
