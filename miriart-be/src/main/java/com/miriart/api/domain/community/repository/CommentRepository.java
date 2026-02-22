package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Comment;
import com.miriart.api.domain.community.entity.CommentParentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByParentTypeAndParentIdOrderByCreatedAtAsc(
            CommentParentType parentType, Long parentId);
}
