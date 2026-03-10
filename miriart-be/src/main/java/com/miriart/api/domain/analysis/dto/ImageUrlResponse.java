package com.miriart.api.domain.analysis.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

/**
 * GET /api/images/{id}/url 응답 DTO.
 * FE는 이 url로 GCS에 직접 GET 요청하여 이미지를 표시한다.
 *
 * <ul>
 *   <li>url: GCS v4 Signed URL (약 15분 유효)</li>
 *   <li>expiresAt: URL 만료 시각 (ISO-8601)</li>
 * </ul>
 */
@Getter
@Builder
public class ImageUrlResponse {

    private final String url;
    private final Instant expiresAt;

    public static ImageUrlResponse of(String url, Instant expiresAt) {
        return ImageUrlResponse.builder()
                .url(url)
                .expiresAt(expiresAt)
                .build();
    }
}
