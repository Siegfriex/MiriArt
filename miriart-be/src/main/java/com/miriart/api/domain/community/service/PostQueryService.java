package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.dto.*;
import com.miriart.api.domain.community.entity.*;
import com.miriart.api.domain.community.repository.AnswerRepository;
import com.miriart.api.domain.community.repository.CommentRepository;
import com.miriart.api.domain.community.repository.LikeRepository;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * 게시글 읽기 전용 서비스. 피드 목록 + 상세 조회.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostQueryService {

    private final PostRepository postRepository;
    private final AnswerRepository answerRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    /**
     * 피드 목록. v1: type 필터만, createdAt DESC 고정, Page 기반 + cursor 래퍼.
     * TODO: sort(popular), grade, domain 필터는 다음 스프린트.
     */
    public PostsFeedPageResponse getFeed(String type, String cursor, int size, Long optionalUserId) {
        int page = decodeCursor(cursor);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> postPage;
        if (type != null && !type.isBlank()) {
            PostType postType;
            try {
                postType = PostType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
            postPage = postRepository.findByTypeAndStatus(postType, PostStatus.OPEN, pageable);
        } else {
            postPage = postRepository.findAll(pageable);
        }

        List<PostFeedResponse> responses = postPage.getContent().stream()
                .map(post -> {
                    Boolean isLiked = resolveIsLiked(optionalUserId, LikeTargetType.POST, post.getId());
                    return PostFeedResponse.from(post, isLiked);
                })
                .toList();

        String nextCursor = postPage.hasNext() ? encodeCursor(page + 1) : null;
        return new PostsFeedPageResponse(responses, nextCursor);
    }

    /**
     * 게시글 상세. Post + answers + comments flat 반환.
     */
    public PostDetailResponse getPostDetail(Long postId, Long optionalUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        List<Answer> answers = answerRepository.findByPostIdOrderByCreatedAtAsc(postId);

        // 댓글: post 댓글 + 각 answer 댓글
        // TODO: Phase 6에서 Answer.commentCount 비정규화 + 댓글 전용 조회로 N+1 개선
        List<Comment> postComments = commentRepository
                .findByParentTypeAndParentIdOrderByCreatedAtAsc(CommentParentType.POST, postId);
        Map<Long, List<Comment>> answerCommentsMap = new HashMap<>();
        for (Answer a : answers) {
            answerCommentsMap.put(a.getId(), commentRepository
                    .findByParentTypeAndParentIdOrderByCreatedAtAsc(CommentParentType.ANSWER, a.getId()));
        }

        Boolean isLiked = resolveIsLiked(optionalUserId, LikeTargetType.POST, postId);

        List<AnswerResponse> answerResponses = answers.stream()
                .map(a -> AnswerResponse.from(a,
                        answerCommentsMap.getOrDefault(a.getId(), List.of()).size()))
                .toList();

        List<Comment> allComments = new ArrayList<>(postComments);
        answerCommentsMap.values().forEach(allComments::addAll);
        List<CommentResponse> commentResponses = allComments.stream()
                .map(CommentResponse::from)
                .toList();

        return PostDetailResponse.from(post, isLiked, answerResponses, commentResponses);
    }

    private Boolean resolveIsLiked(Long userId, LikeTargetType targetType, Long targetId) {
        if (userId == null) return null;
        return likeRepository.existsByUserIdAndTargetTypeAndTargetId(userId, targetType, targetId);
    }

    static int decodeCursor(String cursor) {
        if (cursor == null || cursor.isBlank()) return 0;
        try {
            String decoded = new String(Base64.getDecoder().decode(cursor), StandardCharsets.UTF_8);
            if (decoded.startsWith("page=")) {
                return Integer.parseInt(decoded.substring(5));
            }
        } catch (Exception ignored) {}
        return 0;
    }

    static String encodeCursor(int page) {
        return Base64.getEncoder().encodeToString(("page=" + page).getBytes(StandardCharsets.UTF_8));
    }
}
