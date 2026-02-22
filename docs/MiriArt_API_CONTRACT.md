# MiriArt API Contract v1.0

> **목적**: FE ↔ Java BE ↔ FastAPI 전체 엔드포인트·DTO·ErrorCode 단일 계약서 (SSOT)
> **버전**: 1.0 | **작성일**: 2026-02-22
> **기반**: 확정 결정 세트 (Java BE + FastAPI AI + 카카오/구글 OAuth2 + MySQL/Redis + GCS)
> **Cariv BE**: `H:\n_0221\02_21dys\BE` — 참고만, 수정 없음

---

## 0. 토큰 보안 기본 전제

> **이 문서 전체에 적용되는 인증 설계 기준**
>
> 참고: [JWT Security Best Practices 2025](https://jwt.app/blog/jwt-best-practices) · [JWT + httpOnly Cookie Playbook](https://pixicstudio.medium.com/jwt-refresh-tokens-and-http-only-cookies-the-complete-security-playbook-a8e8c525be82) · [Secure JWT Storage](https://workos.com/blog/secure-jwt-storage)

| 토큰 | 저장 위치 | 전송 방식 | 만료 |
|------|-----------|-----------|------|
| **Access Token** | FE 메모리 또는 localStorage | `Authorization: Bearer {token}` 헤더 | 15분 |
| **Refresh Token** | httpOnly Secure Cookie (`Path=/api/auth/refresh`) | 쿠키 자동 전송 | 7일 |

**토큰 갱신 플로우**:
1. 모든 인증 API 호출 → 401 응답 시
2. FE가 자동으로 `POST /api/auth/refresh` 호출 (쿠키의 refreshToken 사용)
3. 새 accessToken 수신 → 원래 요청 재시도
4. refresh도 만료 → FE가 로그인 화면으로 리다이렉트

---

## 1. 공통 규칙

### 1.1 Base URL

| 환경 | URL |
|------|-----|
| 로컬 개발 | `http://localhost:8080` |
| Cloud Run (prod) | `https://miriart-be-{hash}-{region}.run.app` |
| FE 환경변수 | `VITE_API_BASE_URL` |

### 1.2 공통 요청 헤더

| 헤더 | 값 | 필수 |
|------|-----|------|
| `Content-Type` | `application/json` (JSON) / 생략 (multipart) | 조건부 |
| `Authorization` | `Bearer {accessToken}` | 인증 필요 API |

### 1.3 공통 ErrorResponse 스키마

```json
{
  "timestamp": "2026-02-22T12:00:00",
  "status": 400,
  "code": "C001",
  "message": "잘못된 입력값입니다",
  "errors": [
    {
      "field": "email",
      "value": "invalid",
      "reason": "이메일 형식이 아닙니다"
    }
  ]
}
```

> Cariv `ErrorResponse.java` 구조 그대로 채택. `errors[]`는 `@Valid` 실패 시에만 포함.

---

## 2. Auth API

### 2.1 OAuth2 로그인 진입

**GET** `/api/auth/{provider}/authorize`

| 파라미터 | 값 |
|---------|-----|
| `provider` | `kakao` \| `google` |

- 인증: 없음 (public)
- 동작: Spring Security OAuth2가 해당 provider의 authorize URL로 리다이렉트
- FE 사용: 카카오/구글 버튼 클릭 시 이 URL로 브라우저 이동

---

### 2.2 OAuth2 콜백 처리

**GET** `/api/auth/{provider}/callback` *(Spring OAuth2 내부 처리)*

- Spring Security가 `{provider}` authorization code를 교환
- 성공 시: BE가 `{FRONTEND_OAUTH_SUCCESS_URL}/auth/callback?code={uuid}` 로 리다이렉트
- `code`: Redis에 60초 TTL로 저장된 one-time UUID (`miriart:oauth2:code:{uuid}`)

---

### 2.3 코드 → JWT 교환

**POST** `/api/auth/token`

- 인증: 없음 (public)
- 요청:

```json
{
  "code": "550e8400-e29b-41d4-a716-446655440000"
}
```

- 응답 (200):

```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 900,
  "userId": "1",
  "needsProfile": true,
  "provider": "kakao"
}
```

- 응답 헤더: `Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/refresh; Max-Age=604800`
- `needsProfile: true` → FE는 `/onboarding`으로 이동
- `needsProfile: false` → FE는 `/app/home`으로 이동

| ErrorCode | 상황 |
|-----------|------|
| `AUTH002` | code 없음 / 만료 / 이미 사용됨 |

---

### 2.4 Access Token 갱신

**POST** `/api/auth/refresh`

- 인증: 없음 (쿠키의 `refreshToken` 자동 전송)
- 요청: body 없음
- 응답 (200):

```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 900
}
```

- 선택적으로 새 refreshToken 재발급 시 `Set-Cookie` 헤더 포함

| ErrorCode | 상황 |
|-----------|------|
| `AUTH004` | refreshToken 무효 / 만료 |
| `AUTH006` | refreshToken 만료됨 |

---

### 2.5 로그아웃

**POST** `/api/auth/logout`

- 인증: Bearer (선택)
- 동작: Redis의 refreshToken 블랙리스트 등록 + `Set-Cookie: refreshToken=; Max-Age=0; Path=/api/auth/refresh`
- 응답 (204): body 없음

---

## 3. User API

### 3.1 내 프로필 조회

**GET** `/api/users/me`

- 인증: Bearer 필수
- 응답 (200):

```json
{
  "id": "1",
  "nickname": "디자인마스터",
  "grade": "고3",
  "domain": "기초디자인",
  "provider": "kakao",
  "role": "USER",
  "reputationScore": 45,
  "reputationLevel": 3,
  "needsProfile": false,
  "createdAt": "2026-02-22T10:00:00"
}
```

| ErrorCode | 상황 |
|-----------|------|
| `AUTH004` | 토큰 무효 |
| `M001` | 유저 없음 |

---

### 3.2 온보딩 프로필 입력 (최초 1회)

**PATCH** `/api/users/me/profile`

- 인증: Bearer 필수
- 요청:

```json
{
  "nickname": "디자인마스터",
  "grade": "고3",
  "domain": "기초디자인"
}
```

- `grade` 허용값: `고1`, `고2`, `고3`, `재수`, `N수`
- `domain` 허용값: `기초디자인`, `기초소양`, `수채화`, `소묘`, `사고의전환`, `만화·애니`
- 응답 (200): `{ "needsProfile": false, "nickname": "디자인마스터" }`
- 이 호출 성공 시 BE에서 `users.needs_profile = false` 설정

| ErrorCode | 상황 |
|-----------|------|
| `M002` | 닉네임 중복 |
| `C001` | 필드 유효성 오류 |

---

### 3.3 플랜 및 크레딧 카운트 조회

**GET** `/api/users/me/plan`

- 인증: Bearer 필수
- 응답 (200):

```json
{
  "plan": "FREE",
  "monthlyLimit": 2,
  "usedThisMonth": 1,
  "remaining": 1,
  "billingPeriodStart": "2026-02-01"
}
```

- `plan` 허용값: `FREE`, `BASIC`, `PREMIUM`
- `remaining` = `monthlyLimit - usedThisMonth` (플랜 기반 count, v1 경량)

---

## 4. Analysis API

> **FE 마이그레이션**: 현 `ApiService.analyze()` (`POST /api/analyze`) → 이 문서의 `POST /api/analyses`로 교체

### 4.1 작품 업로드 + 분석 시작

**POST** `/api/analyses`

- 인증: Bearer 필수
- 요청: `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `image` | File (JPG/PNG ≤10MB) | 필수 | 작품 이미지 |
| `analysisType` | `basic` \| `major` | 필수 | 분석 유형 |
| `problemText` | String (≤500자) | 선택 | 문제/맥락 |

- Phase 1 처리 흐름:
  1. BE: `analysis_usage_logs` COUNT → 플랜 한도 초과 시 `CR001`
  2. BE: GCS에 이미지 업로드 → `gcs_url` 저장
  3. BE: `analyses` INSERT (`status=PENDING`)
  4. BE: FastAPI `POST /internal/ai/analyze` WebClient 호출
  5. FastAPI: Gemini Vision 분석 → 결과 반환
  6. BE: `analyses` UPDATE (`status=COMPLETED`, 결과 저장)
- 응답 (202):

```json
{
  "analysisId": "ana_123",
  "status": "PENDING",
  "message": "분석 중입니다. 약 8초 소요됩니다."
}
```

- 완료 후 응답은 `GET /api/analyses/{id}` 폴링 또는 결과 직접 반환 방식 선택 가능

| ErrorCode | 상황 |
|-----------|------|
| `CR001` | 플랜 월 한도 초과 |
| `F001` | 이미지 없음 |
| `F002` | 파일 크기 초과 (10MB) |
| `AN001` | AI 분석 실패 (FastAPI 에러) |
| `AN002` | 분석 타임아웃 (30초) |

---

### 4.2 분석 결과 단건 조회

**GET** `/api/analyses/{id}`

- 인증: Bearer 필수 (본인 것만 조회 가능)
- 응답 (200):

```json
{
  "id": "ana_123",
  "imageUrl": "https://storage.googleapis.com/miriart-bucket/...",
  "status": "COMPLETED",
  "analysisType": "basic",
  "grade": "B",
  "totalScore": 82,
  "radarData": {
    "density": 85,
    "form": 80,
    "completion": 78,
    "relevance": 88,
    "thinking": 79
  },
  "fixScope": "DetailTuning",
  "comment": "구조가 탄탄합니다. 하단부 밀도를 높이면 더욱 강해질 것 같아요.",
  "universityPredictions": [
    {
      "university": "홍익대학교",
      "major": "시각디자인",
      "line": "HIGH",
      "probability": 68,
      "similarAcceptedCount": 14
    }
  ],
  "createdAt": "2026-02-22T12:00:00"
}
```

| ErrorCode | 상황 |
|-----------|------|
| `AN003` | 분석 없음 |
| `C005` | 타인 분석 접근 불가 |

---

### 4.3 내 분석 목록 조회 (Archive)

**GET** `/api/analyses`

- 인증: Bearer 필수
- Query Parameters:

| 파라미터 | 기본값 | 설명 |
|---------|--------|------|
| `page` | 0 | 페이지 번호 (0부터) |
| `size` | 20 | 페이지 크기 |
| `sort` | `createdAt,desc` | 정렬 |
| `grade` | 없음 | A\|B\|C\|D\|F 필터 |

- 응답 (200): 페이지네이션 적용된 분석 목록

---

## 5. AI Chat API

> **FE 마이그레이션**: 현 `ApiService.chat()` (`POST /api/chat`) → 이 문서의 `POST /api/chat` (경로 동일, 인증 헤더 추가 필요)

### 5.1 채팅 메시지 전송

**POST** `/api/chat`

- 인증: Bearer 필수
- 요청:

```json
{
  "message": "밀도를 어떻게 높일 수 있나요?",
  "modelType": "CHAT_PRO",
  "sessionId": "sess_abc",
  "stickyContext": {
    "grade": "B",
    "score": 82,
    "fixScope": "DetailTuning",
    "radarData": { "density": 85, "form": 80, "completion": 78, "relevance": 88, "thinking": 79 }
  },
  "imageBase64": null,
  "imageMimeType": null,
  "history": [
    { "role": "user", "parts": [{ "text": "이전 질문" }] },
    { "role": "model", "parts": [{ "text": "이전 답변" }] }
  ]
}
```

- `modelType` 허용값: `CHAT_PRO`, `FAST`, `THINKING`, `SEARCH`, `IMAGE_EDIT`
- `sessionId`: Phase 1에서 BE가 Redis key `miriart:chat:session:{sessionId}` 에 컨텍스트 저장 (TTL 72h)
  - `sessionId` 없으면 BE가 신규 생성하여 응답에 포함
- Phase 1 처리 흐름:
  1. BE: 크레딧 플랜 체크 (Basic 이상만 `IMAGE_EDIT`, Free도 기본 채팅 허용)
  2. BE: Redis에서 기존 세션 컨텍스트 로드
  3. BE: FastAPI `POST /internal/ai/chat` WebClient 호출
  4. BE: Redis 세션 업데이트 (TTL 리셋)
- 응답 (200):

```json
{
  "text": "밀도를 높이려면 오브젝트 간격을 20% 줄이고...",
  "groundingUrls": ["https://..."],
  "quickReplies": ["구도 분석 요청", "색감 피드백", "합격 확률 보기"],
  "sessionId": "sess_abc"
}
```

| ErrorCode | 상황 |
|-----------|------|
| `AI001` | FastAPI 연결 실패 |
| `AI002` | AI 응답 타임아웃 |
| `CR001` | 플랜 한도 초과 |

---

## 6. File API

### 6.1 파일 업로드 (Phase 1: 서버업로드)

**POST** `/api/files`

- 인증: Bearer 필수
- 요청: `multipart/form-data`

| 필드 | 타입 | 설명 |
|------|------|------|
| `file` | File (JPG/PNG ≤10MB) | 업로드 파일 |
| `category` | String | `ARTWORK` \| `COMMUNITY` \| `PROFILE` |

- 응답 (200):

```json
{
  "fileUrl": "https://storage.googleapis.com/miriart-bucket/artworks/2026/...",
  "fileName": "original_name.jpg",
  "fileSize": 1234567
}
```

### 6.2 Presigned URL 발급 (Phase 2 예약)

**POST** `/api/files/presign`

- Phase 2에서 구현. FE가 GCS에 직접 업로드하는 방식으로 전환.
- 이 엔드포인트가 구현되면 `POST /api/files`는 deprecate.

---

## 7. Community API (설계 포함, 구현 Phase C)

> **주의**: Phase C1 이전에는 BE에서 `501 Not Implemented` 반환.
> GET 엔드포인트: `permitAll` (비로그인 읽기 공개, C2 결정 기준)

### 7.1 피드 조회

**GET** `/api/posts`

- 인증: 없음 (permitAll)
- Query Parameters:

| 파라미터 | 설명 |
|---------|------|
| `type` | `free` \| `qna` \| 없음 (전체) |
| `sort` | `latest` \| `popular` \| `unanswered` |
| `grade` | `고1`\|`고2`\|`고3`\|`재수`\|`N수` 필터 |
| `domain` | 도메인 필터 |
| `cursor` | 커서 기반 페이지네이션 |
| `size` | 기본 20 |

- 응답 (200): 게시글 목록 + 다음 cursor

### 7.2 게시글 상세 조회

**GET** `/api/posts/{id}`

- 인증: 없음 (permitAll)
- 응답: 게시글 전체 (답변/댓글 포함, `type=qna`일 때)

### 7.3 게시글 작성

**POST** `/api/posts`

- 인증: Bearer 필수
- 요청:

```json
{
  "type": "qna",
  "title": "석고 데생 밝은 부분 톤 처리 어떻게 하나요?",
  "content": "밀도를 올리고 싶은데...",
  "imageUrls": ["https://storage.googleapis.com/..."],
  "tags": ["석고", "톤", "밀도"],
  "gradeScope": "고3",
  "domainScope": "기초디자인",
  "isAnonymous": true,
  "deadlineHours": 48
}
```

- `deadlineHours`: Q&A 전용 (24\|48\|72), `type=free`이면 무시

### 7.4 게시글 수정 / 삭제

**PUT** `/api/posts/{id}` / **DELETE** `/api/posts/{id}`

- 인증: Bearer 필수 (본인만)
- 제약: `type=qna`이고 답변이 1개 이상이면 수정/삭제 불가 (`CM002`)

### 7.5 답변 작성

**POST** `/api/posts/{id}/answers`

- 인증: Bearer 필수
- 요청: `{ "content": "...", "imageUrls": [], "isAnonymous": true }`

### 7.6 답변 채택

**POST** `/api/posts/{postId}/accept/{answerId}`

- 인증: Bearer 필수 (질문 작성자만)
- 동작: `post.status = SOLVED`, `answer.isAccepted = true`, 채택자 평판 +15 이벤트 발행

### 7.7 댓글 작성

**POST** `/api/posts/{id}/comments`

**POST** `/api/answers/{id}/comments`

- 인증: Bearer 필수

### 7.8 좋아요 토글

**POST** `/api/{targetType}/{id}/like`

- `targetType`: `posts` \| `answers` \| `comments`
- 인증: Bearer 필수
- 동작: 없으면 추가, 있으면 제거 (toggle)

### 7.9 신고

**POST** `/api/{targetType}/{id}/report`

- 인증: Bearer 필수
- 요청: `{ "reason": "스팸/욕설/기타" }`

### 7.10 유저 평판 조회

**GET** `/api/users/{id}/reputation`

- 인증: Bearer 필수
- 응답: `{ "score": 120, "level": 5, "badge": "멘토", "history": [...] }`

---

## 8. FastAPI Internal API (Java BE → FastAPI, FE 직접 접근 불가)

> Java BE에서 `WebClient`로 호출. FE는 이 엔드포인트를 직접 호출하지 않음.
> 인증: Cloud Run VPC 내부망 또는 서비스 계정 토큰 (`Authorization: Bearer {sa_token}`)

### 8.1 작품 분석

**POST** `/internal/ai/analyze`

- 요청:

```json
{
  "gcsUri": "gs://miriart-bucket/artworks/...",
  "analysisType": "basic",
  "problemText": "자유 주제 기초디자인"
}
```

- 응답:

```json
{
  "grade": "B",
  "totalScore": 82,
  "radarData": { "density": 85, "form": 80, "completion": 78, "relevance": 88, "thinking": 79 },
  "fixScope": "DetailTuning",
  "comment": "구조가 탄탄합니다. 하단부 밀도를 높이면...",
  "universityPredictions": [...]
}
```

### 8.2 AI 채팅

**POST** `/internal/ai/chat`

- 요청: `ChatRequest` (FE `gemini.ts`의 `ChatRequest` 구조와 동일)

```json
{
  "modelType": "CHAT_PRO",
  "message": "밀도를 어떻게 높일 수 있나요?",
  "stickyContext": { "grade": "B", "score": 82, "fixScope": "DetailTuning" },
  "history": [...]
}
```

- 응답: `ChatResponse`

```json
{
  "text": "밀도를 높이려면...",
  "groundingUrls": [],
  "quickReplies": ["구도 분석", "색감 피드백"]
}
```

### 8.3 이미지 편집

**POST** `/internal/ai/edit-image`

- 요청: `{ "imageBase64": "...", "prompt": "레트로 필터 추가" }`
- 응답: `{ "text": "편집 완료", "imageUrl": "https://..." }`

### 8.4 Q&A 답변 요약 (Phase C4)

**POST** `/internal/ai/summarize-answers`

- 요청: `{ "question": "...", "answers": ["답변1", "답변2"] }`
- 응답: `{ "summary": "3줄 요약", "supplement": "추가 설명" }`

### 8.5 질문 초안 생성 (Phase C4)

**POST** `/internal/ai/draft-from-question`

- 요청: `{ "title": "...", "content": "...", "imageBase64"?: "..." }`
- 응답: `{ "draft": "AI 초안 답변..." }`

---

## 9. ErrorCode 목록

### 9.1 Common

| 코드 | HTTP | 메시지 | 출처 |
|------|------|--------|------|
| `C001` | 400 | 잘못된 입력값입니다 | Cariv 그대로 |
| `C002` | 405 | 허용되지 않은 HTTP 메서드입니다 | Cariv 그대로 |
| `C003` | 500 | 서버 오류가 발생했습니다 | Cariv 그대로 |
| `C004` | 400 | 잘못된 타입입니다 | Cariv 그대로 |
| `C005` | 403 | 접근이 거부되었습니다 | Cariv 그대로 |
| `C006` | 404 | 엔티티를 찾을 수 없습니다 | Cariv 그대로 |

### 9.2 Auth

| 코드 | HTTP | 메시지 | 출처 |
|------|------|--------|------|
| `AUTH001` | 400 | 지원하지 않는 OAuth 제공자입니다 | Cariv 그대로 |
| `AUTH002` | 400 | 유효하지 않거나 만료된 인가 코드입니다 | Cariv 그대로 |
| `AUTH003` | 400 | 이메일 동의가 필요합니다 | Cariv 그대로 |
| `AUTH004` | 401 | 유효하지 않은 토큰입니다 | Cariv 그대로 |
| `AUTH005` | 401 | 만료된 액세스 토큰입니다 | Cariv 그대로 |
| `AUTH006` | 401 | 만료된 리프레시 토큰입니다 | Cariv 그대로 |

### 9.3 Member

| 코드 | HTTP | 메시지 | 출처 |
|------|------|--------|------|
| `M001` | 404 | 회원을 찾을 수 없습니다 | Cariv 그대로 |
| `M002` | 409 | 이미 존재하는 닉네임입니다 | MiriArt 변경 (이메일→닉네임) |

### 9.4 File

| 코드 | HTTP | 메시지 | 출처 |
|------|------|--------|------|
| `F001` | 400 | 업로드할 파일이 없습니다 | Cariv 그대로 |
| `F002` | 400 | 파일 크기가 제한을 초과했습니다 (최대 10MB) | Cariv 그대로 |
| `F003` | 500 | 파일 업로드에 실패했습니다 | Cariv 그대로 |

### 9.5 Analysis (MiriArt 신규)

| 코드 | HTTP | 메시지 |
|------|------|--------|
| `AN001` | 502 | AI 분석 서비스 연결에 실패했습니다 |
| `AN002` | 504 | 분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요 |
| `AN003` | 404 | 분석 결과를 찾을 수 없습니다 |

### 9.6 Credit (MiriArt 신규)

| 코드 | HTTP | 메시지 |
|------|------|--------|
| `CR001` | 402 | 이번 달 분석 한도를 초과했습니다. 플랜을 업그레이드해주세요 |
| `CR002` | 400 | 이 기능은 Basic 플랜 이상에서 사용 가능합니다 |

### 9.7 AI Chat (MiriArt 신규)

| 코드 | HTTP | 메시지 |
|------|------|--------|
| `AI001` | 502 | AI 멘토 연결에 실패했습니다. 다시 시도해주세요 |
| `AI002` | 504 | AI 응답 시간이 초과됐습니다 |

### 9.8 Community (MiriArt 신규, Phase C)

| 코드 | HTTP | 메시지 |
|------|------|--------|
| `CM001` | 404 | 게시글을 찾을 수 없습니다 |
| `CM002` | 400 | 답변이 달린 질문은 수정/삭제할 수 없습니다 |
| `CM003` | 400 | 이미 채택된 답변이 있습니다 |
| `CM004` | 403 | 채택은 질문 작성자만 가능합니다 |
| `CM005` | 400 | 마감된 질문입니다 |
| `CM006` | 409 | 이미 좋아요를 눌렀습니다 |
| `CM007` | 409 | 이미 신고한 컨텐츠입니다 |

---

## 10. FE 현 ApiService 마이그레이션 매핑

| 현 FE 호출 | 새 엔드포인트 | 변경 사항 |
|-----------|-------------|-----------|
| `POST /api/analyze` (gemini.ts) | `POST /api/analyses` | 경로 변경 + `Authorization` 헤더 추가 |
| `POST /api/chat` (gemini.ts) | `POST /api/chat` | 경로 동일 + `Authorization` 헤더 추가 |
| `POST /api/edit-image` (gemini.ts) | `POST /api/chat` (`modelType: IMAGE_EDIT`) | 통합 (별도 엔드포인트 제거) |

---

## Document Metadata

| 항목 | 값 |
|------|-----|
| Version | 1.0 |
| Date | 2026-02-22 |
| Based on | Cariv BE `ErrorCode.java`, FE `gemini.ts`, Legacy FSD v1.3, Community Design v1.0 |
| Phase | P1 (Auth+AI) / P2 (Chat MySQL) / C (Community) |
