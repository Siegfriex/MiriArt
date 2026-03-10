package com.miriart.api.domain.community.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.community.dto.CreateAnswerCommand;
import com.miriart.api.domain.community.dto.CreateAnswerRequest;
import com.miriart.api.domain.community.service.AnswerCommandService;
import com.miriart.api.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

/**
 * 답변 API. POST /api/posts/{postId}/answers (인증 필요).
 */
@Tag(name = "커뮤니티", description = "게시글·답변·좋아요 API")
@Slf4j
@RestController
@RequestMapping("/api/posts/{postId}/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final ObjectMapper objectMapper;
    private final AnswerCommandService answerCommandService;

    @Operation(summary = "답변 작성")
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> create(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @RequestBody @Valid CreateAnswerRequest req) {

        CreateAnswerCommand cmd = CreateAnswerCommand.builder()
                .postId(postId)
                .content(req.content())
                .imageUrls(toJson(req.imageUrls()))
                .build();
        Long answerId = answerCommandService.createAnswer(userId, cmd);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(answerId));
    }

    @Operation(summary = "답변 수정")
    @PutMapping("/{answerId}")
    public ResponseEntity<ApiResponse<Void>> update(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @PathVariable Long answerId,
            @RequestBody @Valid CreateAnswerRequest req) {
        answerCommandService.updateAnswer(userId, postId, answerId,
                req.content(), toJson(req.imageUrls()));
        return ResponseEntity.ok(ApiResponse.success());
    }

    @Operation(summary = "답변 삭제")
    @DeleteMapping("/{answerId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long postId,
            @PathVariable Long answerId) {
        answerCommandService.deleteAnswer(userId, postId, answerId);
        return ResponseEntity.noContent().build();
    }

    private String toJson(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.warn("imageUrls JSON 직렬화 실패, 빈 배열 반환", e);
            return "[]";
        }
    }
}
