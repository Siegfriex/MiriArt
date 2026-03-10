package com.miriart.api.global.storage;

import java.time.Instant;

/**
 * GCS v4 Signed URL 생성 결과. 내부 서비스 반환용.
 *
 * @param url       생성된 Signed URL
 * @param expiresAt 만료 시각
 */
public record SignedImageUrl(String url, Instant expiresAt) {}
