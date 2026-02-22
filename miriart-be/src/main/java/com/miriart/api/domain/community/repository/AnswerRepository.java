package com.miriart.api.domain.community.repository;

import com.miriart.api.domain.community.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByPostIdOrderByCreatedAtAsc(Long postId);

    Optional<Answer> findByIdAndPostId(Long id, Long postId);

    long countByPostId(Long postId);
}
