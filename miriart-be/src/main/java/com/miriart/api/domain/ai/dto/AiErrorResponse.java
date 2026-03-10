package com.miriart.api.domain.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AI 서비스(FastAPI) 에러 응답 body. status 4xx/5xx 시 code·message 포함.
 *
 * <p>연계: {@link com.miriart.api.domain.ai.service.AiErrorMapper}에서 code와 HTTP status로
 * BE {@link com.miriart.api.global.exception.ErrorCode} 매핑.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AiErrorResponse {

    private String code;
    private String message;
}
