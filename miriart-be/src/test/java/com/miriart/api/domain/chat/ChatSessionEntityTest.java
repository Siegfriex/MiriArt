package com.miriart.api.domain.chat;

import com.miriart.api.domain.chat.entity.ChatRole;
import com.miriart.api.domain.chat.entity.ChatSession;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * ChatSession 엔티티 단위 테스트. applyMessage 동작 검증.
 */
class ChatSessionEntityTest {

    private ChatSession createSession() {
        return ChatSession.builder()
                .sessionKey("test-key")
                .title("테스트 세션")
                .build();
    }

    @Test
    @DisplayName("applyMessage(USER) → messageCount +1, lastMessage 미갱신")
    void applyMessage_user_increments_count_only() {
        ChatSession session = createSession();

        session.applyMessage(ChatRole.USER, "안녕하세요");

        assertThat(session.getMessageCount()).isEqualTo(1);
        assertThat(session.getLastMessage()).isNull();
    }

    @Test
    @DisplayName("applyMessage(MODEL) → messageCount +1, lastMessage 갱신")
    void applyMessage_model_increments_and_updates_lastMessage() {
        ChatSession session = createSession();

        session.applyMessage(ChatRole.MODEL, "안녕하세요, 도움이 필요하신가요?");

        assertThat(session.getMessageCount()).isEqualTo(1);
        assertThat(session.getLastMessage()).isEqualTo("안녕하세요, 도움이 필요하신가요?");
    }

    @Test
    @DisplayName("USER + MODEL 연속 호출 → count=2, lastMessage=MODEL 텍스트")
    void applyMessage_user_then_model() {
        ChatSession session = createSession();

        session.applyMessage(ChatRole.USER, "구도 분석해줘");
        session.applyMessage(ChatRole.MODEL, "하단 좌측의 밀도를 높여보세요.");

        assertThat(session.getMessageCount()).isEqualTo(2);
        assertThat(session.getLastMessage()).isEqualTo("하단 좌측의 밀도를 높여보세요.");
    }

    @Test
    @DisplayName("여러 턴 대화 → count 정확히 누적, lastMessage는 마지막 MODEL")
    void applyMessage_multiple_turns() {
        ChatSession session = createSession();

        session.applyMessage(ChatRole.USER, "질문1");
        session.applyMessage(ChatRole.MODEL, "답변1");
        session.applyMessage(ChatRole.USER, "질문2");
        session.applyMessage(ChatRole.MODEL, "답변2");

        assertThat(session.getMessageCount()).isEqualTo(4);
        assertThat(session.getLastMessage()).isEqualTo("답변2");
    }
}
