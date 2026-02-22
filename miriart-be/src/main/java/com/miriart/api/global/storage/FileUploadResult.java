package com.miriart.api.global.storage;

/**
 * 파일 업로드 결과 — 공개 URL + GCS URI 동시 반환
 * Bug #1 수정: string.replace() 변환 대신 업로드 시점에 정확한 GCS URI 확정
 */
public record FileUploadResult(
        String publicUrl,   // https://storage.googleapis.com/{bucket}/{objectName}
        String gcsUri       // gs://{bucket}/{objectName}
) {}
