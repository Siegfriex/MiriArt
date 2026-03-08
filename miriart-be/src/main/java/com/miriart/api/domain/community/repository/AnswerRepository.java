package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 답변 JPA 리포지토리. 게시글별 답변 목록·단건·개수 조회.
 *
 * <p>연계: Q&A 상세/채택 로직에서 사용. SecurityConfig에서 GET /api/answers/** 공개.</p>
 *
 * @author MiriArt Team
 */
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByPostIdOrderByCreatedAtAsc(Long postId);

    Optional<Answer> findByIdAndPostId(Long id, Long postId);

    long countByPostId(Long postId);

    /** likeCount 증감 (delta: +1 또는 -1). */
    @Modifying
    @Query("update Answer a set a.likeCount = a.likeCount + :delta where a.id = :id")
    int incrementLikeCount(@Param("id") Long id, @Param("delta") int delta);
}
