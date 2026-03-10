package com.miriart.api.global.storage;

/**
 * GCS Signed URL 발급 서비스 인터페이스.
 * 프로덕션: {@link GcsSignedUrlService}, 개발: {@link MockGcsSignedUrlService}.
 */
public interface SignedUrlService {

    /**
     * gcsUri(gs://bucket/objectPath)로 GET용 v4 Signed URL 생성.
     * 구조화 로그(signed_url_generated / signed_url_error)에 analysisId 사용.
     *
     * @param analysisId 분석 ID (로깅·메트릭용, null 가능)
     * @param gcsUri     gs://{bucket}/{objectPath}
     * @return url + expiresAt
     */
    SignedImageUrl createSignedUrl(Long analysisId, String gcsUri);
}
