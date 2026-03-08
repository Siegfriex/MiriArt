package com.miriart.api.domain.community.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 좋아요 토글 결과. ADDED(좋아요 함) / REMOVED(좋아요 취소).
 *
 * @author MiriArt Team
 */
@Getter
@RequiredArgsConstructor
public enum LikeToggleResult {

    ADDED(true),
    REMOVED(false);

    private final boolean liked;
}
