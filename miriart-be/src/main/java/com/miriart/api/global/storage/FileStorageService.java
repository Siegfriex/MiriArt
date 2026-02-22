package com.miriart.api.global.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 파일 저장 서비스 인터페이스. 업로드 시 공개 URL + GCS URI 반환.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>구현체: 프로덕션 {@link GcsFileStorageService} (GCS), 개발 {@link MockFileStorageService} (로컬 시뮬레이션)</li>
 *   <li>{@link com.miriart.api.domain.analysis.service.AnalysisService}에서 작품 이미지 업로드 후 gcsUri를 FastAPI /internal/ai/analyze에 전달</li>
 * </ul>
 *
 * <p>Cariv 이식 + FileUploadResult 반환으로 GCS URI 안전 처리.</p>
 *
 * @author MiriArt Team
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
