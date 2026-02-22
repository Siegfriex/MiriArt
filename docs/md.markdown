# MiriArt Mobile App - 앱 구조 명세서

> AI 기반 미술/디자인 작품 평가 및 멘토링 모바일 앱

---

## 목차

0. [사이트맵](#0-사이트맵) — §0.4 [AI 화면 플로우](#04-ai-화면-플로우)
1. [Pre-Auth (비인증)](#1-pre-auth-비인증)
2. [Auth (인증 후)](#2-auth-인증-후)
3. [Modal Flows](#3-modal-flows)
4. [Bottom Sheet Flows](#4-bottom-sheet-flows)
5. [Chat Room](#5-chat-room)
6. [Side GNB Drawer](#6-side-gnb-drawer)
7. [Design System](#7-design-system-typography)
8. [예외 플로우](#8-예외-플로우)

---

## 0. 사이트맵

### 0.1 Depth/Layer 정의

| Depth | Layer | 화면 유형 | 예시 |
|-------|-------|----------|------|
| -1 | - | Pre-Auth | Splash, Onboarding, 회원가입, 로그인 |
| 1 | 0 | Bottom Tab | Home, Archive, AI Chat, Profile |
| 2 | 1 | Full Page Modal | Upload Flow, Result Detail |
| 2 | 3 | Full Screen Workspace | Chat Room |
| 3 | 2 | Bottom Sheet | Grade Input, Subscription Upgrade |

### 0.2 전체 플로우

```
Pre-Auth (Layer -1)
├── Splash → Onboarding / Login-Signup 선택
├── Onboarding → Signup / Login
├── Signup → First Upload Tutorial → Home
└── Login → Home

Auth (Layer 0, Bottom Tabs)
├── Home (D1) ─┬─ Upload Flow (D2 Modal) ─→ Result Detail (D2)
│              └─ 최근 업로드 클릭 ──────────→ Result Detail (D2)
├── Archive (D1) ─→ Result Detail (D2)
├── AI Chat (D1) ─┬─ Session Card 클릭 ─→ Chat Room (D2)
│                 └─ New Chat FAB ────────→ Upload Flow (D2)
└── Profile (D1) ─→ Grade Input / Subscription (D3 Bottom Sheet)

Chat Room (D2, Layer 3)
├── 햄버거 ─→ Side GNB State 1 (80%)
├── Analysis 썸네일 ─→ Result Detail (D2)
└── 퇴장 ─→ AI Chat (D1) / Result Detail (D2)

Side GNB (Overlay)
├── State 1 ─→ State 2 (끝까지 드래그) / 챗룸 복귀
└── State 2 ─→ AI Chat Tab Root (D1)
```

### 0.3 진입/퇴장 경로 매트릭스

| 화면 | 진입 경로 | 퇴장 경로 |
|------|----------|----------|
| Splash | 앱 실행 | Onboarding / Login-Signup |
| Onboarding | Splash | Signup / Login |
| Home | Login, Signup 완료 | Upload Flow, Result Detail |
| AI Chat | GNB 탭 클릭, Side GNB State 2 | Chat Room, Upload Flow |
| Chat Room | Session Card, Result Detail AI Mentor CTA | AI Chat, Result Detail, Side GNB |
| Upload Flow | FAB, New Chat | Result Detail, 이전 Step |
| Result Detail | Upload 완료, Archive/Home 클릭 | Chat Room, Home, Archive |
| Side GNB State 1 | Chat Room 햄버거 | Chat Room, State 2 |
| Side GNB State 2 | State 1 끝까지 드래그, GNB AI Chat | AI Chat Tab |

### 0.4 AI 화면 플로우

```
Chat Room (D2)
├─ [일반] Message Bubbles (Type A/B/C) — §5.2
└─ [Artifact] Checklist View / Gallery View (별도 뷰 전환) — §5.4

Result Detail → [AI 멘토에게 질문하기] → Chat Room (Sticky Context 주입) — §3.2
Upload Flow → Analysis Loading → Result Detail — §3.1
```

- §2.4 AI Chat Tab, §3.1 Upload Flow, §3.2 Result Detail, §5 Chat Room 참조

---

## 1. Pre-Auth (비인증)

### 1.1 Splash Screen
- **타입**: Full Page
- **동작**: 2초 로고 애니메이션 후 → "회원가입" / "로그인" 선택 화면
- **분기**: 토큰 유효 시 Onboarding/Login 건너뛰고 Home 진입

### 1.2 Onboarding Slides
- **타입**: Full Page
- **슬라이드 수**: 3개 (Skip 가능)
- **분기**: Skip → Login 화면, Complete → Signup 화면
- **내용**:
  - Slide 1: "AI가 8초 만에 작품 평가"
  - Slide 2: "합격 확률을 미리 확인"
  - Slide 3: "AI 멘토가 1:1 코칭"

### 1.3 회원가입 (F1-1)
- **타입**: Full Page
- **입력 항목**: 이메일, 비밀번호, 닉네임, 학년, 도메인
- **완료 후**: First Upload Tutorial로 이동

### 1.4 로그인 (F1-2)
- **타입**: Full Page
- **입력 항목**: 이메일, 비밀번호
- **성공 시**: Home Tab으로 이동
- **분기**: First Login (계정 생성 후 첫 로그인) 시 Home 진입 시 Tooltip 표시

---

## 2. Auth (인증 후)

### 2.1 Bottom Tab Navigation

| 탭 | Depth | Layer | 설명 |
|----|-------|-------|------|
| Home | 1 | 0 | 메인 홈 |
| Archive | 1 | 0 | 아카이브/갤러리 |
| AI Chat | 1 | 0 | AI 채팅 세션 |
| Profile | 1 | 0 | 프로필/설정 |

---

### 2.2 Home (Depth 1)

- **타입**: Bottom Tab, Layer 0
- **컴포넌트**:
  - **모달 팝업**: 첫 로그인(계정 생성 후 첫 로그인 시에만) Home 진입 시 첫 업로드 가이드
    - Tooltip: "첫 작품을 업로드해보세요!"
  - **Hero Upload CTA**: 메인 업로드 유도 영역
  - **Live Ticker**: Social Proof (Micro-interaction)
  - **Credit Status Widget**: 크레딧 잔여량 표시
  - **최근 업로드 목록**: Scrollable List → 클릭 시 Result Detail 이동
  - **Quick Upload FAB**: Floating Action Button → 탭 시 Upload Flow 트리거

---

### 2.3 Archive (Depth 1)

- **타입**: Bottom Tab, Layer 0
- **뷰 모드**: LIST VIEW / GRID VIEW (Filter Chips로 전환)

#### LIST VIEW
- **정렬**: 최신순 / 학교순
- **Analysis Carousel**: 기존 업로드 작품 캐러셀
  - 각 케러셀: 이미지뷰(업로드 작품)
  - 하단: 도메인(학교), AI 챗봇 한줄 코멘트 (세션 설명)
  - 클릭 시 → Result Detail

#### GRID VIEW
- **형식**: 5컬럼 그리드 갤러리
- **구성**: Row 기준 도메인(학교) 일치
- **Analysis Card**: 최신순 좌측부터, 컬럼 구분 / 학교는 row 구분
  - 각 카드: 이미지뷰(업로드 작품)
  - 하단: 도메인(학교), AI 챗봇 한줄 코멘트

#### Empty State
- **최초 사용자**: Upload CTA
- **저장된 사용자**: 리스트 하단 Upload CTA

---

### 2.4 AI Chat (Depth 1)

- **타입**: Bottom Tab, Layer 0
- **시스템 액션**: State 2 (Full Open) - 전체 세션 리스트 노출
- **트리거**: 탭 바에서 'AI Chat' 클릭 시 즉시 도달
- **UI**: 100% 드로어 + 하단 GNB 표시

#### Header Area
- Search Bar: 세션 제목, 학교명, 키워드 검색 (Focus 시 키보드 활성화)
- Profile Summary: 구독 플랜(Basic/Premium), 잔여 크레딧

#### Filter Section
- Horizontal Scroll Chips:
  - All (전체)
  - By Grade: A/B/C 등급별
  - By Domain: 홍익대 / 국민대 / 이화여대 등 목표 대학별

#### Main Content (Session Management List)
- **Empty State**: "첫 작품을 업로드하고 AI 멘토를 만나보세요" + 가이드 버튼
- **Session Card (Active)**:
  - Left: 분석 작품 미니 썸네일 (Grade Badge Overlay)
  - Center-Top: 학교명 + 분석 유형 (ex: 국민대 기초조형)
  - Center-Bottom: 최근 메시지 요약 = **Chat Backend 저장 Agent 응답 요약** (AI 마지막 조언 1줄)
  - Right-Top: 세션 생성일 (ex: 2시간 전, 어제)
  - Right-Bottom: fixScope 상태 태그 (ex: Detail Tuning)

#### Global Access
- **New Chat FAB**: 우측 하단 Lime Floating 버튼 → Upload Flow
- **Bottom GNB**: Home / Archive / **AI Chat (Active)** / Profile
- **액션**: 세션 카드 클릭 → Chat Backend 세션 로드 → Sticky Context 주입 → Chat Room (D2) 진입

---

### 2.5 Profile (Depth 1)

- **타입**: Bottom Tab, Layer 0
- **컴포넌트**:
  - **Profile Header**: 닉네임, 플랜 배지
  - **Subscription Card**:
    - 크레딧 Progress Bar
    - 다음 결제일 (next_billing_date, ERD 연계)
    - 클릭 → Subscription Upgrade (Bottom Sheet)
  - **Academic Info Section**:
    - 학년, 도메인 (읽기 전용)
    - 클릭 → Grade Input (Bottom Sheet)
  - **Settings Menu**:
    - 알림 설정
    - 계정 관리
    - 로그아웃
  - **Help & Support**

---

## 3. Modal Flows

### 3.1 Upload Flow (Depth 2)

- **타입**: Full Page Modal, Layer 1 Trigger

| Step | 화면 | 내용 |
|------|------|------|
| 1 | Full Page | Image Picker (갤러리/카메라) |
| 2 | Full Page | Optional Info: Problem Text(선택, 500자), 기초디자인/기초소양 토글 |
| 3 | Bottom Sheet | Credit Confirm: "1 크레딧을 사용하여 평가를 시작할까요?" [확인]/[취소] |
| 4 | Full Page | Analysis Loading: Lottie(8초), Progress bar, "AI가 작품을 분석 중..." → Result Detail 자동 이동 |

#### Back/취소 처리
| 동작 | 처리 |
|------|------|
| Step 2 → Step 1 (Back) | Step 1 데이터 유지 |
| Step 3 [취소] | Step 2로 복귀, 입력 데이터 유지 |

#### Error Handling
| 케이스 | 처리 |
|--------|------|
| Credit Insufficient | Subscription Upgrade (Bottom Sheet) |
| File Too Large | Error Toast + Retry |
| AI Timeout 30초 | Retry Button + "잠시 후 결과를 알려드릴게요" |

---

### 3.2 Result Detail (Depth 2)

- **타입**: Full Page, Layer 1+2 Output

#### 구성 요소
- **Header**: 뒤로가기, 공유, 삭제 (공유/삭제 시 확인 Bottom Sheet 또는 Confirm Dialog)
- **Artwork Viewer**: Pinch-to-Zoom, Swipe Gallery (문제 이미지 있을 시)
- **Grade Badge**: A~F, Total Score (75점)
- **Radar Chart**: 5개 지표 (밀도/형태력/완성도/정합성/사고력), 터치 시 툴팁
- **fixScope Banner**:
  - "구조 재설계 필요" (StructureRebuild)
  - "디테일 개선 권장" (DetailTuning)

#### Conditional: Grade Input CTA
- **조건**: 성적 미입력 시
- **표시**: "성적을 입력하면 합격 확률을 볼 수 있어요"
- **액션**: Grade Input (Bottom Sheet)

#### Conditional: 합격작 기준 비교분석 (Accordion)
- **조건**: 추가 합격작 업로드 필요 (Layer 2)

| Line | 설명 | 기준 |
|------|------|------|
| **TOP** | 최고 강점 (스킬, 역량 잠재력, 차별점) | 2개, ≥ 백분위 89% |
| **HIGH** | 강점 (역량 잠재력, 스타일) | 3개, ≥ 백분위 80% |
| **MID** | 기본기 충족 (합격작 기준 + 디자인 분석) | 최소 3개, ≥ 76% |
| **LOW** | 보완 필요 | 최소 2개, 미충족 ≥ 60% |
| **CRITICAL** | 긴급 보완 | 미충족 ≥ 40% |

- **Each Card**: 대학명, 학과, 확률, 유사 합격자 수

#### 하단 액션
- **AI Mentor CTA**: Floating Button → Chat Room 진입 + **Sticky Context(등급, Radar, fixScope) 주입** (Agent_DEV §5.1)
- **Action Bar** (하단 고정):
  - [재평가하기]
  - [AI 멘토에게 질문하기] → Chat Room (동일, Sticky Context 주입)

---

## 4. Bottom Sheet Flows

### 4.1 성적입력 (Depth 3)

- **타입**: Bottom Sheet, Layer 2 Trigger
- **제목**: "성적 입력" (선택 사항)

#### Input Fields
| 항목 | 형식 | 비고 |
|------|------|------|
| 국어 등급 | 1-9 Picker + 백분위 | |
| 수학 등급 | 1-9 Picker + 백분위 | 미적용 가능 |
| 영어 등급 | 1-9 Picker + 백분위 | |
| 탐구 등급 | 사회/과학 탐구 필터, 2과목 (1-9 Picker) + 백분위 | |

- **버튼**: [저장] / [나중에 입력하기]
- **저장 시**: Result Detail 복귀 + Layer 2 트리거

---

### 4.2 Subscription Upgrade (Depth 3)

- **타입**: Bottom Sheet

#### 구성
- **Plan Comparison Table**:
  - Free (현재 플랜)
  - Basic: 19,900원/월
  - Premium: 49,900원/월
- **Feature Highlights**: 체크리스트
- **Payment Method**: 카드 / 카카오페이 / 네이버페이
- **버튼**: [결제하기] / [취소]
- **결제 성공 시**: Toast + Profile 복귀

---

## 5. Chat Room (Depth 2)

- **타입**: Full Screen Workspace, Full Page, Layer 3
- **UX**: 하단 GNB 슬라이드 다운(Hidden) / 퇴장 시 복구

#### Page Transition (VID §5.1)
- **진입 (Depth 1 → Depth 2)**: GNB Slide Down, Duration 300ms, Ease-out
- **퇴장 (Depth 2 → Depth 1)**: GNB Slide Up, 복구

### 5.1 Header (상단 고정)
| 영역 | 내용 |
|------|------|
| Left | 햄버거 메뉴 → Side GNB State 1 |
| Center | 세션 타이틀 (ex: "홍익대 기디_A 분석") |
| Right | Analysis 썸네일 → Result Detail(D2) 스무스 전환 |

### 5.2 Main View (스크롤 영역)

#### Sticky Context Card (최상단 고정)
- **Max**: 등급 배지, 점수, fixScope 태그, Radar Chart (높이 120px)
- **Min**: 스크롤 시 헤더 하단 1-Line 흡착 (등급|타이틀|점수, 높이 44px)
- **Glassmorphism** (VID §4.1): `backdrop-filter: blur(20px)`, `background: rgba(255, 255, 255, 0.7)` — Max→Min 전환 시 배경 Blur 유지

#### Message Bubbles
| Type | 설명 |
|------|------|
| A | Text Bubble (일반 대화) |
| B | Action Card (Checklist / Image Gallery / Ref Link) |
| C | Quick Reply Chips (모델 설정 연동) |

- **Typing Indicator** (VID §4.4): 3-dot Wave Animation 또는 라임 오로라 모션 — "AI가 지금 당신을 위해 생각하고 있다"

#### Viewport (VID §1.2 Bottom-Heavy)
- **키보드 활성화 시**: Visual Viewport API 활용, Input Bar 고정, 스크롤 영역 조정
- **목적**: Sticky Card와 Input Bar가 콘텐츠를 가리지 않도록 Viewport 완벽 제어

#### 메시지 처리 흐름 (Agent_DEV §22.2)
- **User → Backend → Agent**: 사용자 전송 → Chat Backend 쿼타 확인 → Agent 전달 (HumanMessage + Sticky Context)
- **Agent → Backend → User**: Agent 응답 → Backend Block 변환 (Type A/B/C) → 렌더링

#### 에러 상태 (Agent_DEV §15)
- **AI Timeout, 크레딧 부족**: Toast + [다시 시도] 버튼 (일반 네트워크 오류는 §8.1)

### 5.3 Interaction Bar (하단 고정)
- **Floating Toggle**: AI 모델 스위처 (Ask / Plan / Critic / Inference)
- **Input Field**: 가변형 텍스트 박스 (Max 500자)
- **Action Group**: [이미지 첨부] + [전송 버튼(Lime)]

### 5.4 Artifact View (Agent_DEV §16, §18, §21)

Type B Checklist/Gallery가 Artifact로 확장 시 채팅 내 인라인 → 별도 뷰 전환.

| 뷰 | 구성 | 진입 |
|----|------|------|
| **Checklist View** | 체크리스트 전용 화면, 진행률 바, 항목 체크/해제, Glassmorphism 카드 | placeholder + 로딩바 → GET 폴링 → 생성 완료 시 전환 |
| **Gallery View** | 갤러리 그리드(5컬럼), 확대 뷰, 선택/비교 모드 | 동일 |

- **채팅 연동**: "체크리스트 만들어줘", "유사 작품 보여줘" 등 채팅에서 생성·수정 요청

---

## 6. Side GNB Drawer (Overlay)

- **타입**: Hybrid Navigation Layer

#### Glassmorphism (VID §2.2 Surface)
- **배경**: `background: rgba(255, 255, 255, 0.7)`, `backdrop-filter: blur(20px)`

#### Snap & 제스처 (VID §5.2)
- **Snap**: 드래그 놓을 시 자석 효과, Spring mass: 1, stiffness: 100
- **임계값**: 40% 미만 → 닫힘, 40% 이상 → State 1 또는 State 2
- **제스처 영역**: 좌측 마진 20px 드래그 인식

### 6.1 State 1: Partial Open (80%)

- **용도**: Session Quick Switcher
- **트리거**: 챗룸 내 햄버거 클릭 or 좌측 마진 짧은 드래그
- **GNB**: 하단 공통 GNB 숨김 유지 (채팅 맥락 보존)

#### 구성
- Header: [+ New Chat] → Upload Flow
- Section: Recent History (썸네일 + AI Summary Title)
- Filter: 등급별(A~F) / 도메인별(학교) 퀵 필터
- **액션**: 우측 빈 영역 클릭 → 챗룸 복귀

### 6.2 State 2: Full Open (100%)

- **용도**: AI Chat Tab Root (D1)
- **트리거**: State 1에서 끝까지 드래그 or 하단 GNB 'AI Chat' 탭 클릭
- **GNB**: 하단 공통 GNB 노출 (글로벌 네비게이션 복구)

#### 구성
- Search Bar: 세션/학교/키워드 통합 검색
- Global Filter: 학교별/등급별 아카이브 필터링
- 전체 Chat Session List (전체 관리 모드)
- Empty State 처리 (가이드 및 튜토리얼)
- Footer: [+ New Chat] FAB

---

## 7. Design System: Typography

> 개발팀 전달용 타이포그래피 스펙 (이미지 수치 정확 반영)

### 7.1 Global Font Family

| 언어 | 폰트 | 특징 |
|------|------|------|
| **Korean (Main)** | SUITE (수트) | 부드러운 곡선과 꽉 찬 네모꼴 구조. 모바일 가독성과 심미성 확보 |
| **English (Main)** | Rubik | 둥근 모서리 Sans-serif. SUITE와 이질감 없이 어우러지는 기하학적 서체 |

### 7.2 Type Scale & Specifications

| Token Name | Usage | Font Family | Weight | Size | Line Height | Letter Spacing |
|------------|-------|-------------|--------|------|-------------|----------------|
| **H1 (Primary)** | 메인 타이틀, 헤드라인 | 한: SUITE / 영: Rubik | Extrabold / Semibold | 32px | 42 (130%) | -0.5 |
| **H2 (Section)** | 섹션 헤더, 카드 타이틀 | 한: SUITE / 영: Rubik | Bold / Medium | 22px | 30 (136%) | -0.2 |
| **H3 (Sub)** | 서브 타이틀, 강조 텍스트 | 한: SUITE / 영: Rubik | Medium / Regular | 18px | 24 (133%) | 0 |
| **Body (Main)** | 본문, 설명, 채팅 메시지 | 한: SUITE / 영: Rubik | Medium / Light | 14px | 22 (157%) | 0 |

### 7.3 Usage Guide (컴포넌트 매핑)

#### ① H1 (Primary Title)
- **적용처**: Pre-Auth 온보딩 슬라이드 문구("AI가 8초 만에..."), Depth 1 탭의 최상단 타이틀
- **Design Note**: 한글 Extrabold로 강렬하게, 영문 Semibold로 세련되게 무게 중심 조정

#### ② H2 (Section Header)
- **적용처**:
  - Home: "최근 업로드 목록" 타이틀
  - Result Detail: "종합 등급(Total Score)"
  - Chat Room: 세션 타이틀
- **Design Note**: 22px는 모바일에서 구획을 나누기에 가장 안정적인 크기

#### ③ H3 (Sub-section)
- **적용처**:
  - Result Detail: 5각형 차트 지표 이름 (밀도/형태력/완성도/정합성/사고력)
  - Type B Action Card: 제목
  - 버튼 텍스트
- **Design Note**: 영문 Regular로 설정하여 한글 Medium과 시각적 굵기 밸런스 조정

#### ④ Body (Main Text)
- **적용처**:
  - AI Chat: 메시지 본문
  - Archive: 한 줄 코멘트
  - 툴팁 텍스트
- **Risk & Solution**: 영문 Body가 Light 웨이트. 다크 모드(검은 배경)에서 흰색 얇은 폰트는 번져 보일 수 있음 → **개발 시 Anti-aliasing 처리 필수**

### 7.4 VID 연계

전역 디자인 시스템(VID)은 [docs/design-system/VID_v1.0.md](docs/design-system/VID_v1.0.md) 참조.

| 영역 | VID 섹션 | 요약 |
|------|----------|------|
| **Color** | §2.2 | Primary Lime #C2F970, Surface Glass rgba+blur |
| **Layout** | §2.3 | Radius Large 24px / Medium 12px, Shadow Y:4 Blur:12 |
| **Motion** | §5 | Page Transition 300ms, Side GNB Snap Spring |
| **접근성** | §0.2 | 터치 영역 44px+, Anti-aliasing |

---

## 8. 예외 플로우

### 8.1 네트워크/API 오류

| 케이스 | 처리 | 적용 화면 |
|--------|------|----------|
| 네트워크 오류 | Toast + Retry 버튼 | API 호출 화면 전반 |
| 401 Unauthorized | 로그인 화면 리다이렉트 | Auth 필요 API |
| 세션 만료 | 재로그인 유도 Modal | Chat Room 등 |

### 8.2 AI Timeout

- **조건**: AI 분석 30초 초과
- **처리**: Retry Button + "잠시 후 결과를 알려드릴게요" (§3.1 Error Handling과 동일)
- **VID**: §0.2 Error Recovery 모범 사례

### 8.3 잘못된 경로

| 케이스 | 처리 |
|--------|------|
| 404 / 잘못된 Deep Link | Home 또는 404 Fallback 화면 |

---

## 문서 메타데이터

| 항목 | 값 |
|------|-----|
| 버전 | 1.4 |
| 최종 업데이트 | 2025-02-18 |
| 인코딩 | UTF-8 |
| 포함 섹션 | 앱 구조, 사이트맵, Design System, VID 연계, 예외 플로우, Artifact View, AI 플로우 |
