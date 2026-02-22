package com.miriart.api.global.storage;

/**
 * 파일 업로드 결과 레코드. 공개 URL + GCS URI 동시 반환.
 *
 * <p>연계: {@link FileStorageService#upload} 반환 타입.
 * AnalysisService에서 gcsUri를 FastAPI 분석 API 요청 body에 넣어 전달.</p>
 *
 * <p>Bug #1 수정: 업로드 시점에 정확한 GCS URI 확정.</p>
 *
 * @param publicUrl https://storage.googleapis.com/{bucket}/{objectName}
 * @param gcsUri    gs://{bucket}/{objectName}
 * @author MiriArt Team
 */
public record FileUploadResult(
        String publicUrl,   // https://storage.googleapis.com/{bucket}/{objectName}
        String gcsUri       // gs://{bucket}/{objectName}
) {}
