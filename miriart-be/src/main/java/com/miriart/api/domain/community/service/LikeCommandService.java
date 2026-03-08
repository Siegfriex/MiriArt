package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.dto.LikeToggleResult;
import com.miriart.api.domain.community.entity.Like;
import com.miriart.api.domain.community.entity.LikeTargetType;
import com.miriart.api.domain.community.repository.AnswerRepository;
import com.miriart.api.domain.community.repository.LikeRepository;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import org.hibernate.exception.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 좋아요 토글 서비스. SELECT 후 insert/delete + UNIQUE 위반 시 CM006 변환.
 *
 * <p>트랜잭션: 메서드 단위 @Transactional. 대상 likeCount는 엔티티 증감 후 save.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LikeCommandService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final AnswerRepository answerRepository;

    /**
     * 좋아요 토글. 이미 있으면 삭제(REMOVED), 없으면 추가(ADDED). UNIQUE 위반 시 LIKE_ALREADY_EXISTS.
     */
    @Transactional
    public LikeToggleResult toggleLike(Long userId, LikeTargetType targetType, Long targetId) {
        User user = userRepository.findByIdOrThrow(userId);
        ensureTargetExists(targetType, targetId);

        var existing = likeRepository.findByUserIdAndTargetTypeAndTargetId(userId, targetType, targetId);
        if (existing.isPresent()) {
            Like like = existing.get();
            likeRepository.delete(like);
            decrementTargetLikeCount(targetType, targetId);
            return LikeToggleResult.REMOVED;
        }

        try {
            Like like = Like.builder()
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build();
            likeRepository.saveAndFlush(like);
        } catch (DataIntegrityViolationException e) {
            String constraint = e.getCause() instanceof ConstraintViolationException cve
                    ? cve.getConstraintName() : null;
            log.debug("Like unique constraint violation, constraint={}, userId={}, target={}/{}",
                    constraint, userId, targetType, targetId);
            throw new BusinessException(ErrorCode.LIKE_ALREADY_EXISTS);
        }
        incrementTargetLikeCount(targetType, targetId);
        return LikeToggleResult.ADDED;
    }

    private void ensureTargetExists(LikeTargetType targetType, Long targetId) {
        switch (targetType) {
            case POST -> postRepository.findById(targetId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
            case ANSWER -> answerRepository.findById(targetId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));
            case COMMENT -> throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE); // Comment 엔티티 조회 추가 시 구현
        }
    }

    private void incrementTargetLikeCount(LikeTargetType targetType, Long targetId) {
        switch (targetType) {
            case POST -> postRepository.incrementLikeCount(targetId, 1);
            case ANSWER -> answerRepository.incrementLikeCount(targetId, 1);
            case COMMENT -> { /* 확장 시 */ }
        }
    }

    private void decrementTargetLikeCount(LikeTargetType targetType, Long targetId) {
        switch (targetType) {
            case POST -> postRepository.incrementLikeCount(targetId, -1);
            case ANSWER -> answerRepository.incrementLikeCount(targetId, -1);
            case COMMENT -> { /* 확장 시 */ }
        }
    }
}
