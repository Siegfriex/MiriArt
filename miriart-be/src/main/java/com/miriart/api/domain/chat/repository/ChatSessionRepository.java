package com.miriart.api.domain.chat.repository;

import com.miriart.api.domain.chat.entity.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * 채팅 세션 JPA 리포지토리.
 *
 * <p>연계: {@link com.miriart.api.domain.chat.service.ChatSessionKeyResolver}에서 조회/생성,
 * {@link com.miriart.api.domain.chat.service.ChatSessionService}에서 목록 조회.</p>
 *
 * @author MiriArt Team
 */
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    Page<ChatSession> findByUserIdOrderByUpdatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT cs FROM ChatSession cs LEFT JOIN cs.analysis a " +
            "WHERE cs.user.id = :userId AND a.grade = :grade " +
            "ORDER BY cs.updatedAt DESC")
    Page<ChatSession> findByUserIdAndGrade(
            @Param("userId") Long userId,
            @Param("grade") com.miriart.api.domain.analysis.entity.AnalysisGrade grade,
            Pageable pageable);

    Optional<ChatSession> findByUserIdAndSessionKey(Long userId, String sessionKey);

    Optional<ChatSession> findByUserIdAndAnalysisId(Long userId, Long analysisId);

    long countByUserId(Long userId);
}
