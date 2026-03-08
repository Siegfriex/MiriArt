package com.miriart.api.domain.community.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.community.dto.CreateAnswerCommand;
import com.miriart.api.domain.community.dto.CreateAnswerRequest;
import com.miriart.api.domain.community.service.AnswerCommandService;
import com.miriart.api.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 답변 API. POST /api/posts/{postId}/answers (인증 필요).
 */
@RestController
@RequestMapping("/api/posts/{postId}/answers")
@RequiredArgsConstructor
public class AnswerController {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final AnswerCommandService answerCommandService;

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
            return MAPPER.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
