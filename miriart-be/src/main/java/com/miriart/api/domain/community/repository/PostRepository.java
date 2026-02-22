package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostStatus;
import com.miriart.api.domain.community.entity.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByTypeAndStatus(PostType type, PostStatus status, Pageable pageable);

    Page<Post> findByGradeScopeAndDomainScope(String gradeScope, String domainScope, Pageable pageable);
}
