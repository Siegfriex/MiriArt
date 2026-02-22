package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostStatus;
import com.miriart.api.domain.community.entity.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 게시글 JPA 리포지토리. 유형·상태별 목록, 학년·도메인 스코프별 목록 조회.
 *
 * <p>연계: Phase C 커뮤니티 API에서 게시글 목록·필터 검색 시 사용. SecurityConfig에서 GET /api/posts/** 공개.</p>
 *
 * @author MiriArt Team
 */
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByTypeAndStatus(PostType type, PostStatus status, Pageable pageable);

    Page<Post> findByGradeScopeAndDomainScope(String gradeScope, String domainScope, Pageable pageable);
}
