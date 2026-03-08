package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostStatus;
import com.miriart.api.domain.community.entity.PostType;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * 게시글 JPA 리포지토리. 유형·상태별 목록, 학년·도메인 스코프별 목록 조회.
 *
 * <p>연계: Phase C 커뮤니티 API에서 게시글 목록·필터 검색 시 사용. SecurityConfig에서 GET /api/posts/** 공개.</p>
 *
 * <p>채택 락: findByIdForUpdate는 동시 채택 방지용. 초기에는 애플리케이션 수준 검사만 사용해도 되며, 필요 시 호출부에서 사용.</p>
 *
 * @author MiriArt Team
 */
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByTypeAndStatus(PostType type, PostStatus status, Pageable pageable);

    Page<Post> findByGradeScopeAndDomainScope(String gradeScope, String domainScope, Pageable pageable);

    /**
     * 채택 시 동시성 제어용. PESSIMISTIC_WRITE → SELECT ... FOR UPDATE.
     * 초기에는 사용하지 않고 acceptedAnswerId null 체크만 해도 됨.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Post p where p.id = :id")
    Optional<Post> findByIdForUpdate(@Param("id") Long id);

    /** answerCount 증가 (카운터 갱신 — 엔티티 dirty check 대안). */
    @Modifying
    @Query("update Post p set p.answerCount = p.answerCount + 1 where p.id = :id")
    int incrementAnswerCount(@Param("id") Long id);

    /** likeCount 증감 (delta: +1 또는 -1). */
    @Modifying(clearAutomatically = true)
    @Query("update Post p set p.likeCount = p.likeCount + :delta where p.id = :id")
    int incrementLikeCount(@Param("id") Long id, @Param("delta") int delta);
}
