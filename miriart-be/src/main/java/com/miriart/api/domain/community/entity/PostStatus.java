package com.miriart.api.domain.community.entity;

/**
 * Q&A 게시글 상태
 */
public enum PostStatus {
    OPEN,       // 진행 중
    SOLVED,     // 채택 완료
    EXPIRED,    // 마감 미채택
    CLOSED      // 관리자 종료
}
