package com.miriart.api.global.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 파일 저장 서비스 인터페이스
 * Cariv FileStorageService 이식 + FileUploadResult 반환으로 GCS URI 안전 처리
 */
public interface FileStorageService {

    /**
     * 파일을 업로드하고 공개 URL + GCS URI 반환
     *
     * @param file     업로드할 파일 (null/empty 시 예외)
     * @param category 파일 카테고리 (GCS 경로 prefix 결정)
     * @return {@link FileUploadResult} — publicUrl + gcsUri 포함
     */
    FileUploadResult upload(MultipartFile file, FileCategory category) throws IOException;

    /**
     * 파일 삭제
     *
     * @param fileUrl 삭제할 파일의 공개 URL
     */
    void delete(String fileUrl);
}
