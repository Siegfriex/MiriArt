package com.miriart.api.global.storage;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Google Cloud Storage 파일 저장 구현체. 프로덕션/비-dev 프로파일에서 사용.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link FileStorageService} 구현. {@code miriart.gcs.bucket} 버킷에 category/날짜/UUID_파일명으로 업로드</li>
 *   <li>반환된 gcsUri(gs://...)를 분석 서비스에서 FastAPI에 전달해 Vertex AI가 이미지 로드</li>
 *   <li>@Profile("!dev") — dev에서는 {@link MockFileStorageService} 사용</li>
 * </ul>
 *
 * <p>BE_SETUP_GUIDE §8.3 기반.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@Profile("!dev")
@RequiredArgsConstructor
public class GcsFileStorageService implements FileStorageService {

    private final Storage storage;

    @Value("${miriart.gcs.bucket:miriart-bucket}")
    private String bucketName;

    @Override
    public FileUploadResult upload(MultipartFile file, FileCategory category) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다");
        }

        String objectName = category.getPathPrefix() + "/"
                + LocalDate.now() + "/"
                + UUID.randomUUID() + "_" + sanitizeFileName(file.getOriginalFilename());

        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, objectName)
                .setContentType(file.getContentType())
                .build();

        storage.create(blobInfo, file.getBytes());

        // 업로드 시점에 두 형태의 URL을 동시 계산 — string.replace() 의존성 제거
        String publicUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
        String gcsUri = "gs://" + bucketName + "/" + objectName;

        log.debug("GCS 업로드 완료: publicUrl={}, gcsUri={}", publicUrl, gcsUri);
        return new FileUploadResult(publicUrl, gcsUri);
    }

    @Override
    public void delete(String fileUrl) {
        String prefix = "https://storage.googleapis.com/" + bucketName + "/";
        if (fileUrl != null && fileUrl.startsWith(prefix)) {
            String objectName = fileUrl.substring(prefix.length());
            storage.delete(bucketName, objectName);
            log.debug("GCS 파일 삭제 완료: {}", objectName);
        }
    }

    private String sanitizeFileName(String originalFilename) {
        if (originalFilename == null) return "file";
        return originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
