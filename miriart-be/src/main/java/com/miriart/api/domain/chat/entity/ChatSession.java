package com.miriart.api.domain.chat.entity;

import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 채팅 세션 엔티티. chat_sessions 테이블 매핑.
 *
 * <p>연계: {@link com.miriart.api.domain.chat.service.ChatSessionService}에서 목록 조회·메타 업데이트.
 * {@link com.miriart.api.domain.chat.service.ChatSessionKeyResolver}에서 생성·조회.
 * Redis 히스토리는 {@link com.miriart.api.domain.ai.service.AiProxyService}가 관리 (변경 없음).</p>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "chat_sessions",
        indexes = {
                @Index(name = "idx_cs_user_updated", columnList = "user_id, updated_at DESC"),
                @Index(name = "idx_cs_user_analysis", columnList = "user_id, analysis_id"),
                @Index(name = "idx_cs_session_key", columnList = "session_key")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_id")
    private Analysis analysis;

    @Column(name = "session_key", nullable = false, unique = true, length = 36)
    private String sessionKey;

    @Column(name = "model_type", nullable = false, length = 20)
    private String modelType = "CHAT_PRO";

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;

    @Column(name = "message_count", nullable = false)
    private int messageCount = 0;

    @Builder
    public ChatSession(User user, Analysis analysis, String sessionKey, String modelType, String title) {
        this.user = user;
        this.analysis = analysis;
        this.sessionKey = sessionKey;
        this.modelType = modelType != null ? modelType : "CHAT_PRO";
        this.title = title;
    }

    /**
     * 메시지 1건 기록. role별 호출하여 정확한 카운트 유지.
     * MODEL 응답 시 lastMessage 갱신.
     */
    public void applyMessage(ChatRole role, String text) {
        this.messageCount++;
        if (role == ChatRole.MODEL) {
            this.lastMessage = text;
        }
    }
}
