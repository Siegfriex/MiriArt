package com.miriart.api.global.storage;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 파일 업로드 카테고리 (MiriArt 도메인 기준으로 재정의)
 */
@Getter
@RequiredArgsConstructor
public enum FileCategory {
    ARTWORK("artworks"),
    COMMUNITY("community"),
    PROFILE("profiles");

    private final String pathPrefix;
}
