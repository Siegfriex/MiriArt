package com.miriart.api.domain.chat;

import com.miriart.api.domain.analysis.entity.Analysis;
import com.miriart.api.domain.analysis.entity.AnalysisGrade;
import com.miriart.api.domain.analysis.entity.FixScope;
import com.miriart.api.domain.analysis.repository.AnalysisRepository;
import com.miriart.api.domain.chat.repository.ChatSessionRepository;
import com.miriart.api.domain.chat.service.ChatSessionKeyResolver;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * ChatSessionKeyResolver 통합 테스트.
 * resolve() 분기(null/new-session/blank/analysisId/UUID/unknown) + 타이틀 생성 규칙.
 */
@SpringBootTest
class ChatSessionKeyResolverTest {

    @Autowired ChatSessionKeyResolver resolver;
    @Autowired ChatSessionRepository chatSessionRepository;
    @Autowired AnalysisRepository analysisRepository;
    @Autowired UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = userRepository.save(User.builder()
                .provider(LoginProvider.KAKAO)
                .providerUserId("resolver-test-" + UUID.randomUUID())
                .email("resolver@test.com")
                .build());
    }

    // ── resolve: 신규 세션 생성 분기 ──────────────────────────────────────

    @Test
    @DisplayName("null → 신규 세션 생성, 제목 '새 채팅 1'")
    void null_creates_new_session() {
        ChatSessionKeyResolver.Result result = resolver.resolve(user.getId(), null);

        assertThat(result.sessionKey()).isNotBlank();
        assertThat(result.chatSession()).isNotNull();
        assertThat(result.chatSession().getTitle()).isEqualTo("새 채팅 1");
        assertThat(result.chatSession().getUser().getId()).isEqualTo(user.getId());
        assertThat(result.chatSession().getAnalysis()).isNull();
    }

    @Test
    @DisplayName("빈 문자열 → 신규 세션 생성")
    void blank_creates_new_session() {
        ChatSessionKeyResolver.Result result = resolver.resolve(user.getId(), "  ");

        assertThat(result.sessionKey()).isNotBlank();
        assertThat(result.chatSession().getTitle()).startsWith("새 채팅");
    }

    @Test
    @DisplayName("\"new-session\" → 신규 세션 생성")
    void new_session_literal_creates() {
        ChatSessionKeyResolver.Result result = resolver.resolve(user.getId(), "new-session");

        assertThat(result.sessionKey()).isNotBlank();
        assertThat(result.chatSession().getTitle()).startsWith("새 채팅");
    }

    // ── resolve: analysisId 분기 ──────────────────────────────────────────

    @Test
    @DisplayName("analysisId(숫자) → 분석 기반 세션 생성, 제목 '{grade}등급 분석 채팅'")
    void analysisId_creates_session_from_analysis() {
        Analysis analysis = analysisRepository.save(Analysis.builder()
                .user(user)
                .gcsUrl("gs://test/image.png")
                .imageUrl("https://test/image.png")
                .analysisType("PRACTICAL")
                .build());
        analysis.complete(AnalysisGrade.A, 85.0, "{}", FixScope.DetailTuning, "좋아요", "[]");
        analysisRepository.save(analysis);

        ChatSessionKeyResolver.Result result = resolver.resolve(user.getId(), analysis.getId().toString());

        assertThat(result.sessionKey()).isNotBlank();
        assertThat(result.chatSession().getAnalysis().getId()).isEqualTo(analysis.getId());
        assertThat(result.chatSession().getTitle()).isEqualTo("A등급 분석 채팅");
    }

    @Test
    @DisplayName("같은 analysisId 재전송 → 기존 세션 재사용 (중복 생성 없음)")
    void same_analysisId_reuses_session() {
        Analysis analysis = analysisRepository.save(Analysis.builder()
                .user(user)
                .gcsUrl("gs://test/reuse.png")
                .imageUrl("https://test/reuse.png")
                .analysisType("PRACTICAL")
                .build());

        ChatSessionKeyResolver.Result first = resolver.resolve(user.getId(), analysis.getId().toString());
        ChatSessionKeyResolver.Result second = resolver.resolve(user.getId(), analysis.getId().toString());

        assertThat(second.sessionKey()).isEqualTo(first.sessionKey());
        assertThat(second.chatSession().getId()).isEqualTo(first.chatSession().getId());
    }

    @Test
    @DisplayName("존재하지 않는 analysisId → ANALYSIS_NOT_FOUND 예외")
    void nonexistent_analysisId_throws() {
        assertThatThrownBy(() -> resolver.resolve(user.getId(), "999999"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("분석 결과를 찾을 수 없습니다");
    }

    // ── resolve: sessionKey(UUID) 분기 ────────────────────────────────────

    @Test
    @DisplayName("기존 sessionKey(UUID) → 기존 세션 반환")
    void existing_uuid_returns_session() {
        ChatSessionKeyResolver.Result created = resolver.resolve(user.getId(), null);
        String sessionKey = created.sessionKey();

        ChatSessionKeyResolver.Result found = resolver.resolve(user.getId(), sessionKey);

        assertThat(found.sessionKey()).isEqualTo(sessionKey);
        assertThat(found.chatSession().getId()).isEqualTo(created.chatSession().getId());
    }

    @Test
    @DisplayName("존재하지 않는 UUID → 신규 세션 생성 (fallback)")
    void unknown_uuid_creates_new() {
        String unknownUuid = UUID.randomUUID().toString();

        ChatSessionKeyResolver.Result result = resolver.resolve(user.getId(), unknownUuid);

        assertThat(result.sessionKey()).isNotEqualTo(unknownUuid);
        assertThat(result.chatSession()).isNotNull();
    }

    // ── 제목 순번 ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("순번 제목: 세션 2개 생성 시 '새 채팅 1', '새 채팅 2'")
    void sequential_title_numbering() {
        ChatSessionKeyResolver.Result first = resolver.resolve(user.getId(), null);
        ChatSessionKeyResolver.Result second = resolver.resolve(user.getId(), "new-session");

        assertThat(first.chatSession().getTitle()).isEqualTo("새 채팅 1");
        assertThat(second.chatSession().getTitle()).isEqualTo("새 채팅 2");
    }

    @Test
    @DisplayName("grade null인 분석 → 제목 '분석 채팅'")
    void analysis_without_grade_fallback_title() {
        Analysis analysis = analysisRepository.save(Analysis.builder()
                .user(user)
                .gcsUrl("gs://test/no-grade.png")
                .imageUrl("https://test/no-grade.png")
                .analysisType("PRACTICAL")
                .build());
        // grade 미설정 (PENDING 상태)

        ChatSessionKeyResolver.Result result = resolver.resolve(user.getId(), analysis.getId().toString());

        assertThat(result.chatSession().getTitle()).isEqualTo("분석 채팅");
    }
}
