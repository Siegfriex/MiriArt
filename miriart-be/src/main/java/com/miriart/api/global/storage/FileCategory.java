package com.miriart.api.global.storage;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 파일 업로드 카테고리. GCS 경로 prefix 결정 (artworks / community / profiles).
 *
 * <p>연계: {@link FileStorageService#upload(MultipartFile, FileCategory)} 호출 시
 * 업로드 경로가 category.getPathPrefix() 기준으로 생성됨. 작품 분석은 ARTWORK 사용.</p>
 *
 * @author MiriArt Team
 */
@Getter
@RequiredArgsConstructor
public enum FileCategory {
    ARTWORK("artworks"),
    COMMUNITY("community"),
    PROFILE("profiles");

    private final String pathPrefix;
}
