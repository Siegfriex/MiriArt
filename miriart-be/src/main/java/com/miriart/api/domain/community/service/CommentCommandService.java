package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.dto.CommentResponse;
import com.miriart.api.domain.community.dto.CreateCommentRequest;
import com.miriart.api.domain.community.entity.*;
import com.miriart.api.domain.community.repository.AnswerRepository;
import com.miriart.api.domain.community.repository.CommentRepository;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 댓글 작성 서비스. POST /api/comments.
 * parent 검증 → Persona 조회/생성 → Comment 저장 → Post.commentCount 증가.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CommentCommandService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final AnswerRepository answerRepository;
    private final PersonaService personaService;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse createComment(Long userId, CreateCommentRequest req) {
        // 1. parentType 파싱 (FE는 소문자 전송)
        CommentParentType parentType;
        try {
            parentType = CommentParentType.valueOf(req.parentType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 2. parent 존재 검증 + postId 확보
        Long postId;
        if (parentType == CommentParentType.POST) {
            Post post = postRepository.findById(req.parentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
            postId = post.getId();
        } else {
            Answer answer = answerRepository.findById(req.parentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));
            postId = answer.getPost().getId();
        }

        // 3. Persona 조회/생성
        User user = userRepository.findByIdOrThrow(userId);
        Persona persona = personaService.getOrCreatePersona(userId, "community");

        // 4. 댓글 저장
        Comment comment = Comment.builder()
                .parentType(parentType)
                .parentId(req.parentId())
                .user(user)
                .persona(persona)
                .content(req.content())
                .build();
        comment = commentRepository.saveAndFlush(comment);

        // 5. Post.commentCount 증가
        postRepository.incrementCommentCount(postId);

        log.debug("댓글 작성 - commentId={}, parentType={}, parentId={}, userId={}",
                comment.getId(), parentType, req.parentId(), userId);
        return CommentResponse.from(comment);
    }

    @Transactional
    public CommentResponse updateComment(Long userId, Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));
        if (!comment.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED);
        }
        comment.updateContent(content);
        return CommentResponse.from(comment);
    }

    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));
        if (!comment.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        // postId 확보 (댓글이 달린 post의 commentCount 감소)
        Long postId;
        if (comment.getParentType() == CommentParentType.POST) {
            postId = comment.getParentId();
        } else {
            Answer answer = answerRepository.findById(comment.getParentId())
                    .orElse(null);
            postId = answer != null ? answer.getPost().getId() : null;
        }

        commentRepository.delete(comment);

        if (postId != null) {
            Post post = postRepository.findById(postId).orElse(null);
            if (post != null) {
                post.decrementCommentCount(1);
            }
        }

        log.debug("댓글 삭제 - commentId={}, userId={}", commentId, userId);
    }
}
