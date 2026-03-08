package com.miriart.api.domain.community.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.community.dto.CreatePostRequest;
import com.miriart.api.domain.community.dto.PostDetailResponse;
import com.miriart.api.domain.community.entity.Persona;
import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostType;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 게시글 작성 커맨드 서비스.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PostCommandService {

    private final ObjectMapper objectMapper;
    private final PostRepository postRepository;
    private final PersonaService personaService;
    private final PostQueryService postQueryService;
    private final UserRepository userRepository;

    @Transactional
    public PostDetailResponse createPost(Long userId, CreatePostRequest req) {
        User user = userRepository.findByIdOrThrow(userId);
        PostType postType;
        try {
            postType = PostType.valueOf(req.type().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // isAnonymous: true → 가명 페르소나, false/null → 실명(persona 없음)
        Persona persona = Boolean.TRUE.equals(req.isAnonymous())
                ? personaService.getOrCreatePersona(userId, "community")
                : null;

        LocalDateTime deadlineAt = null;
        if (postType == PostType.QNA && req.deadlineHours() != null) {
            deadlineAt = LocalDateTime.now().plusHours(req.deadlineHours());
        }

        Post post = Post.builder()
                .user(user)
                .persona(persona)
                .type(postType)
                .title(req.title())
                .content(req.content())
                .gradeScope(req.gradeScope())
                .domainScope(req.domainScope())
                .tags(toJson(req.tags()))
                .imageUrls(toJson(req.imageUrls()))
                .deadlineAt(deadlineAt)
                .build();
        post = postRepository.save(post);

        return postQueryService.getPostDetail(post.getId(), userId);
    }

    @Transactional
    public PostDetailResponse updatePost(Long userId, Long postId, CreatePostRequest req) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED);
        }

        post.update(
                req.title(),
                req.content(),
                req.gradeScope(),
                req.domainScope(),
                toJson(req.tags()),
                toJson(req.imageUrls())
        );

        return postQueryService.getPostDetail(postId, userId);
    }

    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        if (!post.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED);
        }
        post.close();
    }

    private String toJson(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.error("JSON 직렬화 실패", e);
            return "[]";
        }
    }
}
