# MiriArt BE API 계약

이 문서는 FE ↔ BE API 계약을 정리합니다.

---

## 인증 실패 (401)

인증이 필요한 경로에 `Authorization` 헤더 없이 접근 시 **401 Unauthorized**. Body: `{"code":"AUTH009","message":"인증이 필요합니다."}` (JSON). *소스: SecurityConfig.java:79-80 (ErrorCode.AUTH_REQUIRED).* 상세 인증·CORS는 ../infra/miriarts_infra.md §4.2 참조.

---

## 이미지 Signed URL

### GET /api/images/{id}/url

- **Path**: `{id}` = analysisId (분석 결과에 연결된 이미지)
- **Auth**: Bearer JWT (로그인 필수)
- **Response 200**:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://storage.googleapis.com/miriart-bucket/artworks/...?X-Goog-Signature=...",
      "expiresAt": "2026-03-10T10:15:00Z"
    }
  }
  ```
- **Error**:
  - **404** I001 IMAGE_NOT_FOUND — 해당 분석이 없거나 본인 소유가 아님
  - **502** F005 IMAGE_URL_GENERATION_FAILED — GCS Signed URL 생성 실패
- **Note**:
  - `url`은 약 15분간 유효한 GCS v4 Signed URL이다.
  - FE는 이미지 표시 시 항상 이 엔드포인트를 통해 받은 `url`만 사용해야 한다.
  - 분석 결과 등에서 AI/내부적으로 사용하는 `imageUrl`(또는 기존 public URL)은 **BE 내부/메타 용도**이며, GCS 버킷은 비공개(403)이므로 Signed URL이 유일한 접근 경로이다.

---

## 목록 API 페이징·정렬

| API | page 기본값 | size 기본값 | size 상한 | sort 기본 | 소스(파일:라인) |
|-----|-------------|-------------|-----------|-----------|------------------|
| GET /api/analyses | 0 | 20 | 100 | createdAt, DESC | AnalysisController:66 |
| GET /api/chat/sessions | 0 | 20 | 미제한 | (미명시) | ChatSessionController:59-63 |
| GET /api/posts | (cursor) | 20 | 미제한 | type, sort, grade, domain | PostController:44-45 |

*소스: 위 컨트롤러 파일:라인. 상세: ../infra/miriarts_infra.md §4.4.*

---

## 엔드포인트·Request/Response·에러 참조 (코드 기준 SSOT)

전체 엔드포인트 전수·컨트롤러:라인은 **../infra/miriarts_infra.md §4.4** (구현된 엔드포인트 전수 표). ErrorCode 전수는 miriarts_infra §4.4 ErrorCode 요약(ErrorCode.java:23-98, 401 진입점 SecurityConfig.java:79-80). FE 요청/응답 검증은 **src/shared/api/schemas/*.ts** 및 **src/shared/api/miriartApi.ts** 기준.

| 경로 | 메서드 | Request (요약) | Response (요약) | 컨트롤러:라인 |
|------|--------|----------------|-----------------|----------------|
| /api/auth/token | POST | TokenExchangeRequest | TokenExchangeResponse | AuthController:62 |
| /api/auth/refresh | POST | (쿠키 refreshToken) | TokenRefreshResponse | AuthController:75 |
| /api/auth/logout | POST | (쿠키) | 204 | AuthController:91 |
| /api/users/me | GET | — | UserProfileResponse | UserController:39 |
| /api/users/me/profile | PATCH | UserProfileUpdateRequest | UserProfileResponse | UserController:46 |
| /api/users/me/plan | GET | — | UserPlanResponse | UserController:54 |
| /api/analyses | POST | image, analysisType, problemText(optional) | AnalysisStartResponse 202 | AnalysisController:47 |
| /api/analyses | GET | Pageable | Page&lt;AnalysisDetailResponse&gt; | AnalysisController:63 |
| /api/analyses/{id} | GET | id | AnalysisDetailResponse | AnalysisController:79 |
| /api/images/{id}/url | GET | id(analysisId) | ImageUrlResponse | ImageController:46 (I001, F005) |
| /api/chat | POST | ChatRequest | ChatResponse | AiChatController:43 |
| /api/chat/sessions | GET | page, size, grade | Page&lt;ChatSessionResponse&gt; | ChatSessionController:56 |
| /api/chat/sessions?analysisId= | GET | analysisId | ChatSessionResponse | ChatSessionController:45 |
| /api/chat/sessions/{sessionKey} | GET | sessionKey | ChatSessionResponse | ChatSessionController:72 |
| /api/chat/sessions/{sessionKey}/messages | GET | sessionKey | List&lt;ChatMessageDto&gt; | ChatSessionController:82 |
| /api/posts | GET | type, sort, grade, domain, cursor, size | PostsFeedPageResponse | PostController:39 |
| /api/posts/{id} | GET | id | PostDetailResponse | PostController:54 |
| /api/posts | POST | CreatePostRequest | PostDetailResponse 201 | PostController:63 |
| /api/posts/{id} | PUT | CreatePostRequest | PostDetailResponse | PostController:72 |
| /api/posts/{id} | DELETE | — | 204 | PostController:82 |
| /api/posts/{postId}/accept/{answerId} | POST | — | success | PostController:91 |
| /api/posts/{postId}/answers | POST | CreateAnswerRequest | Long 201 | AnswerController:36 |
| /api/posts/{postId}/answers/{answerId} | PUT/DELETE | CreateAnswerRequest / — | success / 204 | AnswerController:53, 65 |
| /api/likes/toggle | POST | LikeToggleRequest | LikeToggleResponse | LikeController:27 |
| /api/comments | POST | CreateCommentRequest | CommentResponse 201 | CommentController:24 |
| /api/comments/{id} | PUT/DELETE | CreateCommentRequest / — | CommentResponse / 204 | CommentController:32, 41 |
| /api/posts/{postId}/report | POST | ReportRequest(optional) | success 201 | ReportController:24 |
| /api/answers/{answerId}/report | POST | ReportRequest(optional) | success 201 | ReportController:34 |
| /api/events | POST | TrackEventRequest | 200 (void) | EventsController:30 (permitAll) |

*상세 DTO·에러 코드: ../infra/miriarts_infra.md §4.4 ErrorCode 요약(ErrorCode.java). FE 스키마: src/shared/api/schemas/*.ts.*

---

## POST /api/chat 응답 상세 — Structured Chat v1 (2026-03-15)

`ChatResponse` (AiChatController:43). sections가 있으면 구조화 UX, 없으면 단일 버블 fallback.

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| `text` | String | O | 하위 호환용 텍스트. sections가 있으면 "[제목]\n본문" join 문자열. |
| `summary` | String | X (nullable) | 한 줄 핵심 요약 (50자 이내). 구조화 실패 시 null. |
| `sections` | ChatSection[] | X (nullable) | 역할별 섹션 배열. 없으면 FE는 text만 단일 버블로 표시. |
| `groundingUrls` | String[] | X | 출처 URL 목록. 기본 `[]`. |
| `quickReplies` | String[] | X | 퀵 리플라이 목록. 기본 `[]`. |
| `sessionId` | String | O | 세션 식별자. |
| `sessionKey` | String | O | sessionId와 동일값 (@JsonGetter). FE SSOT. |

**ChatSection:**

| 필드 | 타입 | 비고 |
|------|------|------|
| `type` | String | `strength` \| `improvement` \| `action` |
| `title` | String | 섹션 제목 |
| `text` | String | 섹션 본문 (3~5문장) |

> **저장 계층**: Redis/ChatSession에는 sections 미저장 — text만 저장 (Structured Chat v1 설계). 히스토리 재로드 시 과거 턴은 단일 버블로 표시됨.

---

## 엔드포인트별 발생 가능 에러(ErrorCode)

*처리: GlobalExceptionHandler.java:36-38. 트랜잭션·락·throw 위치 요약: ../infra/miriarts_infra.md §4.4 트랜잭션·락·예외 요약.*

| API/플로우 | 발생 가능 ErrorCode (코드) | HTTP | throw 위치(파일:라인) |
|------------|---------------------------|------|----------------------|
| POST /api/auth/token | OAUTH_CODE_INVALID(AUTH002), INTERNAL_SERVER_ERROR(C003) | 400, 500 | OAuth2TokenExchangeService:58, 61 |
| POST /api/auth/refresh | REFRESH_TOKEN_EXPIRED(AUTH006), TOKEN_INVALID(AUTH004) | 401 | TokenRefreshService:47, 54 |
| GET /api/users/me | MEMBER_NOT_FOUND(M001) | 404 | UserRepository:29 |
| PATCH /api/users/me/profile | DUPLICATE_NICKNAME(M002) | 409 | UserService:53 |
| POST /api/analyses | FILE_EMPTY(F001), INVALID_FILE_TYPE(F004), FILE_UPLOAD_FAILED(F003), AI_ANALYSIS_FAILED(AN001), CREDIT_LIMIT_EXCEEDED(CR001) | 400, 500, 502, 402 | AnalysisService:67,71; AnalysisController:58; AnalysisFailHandler:103 |
| GET /api/analyses/{id} | ANALYSIS_NOT_FOUND(AN003) | 404 | AnalysisService:115 |
| GET /api/images/{id}/url | IMAGE_NOT_FOUND(I001), IMAGE_URL_GENERATION_FAILED(F005) | 404, 502 | GcsSignedUrlService:62,66,72,79,86,103 |
| POST /api/chat | AI_CHAT_*(AI001-AI004), CHAT_SESSION_NOT_FOUND(CS001), ANALYSIS_NOT_FOUND(AN003) | 404, 502, 504, 429 | ChatSessionService, AiProxyService |
| GET /api/chat/sessions, sessions/{key} | ANALYSIS_NOT_FOUND, CHAT_SESSION_NOT_FOUND | 404 | ChatSessionService:92, 112; ChatSessionKeyResolver:119 |
| GET/POST/PUT/DELETE /api/posts | POST_NOT_FOUND(CM001), INVALID_INPUT_VALUE(C001), HANDLE_ACCESS_DENIED(C005) | 400, 403, 404 | PostCommandService:44,77,97; PostQueryService:58,99 |
| POST accept | POST_NOT_FOUND, ENTITY_NOT_FOUND(C006), ANSWER_ALREADY_ACCEPTED(CM003), ACCEPT_FORBIDDEN(CM004), POST_DEADLINE_PASSED(CM005) | 400, 403, 404 | AnswerCommandService:49,52,55,58,83,85,88,91,94,97 |
| POST /api/posts/{id}/answers | POST_NOT_FOUND, INVALID_INPUT_VALUE, ANSWER_ALREADY_ACCEPTED, POST_DEADLINE_PASSED | 400, 404 | AnswerCommandService:49-58 |
| PUT/DELETE answer | ENTITY_NOT_FOUND, HANDLE_ACCESS_DENIED, ANSWER_ALREADY_ACCEPTED | 400, 403, 404 | AnswerCommandService:115,117,128,130,133 |
| POST /api/likes/toggle | POST_NOT_FOUND, ENTITY_NOT_FOUND, LIKE_ALREADY_EXISTS(CM006), INVALID_INPUT_VALUE | 400, 404, 409 | LikeCommandService:63,86,88,89 |
| POST/PUT/DELETE /api/comments | POST_NOT_FOUND, ENTITY_NOT_FOUND, INVALID_INPUT_VALUE, HANDLE_ACCESS_DENIED | 400, 403, 404 | CommentCommandService:40,47,51,80,82,91,93 |
| POST report | POST_NOT_FOUND, ENTITY_NOT_FOUND, REPORT_ALREADY_EXISTS(CM007) | 404, 409 | ReportService:37,40,46,60 |

---

## POST /api/events — 행동 이벤트 수집 (2026-03-19)

- **Auth**: **permitAll** (비인증 허용). `@AuthenticationPrincipal Long userId`는 nullable.
- **Request**: `TrackEventRequest` *소스: TrackEventRequest.java*

| 필드 | 타입 | 필수 | 검증 | 설명 |
|------|------|------|------|------|
| `eventType` | String | O | `@NotBlank`, `@Size(50)`, 서버 화이트리스트: `PAGE_VIEW`만 허용 | 이벤트 유형 |
| `sessionKey` | String | X | `@Size(64)` | FE 브라우저 세션 UUID |
| `page` | String | X | `@Size(100)` | 페이지 pathname |
| `referrer` | String | X | `@Size(200)` | document.referrer |
| `source` | String | X | `@Size(20)` | 클라이언트 식별 (미전송 시 BE에서 `WEB` normalize) |
| `clientTs` | Long | X | — | 클라이언트 타임스탬프 (ms) |
| `userAgent` | String | X | `@Size(200)` | navigator.userAgent (200자 truncate) |

- **Response 200**: 빈 body. fire-and-forget.
- **Response 400**: `eventType` 누락 또는 화이트리스트 외 값.
- **Note**: BE에서 `@Async("eventExecutor")` + `REQUIRES_NEW` TX로 비동기 INSERT. 실패해도 비즈니스 로직에 영향 없음 (best-effort).

---

- **401**: 인증 없음 → AUTH009(진입점 SecurityConfig.java:79-80). 토큰 만료/무효 → AUTH004, AUTH006. *TokenRefreshService:47,54.*
- **402**: CR001(크레딧 한도 초과). *AnalysisFailHandler:103.*
- **404**: CM001, C006, AN003, CS001, I001, M001 등. *각 서비스 orElseThrow (miriarts_infra §4.4 트랜잭션·락·예외 요약).*
- **409**: M002, CM006, CM007. *UserService:53, LikeCommandService:63, ReportService:46,60.*
