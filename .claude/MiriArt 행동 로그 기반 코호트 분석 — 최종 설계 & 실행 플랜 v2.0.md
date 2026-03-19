# MiriArt 행동 로그 기반 코호트 분석 — 최종 설계 & 실행 플랜 v2.0

**버전**: v2.0 (코드베이스 검증 후 확정)
**작성일**: 2026-03-19
**상태**: ✅ 실행 가능 (Flyway DDL + BE/FE/AI 인스트루먼트 구현 대기 중)
**관련 문서**: `MiriArt_ERD_v2.md` / `miriart-ai-api.md` / `miriarts_infra.md`
**코드베이스 검증 대상**: `miriart-be` (Spring Boot) / `miriart-fe` (React+Vite) / `miriart-ai` (FastAPI)

***

## 0. 코드베이스 검증 결과 요약 (v1.0 → v2.0 변경 반영)

v1.0 설계와 실제 코드베이스 사이에서 확인된 **핵심 차이 3가지**를 반영하여 설계를 확정한다.

| 항목 | v1.0 설계 가정 | v2.0 확정 (코드베이스 기준) |
|------|---------------|--------------------------|
| `chatmessages` 테이블 | MySQL에 존재한다고 가정 | **없음**. 메시지는 Redis 전용 (`AiProxyService.updateSessionHistory`) |
| `/app/upload` 라우트 | 별도 페이지로 가정 | **없음**. `openModal('UPLOAD_FLOW')` 모달 진입 — PAGE_VIEW 대상 아님 |
| AI 쪽 로그/저장 | 일부 AI에서 메타 저장 고려 | **완전 stateless**. 코호트/리텐션 저장은 100% BE+MySQL |

***

## 1. 목적 및 분석 축

무작위 배포(β 런치) 이후 유저 행동 데이터 기반으로 아래 세 축을 교차 분석하여, **BM 검증**과 **기능 개선 우선순위 결정**에 활용한다.

1. **질문 유형**: 유저가 AI에게 어떤 고민을 던지는가 (CAREER / ARTWORK_REVISION / PORTFOLIO_STRATEGY / EXAM_PREP)
2. **대화 깊이**: 세션당 메시지 수, 지속 시간, 재질문 패턴
3. **리텐션/재사용**: 재방문율, 재업로드율, 재챗 시작율

***

## 2. 데이터 소스 확정

### 2.1 기존 테이블 (변경 불필요)

| 테이블 | 엔티티 파일 | 분석 활용 |
|--------|------------|----------|
| `users` | `domain/user/entity/User.java` | 유저 메타, 구글 계정(`email`, `provider`, `providerUserId`), `grade`, `planType` |
| `analyses` | `domain/analysis/entity/Analysis.java` | 분석 결과 — `grade`, `totalScore`, `status`, `analysisType` |
| `chat_sessions` | `domain/chat/entity/ChatSession.java` | 세션 깊이 — `messageCount`, `lastMessage`, `modelType` |
| `analysis_usage_logs` | `domain/analysis/entity/AnalysisUsageLog.java` | 크레딧 소모 이력 |

> **채팅 메시지 원문**: `chat_sessions` 엔티티 자체에는 없고, Redis에 JSON 배열로 저장됨.  
> 질문 텍스트 샘플링은 **`AiProxyService.chat`** 레벨에서 USER 메시지를 이벤트 `extra.truncated_content`에 싣는 방식으로 처리한다.

### 2.2 신규 테이블 — `user_events` (Flyway V7)

```sql
-- V7__create_user_events.sql
CREATE TABLE user_events (
  id          BIGINT        NOT NULL AUTO_INCREMENT,
  user_id     BIGINT        NULL,
  session_key VARCHAR(64)   NULL,
  event_type  VARCHAR(50)   NOT NULL,
  page        VARCHAR(100)  NULL,
  referrer    VARCHAR(200)  NULL,
  related_id  BIGINT        NULL,
  error_code  VARCHAR(20)   NULL,
  extra       JSON          NULL,
  created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX idx_user_created   (user_id, created_at),
  INDEX idx_event_created  (event_type, created_at),
  INDEX idx_session_key    (session_key, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 2.3 신규 테이블 — `user_cohorts` (Flyway V8)

```sql
-- V8__create_user_cohorts.sql
CREATE TABLE user_cohorts (
  id                   BIGINT      NOT NULL AUTO_INCREMENT,
  user_id              BIGINT      NOT NULL UNIQUE,
  first_topic          VARCHAR(30) NULL,
  first_analysis_grade CHAR(1)     NULL,
  first_visit_date     DATE        NULL,
  first_chat_date      DATE        NULL,
  first_upload_date    DATE        NULL,
  created_at           DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX idx_topic       (first_topic),
  INDEX idx_first_visit (first_visit_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

***

## 3. 이벤트 타입 정의 (확정)

| 이벤트 타입 | 발생 시점 | `related_id` | `extra` 핵심 필드 | 처리 방식 |
|-------------|----------|-------------|-----------------|----------|
| `PAGE_VIEW` | FE 페이지 마운트 | — | `page`, `referrer`, `session_key` | FE → `POST /api/events` (비인증 허용) |
| `ANALYSIS_UPLOADED` | `AnalysisFailHandler.savePending` 직후 | `analysis_id` | `analysis_type` | BE 비동기 @Async |
| `ANALYSIS_COMPLETED` | `AnalysisFailHandler.complete` 직후 | `analysis_id` | `grade`, `total_score` | BE 비동기 @Async |
| `CHAT_STARTED` | 새 `chat_session` 생성 시 | `chat_session_id` | `model_type`, `analysis_id` | BE 비동기 @Async |
| `CHAT_MESSAGE_SENT` | `ChatSessionService.chat` → `applyMessage` + save 직후 | `chat_session_id` | `model_type`, `truncated_content`(앞 80자) | BE 비동기 @Async |
| `ERROR_OCCURRED` | `GlobalExceptionHandler` 각 핸들러 | — | `path`, `http_status`, `error_code` | BE 동기 (경량 INSERT) |

> **TX 격리 원칙**: `ANALYSIS_UPLOADED`, `ANALYSIS_COMPLETED`는 `AnalysisFailHandler`의 `@Transactional` 경계 밖에서 실행해야 한다. 이벤트 INSERT 실패가 분석 롤백을 유발하면 안 된다.

***

## 4. 질문 유형(Question Topic) 라벨링

### 4.1 1차 카테고리 (규칙 기반, 즉시 적용 가능)

| 코드 | 설명 | 트리거 키워드 |
|------|------|-------------|
| `CAREER_SCHOOL` | 진로/학교/전형/학과 선택 | 진로, 진학, 학교, 대학, 학과, 입시, 전형, 지원 |
| `ARTWORK_REVISION` | 작품 수정·피드백 요청 | 수정, 고쳐, 보완, 피드백, 디테일, 완성도, 다시 |
| `PORTFOLIO_STRATEGY` | 포트폴리오 구성·기획·전략 | 포트폴리오, 포폴, 구성, 기획, 시리즈, 작품 수 |
| `EXAM_PREP` | 실기 대비·시간 관리 | 모의, 실기, 시간, 일정, 훈련, 준비 |
| `OTHER` | 분류 불가 | — |

### 4.2 라벨링 흐름

```
CHAT_MESSAGE_SENT 이벤트 발생 시
  └─ extra.truncated_content (USER 메시지 앞 80자)
       └─ 야간 배치(Scheduler) → 키워드 매칭 → user_cohorts.first_topic UPDATE
```

- 중기: Redis에서 채팅 히스토리 조회 → 임베딩 기반 분류기 또는 Gemini Flash 호출로 대체
- 개인정보 주의: `truncated_content`는 앞 80자만, 이름·연락처 패턴 필터링 적용

***

## 5. 핵심 지표 정의

### 5.1 대화 깊이

| 지표 | 소스 | 비고 |
|------|------|------|
| `message_count` | `chat_sessions.message_count` | `applyMessage` 호출 시 +1 |
| `user_msg_count` | `user_events WHERE event_type='CHAT_MESSAGE_SENT'` 세션별 COUNT | |
| `session_duration_min` | 세션 첫/마지막 `CHAT_MESSAGE_SENT` 이벤트 시간 차 | |
| `sessions_per_user` | `chat_sessions` 유저별 COUNT | |

### 5.2 리텐션/재사용

| 지표 | 정의 |
|------|------|
| D+1 재방문율 | 첫 방문일 기준 +1일 이내 `PAGE_VIEW` 또는 인증 이벤트가 있는 유저 비율 |
| D+7 재방문율 | 첫 방문일 기준 +7일 이내 재방문 비율 |
| D+30 재방문율 | 첫 방문일 기준 +30일 이내 재방문 비율 |
| 재업로드율 | 첫 업로드 후 N일 이내 `ANALYSIS_UPLOADED` ≥ 2회 유저 비율 |
| 재챗율 | 첫 챗 후 N일 이내 `CHAT_STARTED` ≥ 2회 유저 비율 |
| 아카이브 조회율 | `PAGE_VIEW WHERE page='/app/archive'` 이력 유저 비율 |

***

## 6. 코호트 정의

| 코호트 | 기준 |
|--------|------|
| CAREER_SCHOOL | `user_cohorts.first_topic = 'CAREER_SCHOOL'` |
| ARTWORK_REVISION | `user_cohorts.first_topic = 'ARTWORK_REVISION'` |
| PORTFOLIO_STRATEGY | `user_cohorts.first_topic = 'PORTFOLIO_STRATEGY'` |
| EXAM_PREP | `user_cohorts.first_topic = 'EXAM_PREP'` |

**2차 교차 축** (선택):
- 첫 분석 등급: A/B 우수군 vs C/D/F 미흡군
- `plan_type`: FREE vs BASIC vs PREMIUM
- 유입 채널: `referrer` 기반 (`?ref=설문A`, `?ref=SNS_X` 등)

***

## 7. 가설 목록 (H1~H5)

### H1. 작품수정 코호트 — 세션 깊이 최고

- **가설**: `ARTWORK_REVISION` 코호트의 `message_count` 및 `session_duration_min` 평균이 가장 높다.
- **맞다면**: 비교보기, 이전 버전 diff, 리비전 히스토리 기능 우선 개발.
- **틀리다면**: 진로 상담형 구조화 응답 UI 강화 검토.

### H2. 진로/학교 코호트 — D+30 리텐션 최고

- **가설**: `CAREER_SCHOOL`은 초기 깊이가 낮더라도 D+30 재방문율이 가장 높다.
- **맞다면**: 진로 로드맵, 관심 학교 즐겨찾기, 좋아요 답변 모음 기능 도입.
- **틀리다면**: 진로 코호트 이탈 이유 심층 인터뷰.

### H3. 포트폴리오 전략 코호트 — 업로드 수 최고

- **가설**: `PORTFOLIO_STRATEGY` 코호트의 평균 분석 업로드 수가 가장 높고, FREE 플랜 한도에 가장 빨리 도달한다.
- **맞다면**: 포트폴리오 단위 관리 + 중/고가 플랜 설계, 업셀 CTA 도입.
- **틀리다면**: 무료 플랜 한도 상향 또는 단건 소액 결제 옵션 검토.

### H4. 낮은 점수 + 작품수정 질문 유저 — 재사용율 최고

- **가설**: 첫 분석 `grade` C/D/F이면서 `ARTWORK_REVISION` 질문을 한 유저가, 같은 점수군 타 토픽 유저보다 재업로드/재챗 비율이 높다.
- **맞다면**: 낮은 점수 유저에게 작품수정 챗 자동 CTA 삽입.
- **틀리다면**: 낮은 점수 후 이탈 방지 온보딩 개선.

### H5. 대화 깊이 상위 — 리텐션 고상관

- **가설**: 토픽과 무관하게, 첫 세션 `depth_score` 상위 30% 유저의 D+7 리텐션이 하위 30%보다 유의미하게 높다.
- **맞다면**: AI의 적극적 follow-up 질문, 구조화된 첫 챗 가이드 실험.
- **틀리다면**: 분석 결과 품질이 리텐션에 더 중요한지 다음 가설로 분기.

***

## 8. 구체 실행 태스크 (BE / FE / AI별)

***

### 8-A. BE 실행 태스크

#### Task BE-1. Flyway 마이그레이션 추가

- **파일**: `src/main/resources/db/migration/V7__create_user_events.sql`, `V8__create_user_cohorts.sql`
- **내용**: 섹션 2.2, 2.3의 DDL 그대로 적용
- **주의**: prod `ddl-auto=validate` 이므로 마이그레이션 전 개발 DB에서 검증 필수

#### Task BE-2. UserEvent 엔티티/리포지토리 생성

```java
// domain/event/entity/UserEvent.java
@Entity @Table(name = "user_events")
@NoArgsConstructor(access = PROTECTED)
public class UserEvent {
    @Id @GeneratedValue(strategy = IDENTITY)
    private Long id;
    private Long userId;
    private String sessionKey;
    @Column(nullable = false, length = 50)
    private String eventType;
    private String page;
    private String referrer;
    private Long relatedId;
    private String errorCode;
    @Column(columnDefinition = "JSON")
    private String extra;             // ObjectMapper로 직렬화
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() { this.createdAt = LocalDateTime.now(); }

    public static UserEvent of(String eventType, Long userId, String sessionKey,
                               Long relatedId, Map<String, Object> extra) { ... }
}
```

```java
// domain/event/repository/UserEventRepository.java
public interface UserEventRepository extends JpaRepository<UserEvent, Long> { }
```

#### Task BE-3. EventLoggingService 생성 (비동기 전담)

```java
// domain/event/service/EventLoggingService.java
@Service @RequiredArgsConstructor
public class EventLoggingService {

    private final UserEventRepository userEventRepository;
    private final ObjectMapper objectMapper;

    @Async                          // @EnableAsync 전제
    @Transactional(propagation = REQUIRES_NEW)   // 별도 TX
    public void log(String eventType, Long userId, String sessionKey,
                    Long relatedId, Map<String, Object> extra) {
        try {
            UserEvent event = UserEvent.of(eventType, userId, sessionKey,
                                           relatedId, extra);
            userEventRepository.save(event);
        } catch (Exception e) {
            log.warn("EventLogging failed: type={}, userId={}", eventType, userId, e);
            // 실패해도 상위 비즈니스 로직에 영향 없음
        }
    }
}
```

#### Task BE-4. 인스트루먼트 — 분석 이벤트

**위치**: `AnalysisService.startAnalysis` 내부 — `savePending` 직후, `complete` 직후, `markFailed` 직후.

```java
// AnalysisService.startAnalysis() 변경 포인트
// 1) savePending 직후
analysisFailHandler.savePending(user, gcsUrl, imageUrl, analysisType, problemText);
eventLoggingService.log("ANALYSIS_UPLOADED", userId, null,
    analysis.getId(), Map.of("analysis_type", analysisType));

// 2) complete 직후
analysisFailHandler.complete(analysis, aiResponse);
eventLoggingService.log("ANALYSIS_COMPLETED", userId, null,
    analysis.getId(), Map.of("grade", aiResponse.getGrade(),
                              "total_score", aiResponse.getTotalScore()));

// 3) markFailed 직후
analysisFailHandler.markFailed(analysis, e.getMessage());
eventLoggingService.log("ERROR_OCCURRED", userId, null, null,
    Map.of("path", "/api/analyses", "http_status", 500,
           "error_code", "AN001"));
```

#### Task BE-5. 인스트루먼트 — 챗 이벤트

**위치**: `ChatSessionService.chat` 내 `applyMessage` + save 직후.

```java
// ChatSessionService.chat() 변경 포인트
chatSessionRepository.save(session);   // 기존

// CHAT_STARTED: 새 세션 생성 시에만
if (isNewSession) {
    eventLoggingService.log("CHAT_STARTED", userId, request.getSessionKey(),
        session.getId(), Map.of("model_type", session.getModelType(),
                                 "analysis_id", session.getAnalysis() != null
                                     ? session.getAnalysis().getId() : null));
}

// CHAT_MESSAGE_SENT: 매 메시지마다
String truncated = request.getMessage().length() > 80
    ? request.getMessage().substring(0, 80) : request.getMessage();
eventLoggingService.log("CHAT_MESSAGE_SENT", userId, request.getSessionKey(),
    session.getId(), Map.of("model_type", session.getModelType(),
                             "truncated_content", truncated));
```

#### Task BE-6. 인스트루먼트 — ERROR_OCCURRED

**위치**: `GlobalExceptionHandler.handleBusinessException`, `handleException`.

```java
// GlobalExceptionHandler 변경 포인트
@ExceptionHandler(BusinessException.class)
public ResponseEntity<ErrorResponse> handleBusinessException(
        BusinessException e, HttpServletRequest req) {
    log.warn("BusinessException: {}", e.getMessage());
    eventLoggingService.log("ERROR_OCCURRED",
        extractUserId(req), null, null,
        Map.of("path", req.getRequestURI(),
               "http_status", e.getErrorCode().getStatus().value(),
               "error_code",  e.getErrorCode().getCode()));
    return ResponseEntity.status(e.getErrorCode().getStatus())
                         .body(ErrorResponse.of(e.getErrorCode()));
}

// extractUserId: SecurityContextHolder에서 principal 꺼냄 (null 허용)
private Long extractUserId(HttpServletRequest req) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.getPrincipal() instanceof Long userId) return userId;
    return null;
}
```

#### Task BE-7. EventsController 추가 (FE PAGE_VIEW 수신용)

```java
// domain/event/controller/EventsController.java
@RestController @RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventsController {

    private final EventLoggingService eventLoggingService;

    @PostMapping
    public ResponseEntity<Void> logEvent(
            @AuthenticationPrincipal Long userId,
            @RequestBody @Valid TrackEventRequest req) {

        eventLoggingService.log(req.getEventType(), userId,
                                req.getSessionKey(), null,
                                Map.of("page", req.getPage(),
                                       "referrer", Optional.ofNullable(req.getReferrer()).orElse("")));
        return ResponseEntity.ok().build();
    }
}
```

SecurityConfig에서 `POST /api/events` → `permitAll()` 추가 필요.

#### Task BE-8. user_cohorts 집계 배치 잡

```java
// domain/event/scheduler/CohortBatchScheduler.java
@Scheduled(cron = "0 30 2 * * *")   // 매일 새벽 2:30
@Transactional
public void aggregateCohorts() {
    // 1) user_cohorts에 없는 userId 중 user_events 있는 유저 INSERT
    // 2) first_visit_date, first_chat_date, first_upload_date 채우기
    // 3) first_topic: CHAT_MESSAGE_SENT extra.truncated_content → 키워드 매칭
}
```

***

### 8-B. FE 실행 태스크

#### Task FE-1. sessionKey 유틸 생성

```typescript
// src/shared/lib/sessionKey.ts
const SESSION_KEY = 'miriart_session_key';

export function getSessionKey(): string {
  let key = sessionStorage.getItem(SESSION_KEY);
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, key);
  }
  return key;
}
```

#### Task FE-2. EventsApi 추가 (miriartApi.ts에 추가)

```typescript
// src/shared/api/miriartApi.ts 하단에 추가
export interface TrackEventPayload {
  eventType: 'PAGE_VIEW';
  sessionKey: string;
  page: string;
  referrer?: string;
}

export const EventsApi = {
  track: async (payload: TrackEventPayload): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // fire-and-forget: 실패해도 앱 동작에 영향 없음
    } catch {
      // 무시
    }
  },
};
```

> `apiFetch` 대신 **날 fetch** 사용 — 401 리프레시 인터셉터가 PAGE_VIEW에 붙으면 불필요한 토큰 갱신이 트리거될 수 있으므로 분리한다.

#### Task FE-3. usePageView 훅 생성

```typescript
// src/shared/hooks/usePageView.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EventsApi } from '../api/miriartApi';
import { getSessionKey } from '../lib/sessionKey';

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    EventsApi.track({
      eventType: 'PAGE_VIEW',
      sessionKey: getSessionKey(),
      page: location.pathname,
      referrer: document.referrer || undefined,
    });
  }, [location.pathname]);
}
```

#### Task FE-4. 페이지별 usePageView 삽입

전역 훅으로 관리하려면 `App.tsx` 또는 `AppRouter.tsx` 최상단에서 한 번 호출.  
페이지별 삽입이 명확하다면 아래 각 파일의 컴포넌트 최상단에 추가.

| 파일 | 페이지 경로 |
|------|------------|
| `src/pages/auth/Login.tsx` | `/auth/login` |
| `src/pages/home/ui/Page.tsx` | `/app/home` |
| `src/pages/archive/ui/Page.tsx` | `/app/archive` |
| `src/pages/chat-list/ui/Page.tsx` | `/app/chat` |
| `src/pages/chat-room/ui/Page.tsx` | `/chat/:sessionKey` |
| `src/pages/result-detail/ui/Page.tsx` | `/result/:artworkId` |
| `src/pages/profile/ui/Page.tsx` | `/app/profile` |

**권장**: `AppRouter.tsx`에서 전역 훅 방식 사용 — 한 곳에서 관리, 누락 위험 최소화.

```typescript
// src/app/routers/AppRouter.tsx 상단에 추가
export function AppRouter() {
  usePageView();   // ← 이 한 줄로 모든 라우트 변경 시 PAGE_VIEW 자동 기록
  return (
    <Routes>
      ...
    </Routes>
  );
}
```

***

### 8-C. AI (FastAPI) 실행 태스크

AI 서비스는 완전 stateless이므로 이번 코호트/리텐션 설계에서 **구조 변경 없음**.  
아래 두 가지만 점진적으로 적용 가능.

#### Task AI-1. 서비스 메타 로그 보강 (선택)

`app/services/analyze_service.py`, `chat_service.py`에서 이미 서비스별 메타를 로깅 중.  
추가 시 메타 필드만 확장 — `userId`, `analysisId`를 BE가 요청에 포함하면 AI 로그에도 찍어둘 수 있음. **요청 바디 전체 로깅은 PII 위험으로 하지 않는다.**

#### Task AI-2. 응답 스키마 확장 — 중기 검토

`InternalChatResponse`에 `topic: str | None` 또는 `meta: dict` 필드 추가하면, AI가 대화 토픽을 직접 추론해 BE로 전달 가능.  
**단, `call_gemini()` 55s 타임아웃 경계 안에서 동기 추가 호출 금지.**  
중기에 별도 `/internal/ai/classify-topic` 엔드포인트로 분리하는 것이 안전하다.

***

## 9. 분석 쿼리 레퍼런스

### 9.1 일별 방문자/전환 현황

```sql
SELECT
  DATE(created_at) AS day,
  COUNT(DISTINCT session_key) AS visitors,
  COUNT(DISTINCT user_id) AS logged_in_users
FROM user_events
WHERE event_type = 'PAGE_VIEW'
GROUP BY DATE(created_at)
ORDER BY day DESC;
```

### 9.2 코호트별 D+1 / D+7 리텐션

```sql
WITH first_visit AS (
  SELECT uc.user_id, uc.first_topic,
         MIN(DATE(ue.created_at)) AS first_day
  FROM user_events ue
  JOIN user_cohorts uc ON ue.user_id = uc.user_id
  WHERE ue.event_type = 'PAGE_VIEW'
  GROUP BY uc.user_id, uc.first_topic
),
d1 AS (
  SELECT DISTINCT fv.user_id, fv.first_topic
  FROM first_visit fv
  JOIN user_events ue ON fv.user_id = ue.user_id
  WHERE DATE(ue.created_at) = DATE_ADD(fv.first_day, INTERVAL 1 DAY)
),
d7 AS (
  SELECT DISTINCT fv.user_id, fv.first_topic
  FROM first_visit fv
  JOIN user_events ue ON fv.user_id = ue.user_id
  WHERE DATE(ue.created_at)
    BETWEEN DATE_ADD(fv.first_day, INTERVAL 2 DAY)
        AND DATE_ADD(fv.first_day, INTERVAL 7 DAY)
)
SELECT
  fv.first_topic,
  COUNT(DISTINCT fv.user_id)  AS cohort_size,
  ROUND(COUNT(DISTINCT d1.user_id) / COUNT(DISTINCT fv.user_id) * 100, 1) AS d1_pct,
  ROUND(COUNT(DISTINCT d7.user_id) / COUNT(DISTINCT fv.user_id) * 100, 1) AS d7_pct
FROM first_visit fv
LEFT JOIN d1 ON fv.user_id = d1.user_id
LEFT JOIN d7 ON fv.user_id = d7.user_id
GROUP BY fv.first_topic;
```

### 9.3 토픽별 평균 세션 깊이

```sql
SELECT
  uc.first_topic,
  ROUND(AVG(cs.message_count), 1) AS avg_msg_count,
  COUNT(DISTINCT cs.id)           AS total_sessions
FROM chat_sessions cs
JOIN user_cohorts uc ON cs.user_id = uc.user_id
GROUP BY uc.first_topic
ORDER BY avg_msg_count DESC;
```

### 9.4 H4 검증 — 낮은 점수 + 토픽별 재사용율

```sql
WITH low_grade AS (
  SELECT a.user_id, uc.first_topic
  FROM analyses a
  JOIN user_cohorts uc ON a.user_id = uc.user_id
  WHERE a.grade IN ('C','D','F')
    AND a.id = (SELECT MIN(id) FROM analyses WHERE user_id = a.user_id)
),
reused AS (
  SELECT user_id FROM user_events
  WHERE event_type IN ('ANALYSIS_UPLOADED','CHAT_STARTED')
  GROUP BY user_id HAVING COUNT(*) >= 2
)
SELECT
  lg.first_topic,
  COUNT(DISTINCT lg.user_id) AS low_grade_users,
  ROUND(COUNT(DISTINCT r.user_id) / COUNT(DISTINCT lg.user_id) * 100, 1) AS reuse_pct
FROM low_grade lg
LEFT JOIN reused r ON lg.user_id = r.user_id
GROUP BY lg.first_topic;
```

### 9.5 개별 유저 드릴다운 (운영/CS 조회)

```sql
-- 구글 계정 포함 유저 기본 정보
SELECT id, provider, provider_user_id, email, nickname,
       grade, domain, plan_type, reputation_score, created_at
FROM users
WHERE email = 'user@gmail.com';   -- 또는 nickname LIKE '%검색어%'

-- 해당 유저 분석 이력
SELECT id, analysis_type, grade, total_score, status, created_at
FROM analyses
WHERE user_id = :userId
ORDER BY created_at DESC;

-- 해당 유저 챗 세션 + 메시지 원문 (Redis 기반 history는 별도 조회)
SELECT cs.id AS session_id, cs.session_key, cs.model_type,
       cs.message_count, cs.last_message, cs.created_at,
       ue.event_type, ue.extra, ue.created_at AS event_at
FROM chat_sessions cs
LEFT JOIN user_events ue ON cs.id = ue.related_id
  AND ue.event_type = 'CHAT_MESSAGE_SENT'
WHERE cs.user_id = :userId
ORDER BY cs.created_at DESC, ue.created_at ASC;
```

***

## 10. 배포 전 체크리스트

| 체크 | 항목 | 담당 |
|------|------|------|
| ☐ | V7/V8 Flyway 마이그레이션 dev 환경 검증 | BE |
| ☐ | prod DB 스키마와 기존 엔티티 불일치 없는지 확인 (`ddl-auto=validate`) | BE |
| ☐ | `@EnableAsync` 설정 확인 (EventLoggingService @Async 전제) | BE |
| ☐ | EventLoggingService 내 try-catch로 이벤트 실패가 비즈니스 로직에 전파되지 않는지 테스트 | BE |
| ☐ | `POST /api/events` SecurityConfig `permitAll()` 추가 | BE |
| ☐ | `CHAT_STARTED` 이벤트 중복 발생 없는지 확인 (새 세션 생성 분기에서만 호출) | BE |
| ☐ | FE `usePageView` 훅이 리렌더링 시 중복 호출되지 않는지 확인 (deps: `location.pathname`) | FE |
| ☐ | `EventsApi.track` 실패 시 앱 동작 영향 없는지 확인 | FE |
| ☐ | `truncated_content` 80자 제한 + PII 필터 (이름/연락처 패턴 제거) | BE |
| ☐ | Connection pool 10 기준 이벤트 INSERT 부하 측정 (부하 테스트 optional) | BE |
| ☐ | 배치 스케줄러(`CohortBatchScheduler`) prod 환경에서 단일 인스턴스 실행 보장 | BE |

***

## 11. 실행 타임라인

| 단계 | 태스크 | 담당 | 목표 |
|------|--------|------|------|
| **D-3** | V7/V8 Flyway DDL 작성 + UserEvent 엔티티/리포지토리 | BE | 배포 3일 전 |
| **D-3** | EventLoggingService + @Async 설정 | BE | 동일 |
| **D-2** | AnalysisService/ChatSessionService/GlobalExceptionHandler 인스트루먼트 | BE | 배포 2일 전 |
| **D-2** | EventsController (`POST /api/events`) + SecurityConfig 수정 | BE | 동일 |
| **D-2** | FE `sessionKey` 유틸 + `EventsApi` + `usePageView` 훅 | FE | 동일 |
| **D-2** | `AppRouter.tsx`에 `usePageView()` 단일 삽입 | FE | 동일 |
| **D-1** | dev 환경 end-to-end 이벤트 흐름 검증 | BE+FE | 배포 1일 전 |
| **D+0** | 무작위 배포 링크 배포 (`?ref=설문A`, `?ref=SNS_X` 파라미터 포함) | CEO | 배포 당일 |
| **D+3** | `CohortBatchScheduler` 첫 실행 — `user_cohorts` 집계 확인 | BE | 배포 후 3일 |
| **D+7** | D+1/D+7 리텐션 첫 측정, 이벤트 적재 현황 점검 | CTO | 배포 후 1주 |
| **D+14~21** | H1~H5 가설 검증 쿼리 실행 + 결과 정리 | CTO | 배포 후 2~3주 |
| **D+21** | BM/기능 개선 의사결정 (선택지 A~G 중 단기 실험 선정) | CEO/CTO | 배포 후 3주 |
| **D+30+** | 임베딩 기반 토픽 분류기 도입 검토 | BE/AI | 중기 |

***

## 12. BM/기능 개선 의사결정 포인트

| 가설 검증 결과 | BM 선택지 | 기능 선택지 |
|--------------|----------|------------|
| H3 맞음 | A: 포트폴리오 단위 관리 + 중/고가 플랜 | E: 다중 작품 비교·시리즈 관리 기능 |
| H3 맞음 | B: "프로 플랜으로 N장 추가" 업셀 CTA | |
| H1/H4 맞음 | C: 리비전 패스 (반복 피드백 할인형) | F: 비교보기, 이전 버전 diff, 리비전 히스토리 |
| H1/H4 맞음 | D: 낮은 점수 유저 자동 작품수정 챗 CTA | |
| H2 맞음 | | G: 진로 로드맵, 관심 학교 즐겨찾기, 좋아요 답변 모음 |
| 특정 플로우 에러 집중 | | H: 해당 플로우 UI/에러 메시지 개선 |

***

## 13. 한계 및 유의사항

- **샘플 편향**: 배포 채널이 특정 커뮤니티에 쏠리면 코호트 분포가 실제 TAM을 대표하지 않는다. `referrer` 파라미터로 채널을 분리해 해석한다.
- **Redis 메시지 원문 접근**: 채팅 메시지 전문은 MySQL에 없다. 질문 텍스트 분석은 `truncated_content`(80자)로만 가능하며, 이 한계를 보완하려면 중기에 AI에서 토픽을 추론해 BE로 넘기는 스키마 확장이 필요하다.
- **소표본 리스크**: β 초기 코호트당 유저 수가 작으면 통계적 유의성이 낮다. 방향성 참고 수준으로 해석하고, 충분한 샘플이 쌓인 뒤 최종 의사결정을 한다.
- **PII 처리**: `truncated_content`에 이름·연락처·학교명 등 개인식별 정보가 포함될 수 있다. 배치 처리 시 정규식 기반 마스킹을 적용한다.
- **이벤트 INSERT 부하**: `CHAT_MESSAGE_SENT`는 고빈도 이벤트다. 커넥션 풀(10) 대비 삽입 빈도를 모니터링하고, 필요 시 별도 이벤트 DB 인스턴스 또는 비동기 큐 도입을 검토한다.
- **스케줄러 중복 실행**: Cloud Run 다중 인스턴스 환경에서 `CohortBatchScheduler`가 중복 실행될 수 있다. ShedLock 또는 Cloud Scheduler + 단일 job으로 대체를 검토한다.

***

*최종 업데이트: 2026-03-19*
*다음 리뷰: β 배포 후 D+14 (1차 리텐션 데이터 확보 시점)*
*이전 버전: v1.0 (초안, 코드베이스 검증 전)*