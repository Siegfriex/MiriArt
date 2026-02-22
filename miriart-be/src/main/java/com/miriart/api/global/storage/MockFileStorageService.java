package com.miriart.api.global.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * GCS Mock 구현체 — dev 프로파일 전용
 * GCP 자격증명 없이 로컬 개발 가능하도록 Bug #2(H1) 수정
 */
@Slf4j
@Service
@Profile("dev")
public class MockFileStorageService implements FileStorageService {

    private static final String MOCK_BUCKET = "miriart-bucket";

    @Override
    public FileUploadResult upload(MultipartFile file, FileCategory category) {
        String objectName = category.getPathPrefix() + "/mock/"
                + UUID.randomUUID() + "_"
                + (file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_") : "file");

        String publicUrl = "https://storage.googleapis.com/" + MOCK_BUCKET + "/" + objectName;
        String gcsUri = "gs://" + MOCK_BUCKET + "/" + objectName;

        log.info("[Mock] 파일 업로드 시뮬레이션: publicUrl={}", publicUrl);
        return new FileUploadResult(publicUrl, gcsUri);
    }

    @Override
    public void delete(String fileUrl) {
        log.info("[Mock] 파일 삭제 시뮬레이션: {}", fileUrl);
    }
}
