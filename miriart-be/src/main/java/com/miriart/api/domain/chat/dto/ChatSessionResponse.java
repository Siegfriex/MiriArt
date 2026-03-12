package com.miriart.api.domain.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 채팅 세션 목록/단건 응답 DTO.
 *
 * <p><b>null 보장 규칙:</b></p>
 * <ul>
 *   <li>{@code grade}, {@code totalScore}, {@code fixScope}는
 *       COMPLETED 상태 분석과 연동된 세션에서만 값이 채워집니다.</li>
 *   <li>analysisId가 null인 일반 세션이거나, 분석이 PENDING/FAILED이면 모두 null입니다.</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class ChatSessionResponse {

    private Long id;
    private String sessionKey;
    /** null이면 분석 연동 없는 일반 채팅 세션. */
    private Long analysisId;
    private String modelType;
    private String title;
    private String lastMessage;
    private int messageCount;
    /** COMPLETED 분석 연동 세션에서만 non-null. PENDING/FAILED이면 null. */
    private String grade;
    /** COMPLETED 분석 연동 세션에서만 non-null. */
    private Double totalScore;
    /** COMPLETED 분석 연동 세션에서만 non-null. */
    private String fixScope;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
