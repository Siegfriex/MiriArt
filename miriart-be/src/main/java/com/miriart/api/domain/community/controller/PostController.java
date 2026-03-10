package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.CreatePostRequest;
import com.miriart.api.domain.community.dto.PostDetailResponse;
import com.miriart.api.domain.community.dto.PostsFeedPageResponse;
import com.miriart.api.domain.community.service.AnswerCommandService;
import com.miriart.api.domain.community.service.PostCommandService;
import com.miriart.api.domain.community.service.PostQueryService;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "커뮤니티", description = "게시글·답변·좋아요 API")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostQueryService postQueryService;
    private final PostCommandService postCommandService;
    private final AnswerCommandService answerCommandService;

    @Operation(summary = "피드 목록 조회", description = "타입·정렬·학년·도메인 필터 지원. 공개 API.")
    @SecurityRequirements()
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

    @Operation(summary = "게시글 상세 조회", description = "공개 API.")
    @SecurityRequirements()
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDetailResponse>> getPost(
            @PathVariable Long id,
            @AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(ApiResponse.success(
                postQueryService.getPostDetail(id, userId)));
    }

    @Operation(summary = "게시글 작성")
    @PostMapping
    public ResponseEntity<ApiResponse<PostDetailResponse>> createPost(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid CreatePostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(postCommandService.createPost(userId, request)));
    }

    @Operation(summary = "게시글 수정")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDetailResponse>> updatePost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @RequestBody @Valid CreatePostRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(postCommandService.updatePost(userId, id, request)));
    }

    @Operation(summary = "게시글 삭제")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id) {
        postCommandService.deletePost(userId, id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Q&A 답변 채택")
    @PostMapping("/{postId}/accept/{answerId}")
    public ResponseEntity<ApiResponse<Void>> acceptAnswer(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @PathVariable Long answerId) {
        answerCommandService.acceptAnswer(userId, postId, answerId);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
