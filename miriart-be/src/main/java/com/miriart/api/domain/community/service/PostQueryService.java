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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 게시글 읽기 전용 서비스. 피드 목록 + 상세 조회.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostQueryService {

    private final PostRepository postRepository;
    private final AnswerRepository answerRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    private static final Sort SORT_LATEST = Sort.by("createdAt").descending();
    private static final Sort SORT_POPULAR = Sort.by("likeCount").descending()
            .and(Sort.by("answerCount").descending())
            .and(Sort.by("createdAt").descending());

    /**
     * 피드 목록. type/sort/grade/domain 필터 + Page 기반 cursor 래퍼.
     */
    public PostsFeedPageResponse getFeed(String type, String sort, String grade, String domain,
                                         String cursor, int size, Long optionalUserId) {
        int page = decodeCursor(cursor);
        int clampedSize = Math.max(1, Math.min(size, 100));
        Sort sorting = "popular".equalsIgnoreCase(sort) ? SORT_POPULAR : SORT_LATEST;
        PageRequest pageable = PageRequest.of(page, clampedSize, sorting);

        // type 파싱
        PostType postType = null;
        if (type != null && !type.isBlank()) {
            try {
                postType = PostType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
        }

        boolean hasGrade = grade != null && !grade.isBlank();
        boolean hasDomain = domain != null && !domain.isBlank();

        Page<Post> postPage;
        if (postType != null && (hasGrade || hasDomain)) {
            postPage = postRepository.findByTypeAndStatusAndGradeScopeAndDomainScope(
                    postType, PostStatus.OPEN,
                    hasGrade ? grade : null,
                    hasDomain ? domain : null,
                    pageable);
        } else if (postType != null) {
            postPage = postRepository.findByTypeAndStatus(postType, PostStatus.OPEN, pageable);
        } else if (hasGrade || hasDomain) {
            postPage = postRepository.findByGradeScopeAndDomainScope(
                    hasGrade ? grade : null,
                    hasDomain ? domain : null,
                    pageable);
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

        // 댓글: post 댓글
        List<Comment> postComments = commentRepository
                .findByParentTypeAndParentIdOrderByCreatedAtAsc(CommentParentType.POST, postId);

        // answer 댓글: IN 쿼리로 N+1 방지
        List<Long> answerIds = answers.stream().map(Answer::getId).toList();
        Map<Long, List<Comment>> answerCommentsMap;
        if (answerIds.isEmpty()) {
            answerCommentsMap = Map.of();
        } else {
            answerCommentsMap = commentRepository
                    .findByParentTypeAndParentIdInOrderByCreatedAtAsc(CommentParentType.ANSWER, answerIds)
                    .stream()
                    .collect(Collectors.groupingBy(Comment::getParentId));
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
        } catch (Exception e) {
            log.warn("cursor decode failed: cursor={}", cursor, e);
        }
        return 0;
    }

    static String encodeCursor(int page) {
        return Base64.getEncoder().encodeToString(("page=" + page).getBytes(StandardCharsets.UTF_8));
    }
}
