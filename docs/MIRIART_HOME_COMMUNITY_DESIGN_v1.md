# MiriArt 홈 탭 커뮤니티 기능 설계서 v1.0

> **작성일**: 2026-02-22  
> **기준**: MiriArt Sitemap v1.0 + 결정 세트 (Java BE + FastAPI AI + 카카오/구글 SSO + MySQL/Redis + GCS)  
> **벤치마크**: 에브리타임(피드/게시판 UX) × 네이버 지식인(Q&A/채택/평판 룰)  
> **도메인 컨텍스트**: 미대 입시 수험생 대상 AI 작품 평가 & 멘토링 플랫폼

---

## 0. 설계 원칙

| # | 원칙 | 설명 |
|---|------|------|
| 1 | **AI-First Home** | 홈 탭의 최상단은 여전히 AI 분석 CTA(Hero)를 유지, 커뮤니티는 그 아래에 피드로 자연 합류 |
| 2 | **에타 피드 + 지식인 스레드** | 카드형 피드 스크롤은 에브리타임, 개별 글 진입 후 Q&A/채택 구조는 지식인 룰 |
| 3 | **익명 + 가명 고정** | 게시판 단위 가명(Persona) 부여로 책임 최소 확보, 실제 신원은 BE에만 보관 |
| 4 | **AI 연결** | 질문 작성 시 "AI에게 먼저 물어보기", 답변 보기 시 "AI 요약/보충" 버튼으로 기존 AI Chat 탭과 연결 |
| 5 | **기존 GNB 유지** | 하단 4탭 구조(Home, Archive, AI Chat, Profile) 그대로, 홈 탭 내부만 확장 |

---

## 1. 홈 탭 IA (Information Architecture)

### 1.1 홈 탭 내부 구조 (수직 스크롤)

```
+----------------------------------------------------------+
| [학년▾] [도메인▾]            [🔔] [🔍]                    |  ← Context Bar
+----------------------------------------------------------+
| +------------------------------------------------------+ |
| |  Hero CTA Card (기존 유지)                            | |
| |  "작품을 올려보세요 — 8초 AI 분석"  [분석 시작 →]      | |
| +------------------------------------------------------+ |
|                                                          |
| [타임라인]  [질문 Q&A]  [인기]                            |  ← Sub-Tab (Sticky)
|─────────────────────────────────────────────────────────  |
|                                                          |
|  ┌──────────────────────────────────────────────────┐    |
|  │ 🎨 익명 (고3·기초디자인)                    3분 전 │    |
|  │ [Q] 석고 데생 밝은 부분 톤 처리 어떻게 하나요?    │    |
|  │ 밀도를 올리고 싶은데 어두운 쪽만 계속 짙어져...   │    |
|  │ [이미지 썸네일]                                   │    |
|  │ 💬 12  ❤️ 34  ✅ 채택됨                           │    |
|  └──────────────────────────────────────────────────┘    |
|                                                          |
|  ┌──────────────────────────────────────────────────┐    |
|  │ 🖌️ 익명 (재수·수채화)                     15분 전 │    |
|  │ 오늘 모작 하나 끝냈는데 봐주실 분                 │    |
|  │ [이미지 썸네일 2장]                               │    |
|  │ 💬 5   ❤️ 8                                       │    |
|  └──────────────────────────────────────────────────┘    |
|                                                          |
|  ... (Infinite Scroll)                                   |
|                                                          |
+----------------------------------------------------------+
|  [✏️ 글쓰기 / ❓ 질문하기]                    (FAB)     |
+----------------------------------------------------------+
|  [Home]  [Archive]  [AI Chat]  [Profile]                 |  ← GNB (기존)
+----------------------------------------------------------+
```

### 1.2 Sub-Tab 정의

| Sub-Tab | 내용 | 정렬 |
|---------|------|------|
| **타임라인** | 자유글 + Q&A 혼합, 내 학년/도메인 기반 피드 | 최신순 (에타 자유게시판) |
| **질문 Q&A** | `type=qna`인 글만 필터, 미해결 우선 | 미해결 → 최신순 (지식인식) |
| **인기** | 좋아요/답변수 기반 인기글 | 인기도 가중치 (24h 윈도우) |

### 1.3 Context Bar (상단 필터)

- **학년 드롭다운**: 고1 / 고2 / 고3 / 재수 / 전체
- **도메인 드롭다운**: 기초디자인 / 수채화 / 소묘 / 사고의전환 / 만화·애니 / 전체
- 선택값은 `useUserStore.grade`, `useUserStore.domain` 기본값으로 세팅  
- 변경 시 피드 필터 즉시 반영 (SWR/React Query refetch)

---

## 2. 글쓰기 / 질문하기 플로우

### 2.1 FAB 동작

```
FAB 클릭
  └→ Bottom Sheet 선택
       ├── [✏️ 자유글 쓰기]  → Write Flow (type=free)
       └── [❓ 질문하기]     → Write Flow (type=qna)
```

### 2.2 Write Flow (Full Page Modal, Layer 1)

```
+----------------------------------------------------------+
| [✕ 닫기]              글쓰기 / 질문하기         [등록]    |
+----------------------------------------------------------+
|                                                          |
|  제목 (필수, 최대 100자)                                  |
|  ┌──────────────────────────────────────────────────┐    |
|  │                                                  │    |
|  └──────────────────────────────────────────────────┘    |
|                                                          |
|  본문 (최대 2000자)                                       |
|  ┌──────────────────────────────────────────────────┐    |
|  │                                                  │    |
|  │                                                  │    |
|  │                                                  │    |
|  └──────────────────────────────────────────────────┘    |
|                                                          |
|  [📷 이미지 첨부] (최대 5장)                              |
|  ┌────┐ ┌────┐ ┌────┐                                   |
|  │ +  │ │img1│ │img2│                                   |
|  └────┘ └────┘ └────┘                                   |
|                                                          |
|  태그 (칩 선택, 복수)                                     |
|  [석고] [정물] [풍경] [인체] [색채] [구도] [+커스텀]      |
|                                                          |
|  ──────────────────────────────────────────────────────  |
|  대상: [고3·기초디자인 ▾]    (Context Bar 값 기본 세팅)   |
|                                                          |
|  ☑ 익명                                                  |
|  ☑ 질문글 (Q&A 탭 상단 노출, 답변 후 수정/삭제 불가)     |
|                                                          |
|  ┌──────────────────────────────────────────────────┐    |
|  │ 💡 AI에게 먼저 물어보기                           │    |
|  │    → AI Chat으로 이동, 초안 생성 후 돌아오기       │    |
|  └──────────────────────────────────────────────────┘    |
+----------------------------------------------------------+
```

**질문글(Q&A) 전용 룰**:
- "질문글" 체크 시 Q&A 탭 상단에 파란 강조로 일정 기간 노출 (에타 패턴)
- 답변이 1개 이상 달리면 질문 수정/삭제 불가 (에타 + 지식인 룰)
- 질문자가 마감 시간(24h/48h/72h) 선택 가능, 마감 후 미채택 시 자동 `status=expired`

---

## 3. 글 상세 / Q&A 스레드

### 3.1 자유글 상세 (type=free)

```
+----------------------------------------------------------+
| [← 뒤로]            자유게시판                            |
+----------------------------------------------------------+
|  🎨 익명 (고3·기초디자인)                        3분 전   |
|  ──────────────────────────────────────────────────────  |
|  오늘 모작 하나 끝냈는데 봐주실 분                        |
|                                                          |
|  정물 수채화 연습인데 톤 분리가 잘 안 됐어요              |
|  [이미지 풀사이즈]                                       |
|                                                          |
|  ❤️ 8   💬 5   🔖 스크랩   ⚑ 신고                        |
|  ──────────────────────────────────────────────────────  |
|  댓글 영역 (일반 댓글, 플랫)                              |
|  ┌──────────────────────────────────────────────────┐    |
|  │ 익명1: 밝은 부분 톤을 먼저 깔고 가는 게...        │    |
|  │ 익명2: 오 잘 그렸다                               │    |
|  └──────────────────────────────────────────────────┘    |
|  [댓글 입력...]                              [전송]      |
+----------------------------------------------------------+
```

### 3.2 질문글 상세 (type=qna) — 지식인식 스레드

```
+----------------------------------------------------------+
| [← 뒤로]            Q&A                     [미해결 🔴]  |
+----------------------------------------------------------+
|  🎨 익명 (고3·기초디자인)                        3분 전   |
|  ──────────────────────────────────────────────────────  |
|  [Q] 석고 데생 밝은 부분 톤 처리 어떻게 하나요?          |
|                                                          |
|  밀도를 올리고 싶은데 어두운 쪽만 계속 짙어져서           |
|  밝은 부분이 날아가요. 지우개로 빼는 게 맞나요?          |
|  [이미지]                                                |
|                                                          |
|  태그: [석고] [톤] [밀도]                                |
|  마감: 48시간 후 (남은 시간: 45h 22m)                    |
|  ❤️ 34  📝 답변 3개   🔖 스크랩                          |
|  ──────────────────────────────────────────────────────  |
|                                                          |
|  ┌─ 답변 1 ──────────────────── ✅ 채택됨 ──────────┐    |
|  │ 🖌️ 익명A (재수·소묘)  ⭐ Lv.12               2h전 │    |
|  │                                                   │    |
|  │ 밝은 부분은 지우개보다 "남겨두는" 방식이 좋아요.  │    |
|  │ 처음부터 밝은 면을 건드리지 않고 중간톤부터...    │    |
|  │ [참고 이미지]                                     │    |
|  │                                                   │    |
|  │ ❤️ 21  💬 댓글 5                                  │    |
|  │   └ 댓글: "오 이거 진짜 도움됐어요"               │    |
|  │   └ 댓글: "저도 이 방법 쓰는데 확실히 좋아요"     │    |
|  └───────────────────────────────────────────────────┘    |
|                                                          |
|  ┌─ 답변 2 ─────────────────────────────────────────┐    |
|  │ 🎨 익명B (고3·수채화)  ⭐ Lv.5               4h전 │    |
|  │                                                   │    |
|  │ 4B로 어두운 쪽 먼저 잡고, 2H로 밝은 쪽을...      │    |
|  │                                                   │    |
|  │ ❤️ 7   💬 댓글 1                                  │    |
|  └───────────────────────────────────────────────────┘    |
|                                                          |
|  ┌──────────────────────────────────────────────────┐    |
|  │ 💡 AI가 답변 요약/보충                            │    |
|  │    → "채택된 답변 기준으로 AI가 추가 설명 생성"    │    |
|  └──────────────────────────────────────────────────┘    |
|                                                          |
|  [답변 작성하기]                                         |
+----------------------------------------------------------+
```

**채택 룰 (지식인 기반)**:
- 질문자만 채택 가능, 1개만 채택
- 채택 시: `post.status = solved`, `answer.isAccepted = true`
- 채택된 답변자에게 평판 포인트 지급
- 마감 후 미채택 시: `post.status = expired`, 가장 좋아요 많은 답변에 "커뮤니티 추천" 뱃지 자동 부여

---

## 4. 평판(Reputation) 시스템

### 4.1 포인트 룰

| 행동 | 포인트 | 비고 |
|------|--------|------|
| 질문 작성 | +2 | Q&A 활성화 유도 |
| 답변 작성 | +5 | 지식 기여 핵심 |
| 답변 채택됨 | +15 | 지식인 "채택" 보상 |
| 답변에 좋아요 받음 | +2/개 | 양질 답변 보상 |
| 자유글 좋아요 받음 | +1/개 | 커뮤니티 활성화 |
| 신고 누적 3회 | -10 | 건전성 관리 |
| 질문 마감 후 미채택 | -3 (질문자) | 채택 유도 |

### 4.2 레벨 & 뱃지

| 레벨 | 포인트 구간 | 뱃지 | 특전 |
|------|-------------|------|------|
| Lv.1 신입생 | 0~29 | 🌱 | 기본 |
| Lv.3 실기생 | 30~99 | 🎨 | 프로필 컬러 커스텀 |
| Lv.5 연구생 | 100~299 | 🖌️ | 답변에 "추천 답변자" 뱃지 노출 |
| Lv.8 멘토 | 300~699 | ⭐ | Q&A 탭 "멘토 답변" 우선 노출 |
| Lv.12 마스터 | 700+ | 👑 | 커뮤니티 태그 생성 권한 |

### 4.3 도메인별 전문성 태그 (Phase 2)

- 특정 태그(석고, 수채화, 기초디자인 등)에서 채택 누적 시 해당 태그 전문가 뱃지 획득
- 예: "석고 전문 ⭐⭐⭐" → 석고 관련 Q&A에서 답변 상단 노출

---

## 5. AI 연결 포인트 (홈 탭 ↔ AI Chat)

### 5.1 질문 작성 시 — "AI에게 먼저 물어보기"

```
질문하기 Write Flow
  └→ [💡 AI에게 먼저 물어보기] 버튼 탭
       └→ AI Chat 탭으로 이동 (질문 제목+본문+이미지를 context로 전달)
            └→ AI가 초안 답변 생성
                 └→ [커뮤니티에 질문 올리기] 버튼 → Write Flow로 복귀
```

- AI 답변이 충분하면 커뮤니티에 안 올려도 됨 (AI Chat 내에서 해결)
- AI 답변이 부족하면 "이 질문을 커뮤니티에도 올리기" → 홈 탭 Q&A로 게시

### 5.2 답변 보기 시 — "AI 요약/보충"

- Q&A 상세에서 [💡 AI가 답변 요약/보충] 버튼
- 채택된 답변 + 다른 답변들을 종합해 AI가:
  - 핵심 요약 (3줄)
  - 추가 보충 설명 (답변에서 빠진 부분)
  - 관련 AI 분석 연결 (만약 유사한 분석 결과가 Archive에 있다면 링크)

### 5.3 인기 Q&A → Archive 연동

- 인기 Q&A (좋아요 50+, 채택 완료)는 자동으로 "베스트 Q&A" 아카이브에 등록
- Archive 탭에서 "내 분석" 옆에 "베스트 Q&A" 섹션 추가 (Phase 2)

---

## 6. 도메인 엔티티 (DB 스키마 개념)

### 6.1 신규 테이블

```sql
-- 가명 시스템
CREATE TABLE personas (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    board_scope VARCHAR(50) NOT NULL,  -- 'grade:3:domain:기초디자인'
    display_name VARCHAR(30) NOT NULL, -- '익명의 화가 42'
    color_token VARCHAR(7),            -- '#C2F970'
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, board_scope)
);

-- 게시글
CREATE TABLE posts (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    persona_id      BIGINT REFERENCES personas(id),
    type            ENUM('free', 'qna') NOT NULL DEFAULT 'free',
    status          ENUM('open', 'solved', 'expired', 'closed') DEFAULT 'open',
    title           VARCHAR(100) NOT NULL,
    content         TEXT NOT NULL,
    grade_scope     VARCHAR(10),       -- '고3', '재수', 'all'
    domain_scope    VARCHAR(30),       -- '기초디자인', 'all'
    tags            JSON,              -- ['석고', '톤', '밀도']
    image_urls      JSON,              -- GCS URLs
    view_count      INT DEFAULT 0,
    like_count      INT DEFAULT 0,
    answer_count    INT DEFAULT 0,
    accepted_answer_id BIGINT,
    deadline_at     TIMESTAMP,         -- Q&A 마감 시간 (NULL이면 자유글)
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    INDEX idx_type_status (type, status),
    INDEX idx_scope (grade_scope, domain_scope, created_at DESC)
);

-- 답변 (Q&A 전용)
CREATE TABLE answers (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id     BIGINT NOT NULL REFERENCES posts(id),
    user_id     BIGINT NOT NULL REFERENCES users(id),
    persona_id  BIGINT REFERENCES personas(id),
    content     TEXT NOT NULL,
    image_urls  JSON,
    like_count  INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW(),
    INDEX idx_post (post_id, created_at)
);

-- 댓글 (자유글 + 답변 하위)
CREATE TABLE comments (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_type ENUM('post', 'answer') NOT NULL,
    parent_id   BIGINT NOT NULL,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    persona_id  BIGINT REFERENCES personas(id),
    content     VARCHAR(500) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    INDEX idx_parent (parent_type, parent_id, created_at)
);

-- 좋아요
CREATE TABLE likes (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    target_type ENUM('post', 'answer', 'comment') NOT NULL,
    target_id   BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- 평판/포인트 원장
CREATE TABLE reputation_ledger (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL REFERENCES users(id),
    delta       INT NOT NULL,          -- +15, -3 등
    reason      VARCHAR(50) NOT NULL,  -- 'answer_accepted', 'report_penalty'
    ref_type    VARCHAR(20),           -- 'answer', 'post'
    ref_id      BIGINT,
    created_at  TIMESTAMP DEFAULT NOW(),
    INDEX idx_user (user_id, created_at DESC)
);

-- 신고
CREATE TABLE reports (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    reporter_id BIGINT NOT NULL,
    target_type ENUM('post', 'answer', 'comment') NOT NULL,
    target_id   BIGINT NOT NULL,
    reason      VARCHAR(200),
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE(reporter_id, target_type, target_id)
);
```

### 6.2 기존 테이블 확장

```sql
-- users 테이블에 추가
ALTER TABLE users ADD COLUMN reputation_score INT DEFAULT 0;
ALTER TABLE users ADD COLUMN reputation_level INT DEFAULT 1;
```

---

## 7. API 엔드포인트 (Java BE)

### 7.1 커뮤니티 API

| Method | Path | 설명 | Auth |
|--------|------|------|------|
| `GET` | `/api/posts` | 피드 조회 (query: type, grade, domain, sort, cursor) | ✅ |
| `GET` | `/api/posts/{id}` | 글 상세 (답변/댓글 포함) | ✅ |
| `POST` | `/api/posts` | 글 작성 (자유/Q&A) | ✅ |
| `PUT` | `/api/posts/{id}` | 글 수정 (답변 없는 Q&A만) | ✅ |
| `DELETE` | `/api/posts/{id}` | 글 삭제 (답변 없는 Q&A만) | ✅ |
| `POST` | `/api/posts/{id}/answers` | 답변 작성 | ✅ |
| `POST` | `/api/posts/{id}/accept/{answerId}` | 답변 채택 (질문자만) | ✅ |
| `POST` | `/api/posts/{id}/comments` | 댓글 작성 | ✅ |
| `POST` | `/api/answers/{id}/comments` | 답변 하위 댓글 | ✅ |
| `POST` | `/api/{targetType}/{id}/like` | 좋아요 토글 | ✅ |
| `POST` | `/api/{targetType}/{id}/report` | 신고 | ✅ |
| `GET` | `/api/users/{id}/reputation` | 유저 평판/레벨 조회 | ✅ |

### 7.2 AI 연결 API (FastAPI)

| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/internal/ai/summarize-answers` | Q&A 답변 요약/보충 생성 |
| `POST` | `/internal/ai/draft-from-question` | 질문→AI 초안 답변 생성 |

---

## 8. FE 컴포넌트 구조 (FSD 기준)

### 8.1 신규 디렉토리

```
src/
├── pages/
│   └── home/
│       ├── HomePage.tsx              (기존 확장)
│       ├── PostDetailPage.tsx        (신규 - 자유글 상세)
│       ├── QnaDetailPage.tsx         (신규 - Q&A 상세)
│       └── WritePostPage.tsx         (신규 - 글쓰기/질문하기)
│
├── widgets/
│   └── community/
│       ├── HomeFeed.tsx              (피드 리스트 + Sub-Tab)
│       ├── PostCard.tsx              (피드 카드 단위)
│       ├── AnswerThread.tsx          (Q&A 답변 스레드)
│       ├── CommentSection.tsx        (댓글 영역)
│       ├── ReputationBadge.tsx       (레벨/뱃지 표시)
│       └── AiSummaryCard.tsx         (AI 요약/보충 카드)
│
├── features/
│   └── community/
│       ├── usePostsFeed.ts           (피드 조회 훅, React Query)
│       ├── useCreatePost.ts          (글쓰기 mutation)
│       ├── useAcceptAnswer.ts        (채택 mutation)
│       ├── useLikeToggle.ts          (좋아요 토글)
│       ├── useReport.ts              (신고)
│       └── useReputation.ts          (평판 조회)
│
├── entities/
│   └── community/
│       ├── model/
│       │   ├── post.ts               (Post 타입)
│       │   ├── answer.ts             (Answer 타입)
│       │   ├── comment.ts            (Comment 타입)
│       │   └── reputation.ts         (Reputation 타입)
│       └── api/
│           └── communityApi.ts       (API 클라이언트)
│
└── shared/
    └── ui/
        ├── TagChip.tsx               (태그 칩)
        ├── PersonaAvatar.tsx         (가명 아바타)
        └── DeadlineTimer.tsx         (Q&A 마감 타이머)
```

### 8.2 라우트 추가

```typescript
// app/router.tsx 에 추가
{ path: '/posts/:id', element: <PostDetailPage /> }      // Layer 1
{ path: '/qna/:id', element: <QnaDetailPage /> }          // Layer 1
{ path: '/write', element: <WritePostPage /> }             // Layer 1 (Full Page Modal)
```

---

## 9. Sitemap 업데이트 (기존 대비 변경점)

### 9.1 Navigation Flow 추가

```
Auth (L0, Bottom Tabs)
|
+-- Home (D1)  ← 확장
|   +-- Hero CTA --> Upload Flow --> Result Detail    (기존 유지)
|   +-- Sub-Tab: 타임라인 / Q&A / 인기                 (신규)
|   +-- Post Card Click --> Post Detail (D2, L1)      (신규)
|   +-- QnA Card Click --> QnA Detail (D2, L1)        (신규)
|   +-- FAB --> Write Post (D2, L1)                    (신규)
|
+-- Archive (D1)        (기존 유지)
+-- AI Chat (D1)        (기존 유지)
+-- Profile (D1)        (기존 유지 + 평판/레벨 표시 추가)
```

### 9.2 Depth/Layer 추가

```
+-------+-------+------------------+---------------------------+
| Depth | Layer | Screen Type      | Examples                  |
+-------+-------+------------------+---------------------------+
|  -1   |   -   | Pre-Auth         | Splash, Onboarding        |
|   1   |   0   | Bottom Tab       | Home, Archive, AI Chat    |
|   2   |   1   | Full Page Modal  | Upload, Result, WritePost |  ← WritePost 추가
|   2   |   1   | Full Page        | PostDetail, QnaDetail     |  ← 신규
|   2   |   3   | Full Screen      | Chat Room                 |
|   3   |   2   | Bottom Sheet     | Grade Input, Subscription |
+-------+-------+------------------+---------------------------+
```

### 9.3 Screen Entry/Exit 추가

```
+------------------+----------------------------+----------------------------+
| Screen           | ENTRY                      | EXIT                       |
+------------------+----------------------------+----------------------------+
| PostDetail       | Home Feed card tap         | Back→Home, Report          |
| QnaDetail        | Home Q&A card tap          | Back→Home, AI Summary      |
| WritePost        | Home FAB                   | 등록→Feed, 취소→Home       |
+------------------+----------------------------+----------------------------+
```

---

## 10. 구현 Phase 계획

### Phase C1: 커뮤니티 MVP (2~3주)

- [ ] DB: posts, answers, comments, likes 테이블 생성
- [ ] BE: CRUD API (글/답변/댓글/좋아요)
- [ ] FE: HomeFeed + PostCard + PostDetail + WritePost
- [ ] FE: Sub-Tab (타임라인/Q&A/인기) 필터링
- [ ] FE: FAB → 글쓰기/질문하기 분기

### Phase C2: Q&A + 채택 (1~2주)

- [ ] BE: 채택 로직 + status 전이 + 마감 스케줄러
- [ ] FE: QnaDetail (답변 스레드 + 채택 UI)
- [ ] FE: DeadlineTimer 컴포넌트
- [ ] BE: 질문글 수정/삭제 제한 로직

### Phase C3: 평판 시스템 (1~2주)

- [ ] DB: reputation_ledger, users.reputation_score/level
- [ ] BE: 포인트 지급/차감 트랜잭션
- [ ] FE: ReputationBadge, 레벨 표시
- [ ] FE: Profile 탭에 평판 히스토리

### Phase C4: AI 연결 + 건전성 (2주)

- [ ] FastAPI: summarize-answers, draft-from-question 엔드포인트
- [ ] FE: "AI에게 먼저 물어보기", "AI 요약/보충" 버튼
- [ ] DB: reports, personas 테이블
- [ ] BE: 신고 누적→자동 블라인드, 가명 시스템
- [ ] FE: PersonaAvatar, 신고 UI

### Phase C5: 고도화 (이후)

- [ ] 실시간 알림 (WebSocket/SSE)
- [ ] 도메인별 전문가 뱃지
- [ ] 베스트 Q&A → Archive 연동
- [ ] 검색 (Elasticsearch / 전문 검색)

---

## Document Metadata

| Item | Value |
|------|-------|
| Version | 1.0 |
| Based on | Sitemap v1.0, Decision Set (Java+FastAPI+GCS+MySQL) |
| Benchmark | 에브리타임 (피드 UX), 네이버 지식인 (Q&A 룰) |
| Domain | MiriArt (미리미대) — 미대 입시 AI 멘토링 |
| Author | MiriArt Dev Team |
| Date | 2026-02-22 |
