package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.CommentResponse;
import com.miriart.api.domain.community.dto.CreateCommentRequest;
import com.miriart.api.domain.community.service.CommentCommandService;
import com.miriart.api.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 댓글 API. POST /api/comments (인증 필요).
 */
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentCommandService commentCommandService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid CreateCommentRequest req) {
        CommentResponse body = commentCommandService.createComment(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id,
            @RequestBody @Valid CreateCommentRequest req) {
        CommentResponse body = commentCommandService.updateComment(userId, id, req.content());
        return ResponseEntity.ok(ApiResponse.success(body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long id) {
        commentCommandService.deleteComment(userId, id);
        return ResponseEntity.noContent().build();
    }
}
