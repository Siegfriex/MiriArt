package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.CreatePostRequest;
import com.miriart.api.domain.community.dto.PostDetailResponse;
import com.miriart.api.domain.community.dto.PostsFeedPageResponse;
import com.miriart.api.domain.community.service.AnswerCommandService;
import com.miriart.api.domain.community.service.PostCommandService;
import com.miriart.api.domain.community.service.PostQueryService;
import com.miriart.api.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 커뮤니티 게시글 API.
 * GET /api/posts — 피드 목록 (공개)
 * GET /api/posts/{id} — 상세 (공개)
 * POST /api/posts — 작성 (인증 필요)
 * POST /api/posts/{postId}/accept/{answerId} — 채택 (인증 필요)
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostQueryService postQueryService;
    private final PostCommandService postCommandService;
    private final AnswerCommandService answerCommandService;

    @GetMapping
    public ResponseEntity<ApiResponse<PostsFeedPageResponse>> getPosts(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
                postQueryService.getFeed(type, sort, grade, domain, cursor, size, userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDetailResponse>> getPost(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
                postQueryService.getPostDetail(id, userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostDetailResponse>> createPost(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid CreatePostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(postCommandService.createPost(userId, request)));
    }

    @PostMapping("/{postId}/accept/{answerId}")
    public ResponseEntity<ApiResponse<Void>> acceptAnswer(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @PathVariable Long answerId) {
        answerCommandService.acceptAnswer(userId, postId, answerId);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
