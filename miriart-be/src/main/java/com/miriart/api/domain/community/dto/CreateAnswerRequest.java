package com.miriart.api.domain.community.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * 답변 작성 요청 DTO. FE createAnswerRequestSchema 매칭.
 * personaId는 FE에서 전송하지 않으므로 포함하지 않음.
 */
public record CreateAnswerRequest(
        @NotBlank String content,
        List<String> imageUrls
) {}
