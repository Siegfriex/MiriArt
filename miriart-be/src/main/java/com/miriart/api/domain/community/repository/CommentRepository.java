package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Comment;
import com.miriart.api.domain.community.entity.CommentParentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 댓글 JPA 리포지토리. 부모 타입·ID별 댓글 목록(생성일 순) 조회.
 *
 * <p>연계: 게시글/답변 상세 API에서 댓글 목록 조회 시 사용.</p>
 *
 * @author MiriArt Team
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByParentTypeAndParentIdOrderByCreatedAtAsc(
            CommentParentType parentType, Long parentId);
}
