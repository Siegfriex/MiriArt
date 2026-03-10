package com.miriart.api.global.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageException;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * GCS v4 Signed URL 생성 서비스. GET 용도의 시간 제한 URL을 발급한다.
 *
 * <p>연계: {@link com.miriart.api.domain.analysis.controller.ImageController}에서
 * Analysis.gcsUrl을 전달받아 Signed URL로 변환 후 FE에 반환.</p>
 *
 * <p>@Profile("!dev") — dev에서는 Mock 또는 해당 엔드포인트 비활성화.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@Profile("!dev")
@RequiredArgsConstructor
public class GcsSignedUrlService implements SignedUrlService {

    private static final String GS_SCHEME = "gs://";
    private static final List<String> ALLOWED_OBJECT_PREFIXES = List.of("artworks/", "edited/", "analyses/");

    private final Storage storage;

    @Value("${miriart.gcs.bucket:miriart-bucket}")
    private String bucketName;

    @Value("${miriart.gcs.image-url-expiration-minutes:15}")
    private int expirationMinutes;

    /**
     * gcsUri(gs://bucket/objectPath)로 GCS v4 GET Signed URL 생성.
     * 성공 시 signed_url_generated, 실패 시 signed_url_error 구조화 로그 출력 (메트릭 연동용).
     *
     * @param analysisId 분석 ID (로깅용, null 가능)
     * @param gcsUri     gs://{bucket}/{objectPath} 형식
     * @return url + expiresAt
     * @throws BusinessException F005 — 파싱/prefix 검증 실패 또는 GCS 예외
     */
    @Override
    public SignedImageUrl createSignedUrl(Long analysisId, String gcsUri) {
        String objectPath = null;
        if (gcsUri == null || gcsUri.isBlank()) {
            logSignedUrlError(analysisId, null, "null_or_blank");
            throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
        }
        if (!gcsUri.startsWith(GS_SCHEME)) {
            logSignedUrlError(analysisId, null, "not_gs_scheme");
            throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
        }
        String withoutScheme = gcsUri.substring(GS_SCHEME.length());
        int firstSlash = withoutScheme.indexOf('/');
        if (firstSlash <= 0 || firstSlash == withoutScheme.length() - 1) {
            logSignedUrlError(analysisId, null, "parse_failed");
            throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
        }
        String bucket = withoutScheme.substring(0, firstSlash);
        objectPath = withoutScheme.substring(firstSlash + 1);

        if (!bucketName.equals(bucket)) {
            logSignedUrlError(analysisId, objectPath, "bucket_mismatch expected=" + bucketName + " got=" + bucket);
            throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
        }

        boolean allowedPrefix = ALLOWED_OBJECT_PREFIXES.stream()
                .anyMatch(objectPath::startsWith);
        if (!allowedPrefix) {
            logSignedUrlError(analysisId, objectPath, "prefix_not_allowed");
            throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
        }

        try {
            BlobId blobId = BlobId.of(bucketName, objectPath);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            URL signedUrl = storage.signUrl(
                    blobInfo,
                    expirationMinutes,
                    TimeUnit.MINUTES,
                    Storage.SignUrlOption.withV4Signature()
            );
            Instant expiresAt = Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES);
            log.info("event=signed_url_generated analysisId={} objectPath={} ttl={}", analysisId, objectPath, expirationMinutes);
            return new SignedImageUrl(signedUrl.toString(), expiresAt);
        } catch (StorageException | IllegalArgumentException e) {
            logSignedUrlError(analysisId, objectPath, e.getMessage());
            throw new BusinessException(ErrorCode.IMAGE_URL_GENERATION_FAILED);
        }
    }

    private void logSignedUrlError(Long analysisId, String objectPath, String reason) {
        log.warn("event=signed_url_error analysisId={} objectPath={} errorCode=F005 reason={}",
                analysisId, objectPath, reason);
    }
}
