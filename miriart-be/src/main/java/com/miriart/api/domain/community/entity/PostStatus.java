package com.miriart.api.domain.community.entity;

/**
 * Q&A 게시글 상태. OPEN(진행중)·SOLVED(채택완료)·EXPIRED(마감미채택)·CLOSED(관리자종료). Post 엔티티 status 필드.
 *
 * <p>연계: {@link Post#accept}, {@link Post#expire}, {@link PostRepository#findByTypeAndStatus}.</p>
 *
 * @author MiriArt Team
 */
public enum PostStatus {
    OPEN,       // 진행 중
    SOLVED,     // 채택 완료
    EXPIRED,    // 마감 미채택
    CLOSED      // 관리자 종료
}
