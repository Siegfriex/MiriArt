# MiriArt 프론트엔드 해체·리빌딩 분석 보고서 v1.0

> **목표**: 현재 프론트엔드를 체계적으로 해부하여, 다른 프로젝트에서 재사용·변형 가능한 형태로 재구성하기 위한 분석 문서

**분석 대상**: `h:\n_0221\02_21dys` (MiriArt — AI 미술/디자인 작품 평가·멘토링 앱)  
**분석 시점**: 2025-02-22  
**문서 버전**: 1.0

---

## 1단계: Site Survey — 스택·구조 정리

### 1.1 사용 프레임워크/런타임

| 항목 | 내용 |
|------|------|
| **프레임워크** | React 19.2.4 |
| **언어** | TypeScript 5.8 |
| **빌드 도구** | Vite 6.2 |
| **라우터** | react-router-dom 6.30 |
| **상태관리** | Zustand 4.5 (persist 미들웨어 포함) |
| **스타일** | Tailwind CSS 4.1 + CSS Custom Properties |
| **애니메이션** | framer-motion 11 |
| **아이콘** | lucide-react 0.574 |

### 1.2 주요 라이브러리

| 카테고리 | 라이브러리 | 용도 |
|----------|------------|------|
| **상태관리** | Zustand | 전역 스토어 (user, modal, toast, nav, sideGNB) |
| **데이터 패칭** | 없음 (직접 fetch) | ApiService로 REST API 호출 |
| **라우터** | react-router-dom | SPA 라우팅 |
| **UI 컴포넌트** | 자체 구현 | shared/ui, features, widgets |
| **폼 라이브러리** | 없음 | useState 기반 직접 구현 |
| **검증** | 없음 (Zod 미사용) | 타입만 TypeScript로 정의 |
| **AI SDK** | @google/genai | (vite.config에서 GEMINI_API_KEY 주입, FE 직접 호출 아님) |

### 1.3 디렉토리 구조와 각 폴더 역할

| 폴더 | 역할 | 주요 파일/내용 |
|------|------|----------------|
| **`src/app/`** | 앱 루트, 라우터, 레이아웃, 프로바이더 | App.tsx, AppRouter.tsx, MainLayout.tsx, ModalProvider.tsx, ModalRegistry.tsx |
| **`src/pages/`** | 라우팅 단위 페이지 | auth/(Splash, Onboarding, Login, Signup, FirstUploadTutorial), home, archive, chat-list, chat-room, result-detail, profile |
| **`src/features/`** | 유스케이스 단위 기능 | chat/(ChatInput, MessageBubble), upload/UploadFlow, grade/GradeInputSheet, subscription/SubscriptionSheet |
| **`src/widgets/`** | 복합 UI 블록 | layout/(SideGNB, BottomNav), home/(LiveTicker, CreditStatusWidget), chat/(SessionListPanel, StickyContextCard), result/, artifact/, artwork/, profile/, common/ |
| **`src/entities/`** | 도메인 모델/스키마 | artwork/model.ts, session/model.ts |
| **`src/shared/`** | 공통 인프라 | api/gemini.ts, config/(routes, strings, aiModels), model/(types, *Store), ui/(Button, Typography, Toast, modal, charts, cards 등) |
| **`src/__mocks__/`** | Mock 데이터 | artworks.ts, sessions.ts |

### 1.4 환경 변수/설정

| 변수 | 용도 | 기본값 |
|------|------|--------|
| `GEMINI_API_KEY` | (빌드 시 주입, FE 직접 사용 아님) | - |
| `VITE_API_BASE_URL` | Cloud Run API 베이스 URL | `http://localhost:8080` |

**vite.config.ts**에서 `loadEnv`로 `.env` 로드, `define`으로 `process.env.GEMINI_API_KEY` 주입.

---

## 2단계: Excavation — 대표 유스케이스별 실행 경로 추적

### 2.1 Splash → Onboarding → Signup → Tutorial

| 단계 | 경로 | 컴포넌트 | 상태/API |
|------|------|----------|----------|
| 진입 | `/` | `Splash` | `useEffect` 2초 후 `navigate(ROUTES.ONBOARDING)` |
| 온보딩 | `/onboarding` | `Onboarding` | `useState(current)` 3슬라이드, Skip→Login, Complete→Signup |
| 회원가입 | `/auth/signup` | `Signup` | `useState(formData)` email, password, nickname, grade, domain |
| 튜토리얼 | `/tutorial` | `FirstUploadTutorial` | `useModalStore.openModal('UPLOAD_FLOW')` → Home 이동 후 모달 |

**API**: 없음 (현재 모두 Mock/로컬 상태)  
**에러 처리**: 없음  
**도메인 타입**: `STRINGS` (strings.ts), `ROUTES` (routes.ts)

---

### 2.2 로그인 플로우

| 단계 | 경로 | 컴포넌트 | 상태/API |
|------|------|----------|----------|
| 진입 | `/auth/login` | `Login` | `useState(email, password)` |
| 제출 | - | - | `handleSubmit` → `navigate(ROUTES.APP.HOME)` (실제 API 호출 없음) |

**API**: 없음 (Mock)  
**에러 처리**: 없음  
**도메인 타입**: `STRINGS.LOGIN_*`

---

### 2.3 작품 업로드·분석 플로우 (Upload Flow)

| 단계 | 경로 | 컴포넌트 | 상태/API |
|------|------|----------|----------|
| 진입 | 모달 `UPLOAD_FLOW` | `UploadFlow` | `useModalStore`, `useToastStore`, `useState(step, selectedImage, progress, errorType)` |
| Step 1 | - | 이미지 선택 | `handleFileChange` → 파일 크기 검증 (10MB) → `setStep(2)` |
| Step 2 | - | 유형/맥락 | `type: basic\|major`, `text` (문제/맥락) → `setStep(3)` |
| Step 3 | - | 크레딧 확인 | `handleAnalysisStart` → 크레딧 0이면 SUBSCRIPTION 모달 |
| Step 4 | - | 분석 중 | `ApiService.analyze(image, { type, problemText })` |
| 완료 | - | - | `navigate(ROUTES.RESULT(result.id))` |

**API**:
- `POST /api/analyze` — FormData: `image`, `options` (JSON)
- 응답: `{ id, grade, totalScore, radarData, fixScope, comment }`

**에러 처리**:
- 402 → `errorType='credits'` → 플랜 업그레이드 모달
- 408 → `errorType='timeout'` → 재시도
- 기타 → `errorType='timeout'`, Toast

**도메인 타입**: `AnalyzeOptions`, `AnalyzeResponse` (gemini.ts)

---

### 2.4 채팅방 플로우 (AI 멘토)

| 단계 | 경로 | 컴포넌트 | 상태/API |
|------|------|----------|----------|
| 진입 | `/chat/:sessionId` | `ChatRoom` | `useParams`, `useSideGNBStore`, `useNavStore.hide()`, `useState(messages, isLoading, activeArtifact, isContextCollapsed)` |
| 데이터 | - | - | `getArtworkById(sessionId)`, `MOCK_SESSIONS.find()` |
| 전송 | - | `ChatInput` → `handleSend` | `ApiService.chat({ modelType, message, sessionId, stickyContext, imageBase64?, imageMimeType? })` |

**API**:
- `POST /api/chat` — JSON: `ChatRequest`
- 응답: `{ text, groundingUrls?, quickReplies? }`

**에러 처리**:
- 402 → Toast "크레딧이 부족합니다. 플랜을 업그레이드해주세요."
- 기타 → Toast "AI 멘토 연결에 실패했습니다."

**도메인 타입**: `Message`, `ChatRequest`, `ChatResponse`, `StickyContext`, `AIModelType`

---

### 2.5 결과 상세 (Result Detail)

| 단계 | 경로 | 컴포넌트 | 상태/API |
|------|------|----------|----------|
| 진입 | `/result/:artworkId` | `ResultDetail` | `useParams`, `getArtworkById(artworkId)`, `useModalStore` |
| 표시 | - | - | `RadarChart`, `ComparisonAccordion`, `MOCK_TIERS` |
| 액션 | - | - | `openModal('GRADE_INPUT')`, `openModal('UPLOAD_FLOW')`, `openModal('CONFIRM')`, `navigate(ROUTES.CHAT_ROOM(sessionId))` |

**API**: 없음 (Mock 데이터)  
**에러 처리**: 없음  
**도메인 타입**: `AnalysisResult`, `RadarData`, `ComparisonTier`, `Grade`

---

## 3단계: 아키텍처 & UI/도메인 모델 추출

### 3.1 레이어 경계(Boundary)

| 레이어 | 폴더 | 역할 |
|--------|------|------|
| **App** | `src/app/` | BrowserRouter, ModalProvider, SideGNB, AppRouter, BottomNav, ToastContainer |
| **Pages** | `src/pages/` | 라우팅 단위, Outlet/자식 라우트 |
| **Features** | `src/features/` | 유스케이스 (Upload, Chat, Grade, Subscription) |
| **Widgets** | `src/widgets/` | 복합 UI (Layout, Home, Chat, Result, Artifact, Artwork, Profile) |
| **Entities** | `src/entities/` | 도메인 모델 (Artwork, Session) |
| **Shared** | `src/shared/` | API, config, model(types+stores), ui |

### 3.2 공통 인프라

| 인프라 | 위치 | 역할 |
|--------|------|------|
| API 클라이언트 | `shared/api/gemini.ts` | `ApiService.chat`, `analyze`, `editImage`, `ApiError`, `apiFetch` |
| 에러 핸들러 | `gemini.ts` 내부 | status별 Toast 메시지 (402, 408 등) |
| Auth | 없음 | 토큰/세션 미구현, `useUserStore`로 프로필만 persist |
| 라우터 | `shared/config/routes.ts` | `ROUTES` 상수 |
| 디자인 시스템 | `shared/ui/`, `shared/ui/tokens/` | Button, Typography, Toast, GlassCard, PageContainer, tokens, zLayers |

### 3.3 주요 도메인 모델/타입

| 타입 | 위치 | 설명 |
|------|------|------|
| `User`, `UserRole`, `Grade` | `shared/model/types.ts` | 사용자, 등급 |
| `Message`, `MessageType`, `Sender` | `shared/model/types.ts` | 채팅 메시지 |
| `Session`, `FixScope` | `shared/model/types.ts` | 세션(채팅 단위) |
| `AIModelType`, `RadarData`, `ComparisonItem`, `ComparisonTier`, `AnalysisResult` | `shared/model/types.ts` | AI 분석 결과 |
| `Artwork` | `entities/artwork/model.ts` | 작품 |
| `UserProfile` | `shared/model/userStore.ts` | 프로필 (닉네임, 학년, 도메인, 플랜, 크레딧) |

### 3.4 대표 상태 전이

```
Splash (2초) → Onboarding (3슬라이드)
  ├─ Skip → Login → Home
  └─ Complete → Signup → Tutorial → Home (UPLOAD_FLOW 모달)

Home
  ├─ FAB/CTA → UPLOAD_FLOW 모달 → Result Detail
  ├─ Recent 클릭 → Result Detail
  └─ BottomNav: Archive, Chat(SideGNB), Profile

Result Detail
  ├─ AI 멘토에게 질문 → ChatRoom
  ├─ 재평가하기 → UPLOAD_FLOW 모달
  └─ 성적 입력 → GRADE_INPUT 모달

ChatRoom
  └─ 작품 썸네일 → Result Detail
```

### 3.5 프로젝트 특화 vs 범용 FE 패턴

| 프로젝트 특화 | 범용 FE 패턴 |
|---------------|--------------|
| MiriArt 브랜드, AI Art Mentor 도메인 | Zustand + persist 사용자 스토어 |
| 미대/합격 확률, 5요소 분석(레이더), ComparisonTier | ModalRegistry + GlobalModal (타입별 레이아웃) |
| Grade, FixScope, AIModelType 등 도메인 enum | ToastStore + ToastContainer |
| STRINGS 한글 copy (MiriArt 전용) | ApiService + ApiError + status별 Toast |
| MOCK_ARTWORKS, MOCK_SESSIONS, MOCK_TIERS | NavStore, SideGNBStore (UI 상태) |
| primary-lime, dark-900 등 MiriArt 팔레트 | routes.ts 중앙 관리 |
| | 디자인 토큰 3계층 (primitives → semantic → zLayers) |

---

## 4단계: API·에러 핸들링·상태관리 패턴 추출

### 4.1 API 호출 패턴

| 항목 | 내용 |
|------|------|
| **베이스 URL** | `import.meta.env.VITE_API_BASE_URL \|\| 'http://localhost:8080'` (gemini.ts) |
| **엔드포인트** | `POST /api/chat`, `POST /api/analyze`, `POST /api/edit-image` |
| **데이터 패칭** | React Query/SWR 없음. `ApiService` 객체 + 직접 `fetch` |
| **응답 스키마** | Zod 미사용. TypeScript interface만 정의 (gemini.ts) |

### 4.2 에러 처리

| 항목 | 내용 |
|------|------|
| **공통 에러 클래스** | `ApiError extends Error` (status, message) |
| **토스트 연동** | `useToastStore.getState().show(msg, 'error')` (ApiService 내부) |
| **status 매핑** | 402 → 크레딧 부족, 408 → 타임아웃 |
| **대표 시나리오** | 402 → 플랜 업그레이드 유도, 408 → 재시도 안내 |

### 4.3 상태관리

| 스토어 | 위치 | 역할 | persist |
|--------|------|------|---------|
| `useUserStore` | `shared/model/userStore.ts` | 프로필, isFirstLogin, credits | localStorage `miri-art-user` |
| `useModalStore` | `shared/model/modalStore.ts` | activeModal, modalProps | - |
| `useToastStore` | `shared/model/toastStore.ts` | toasts | - |
| `useNavStore` | `shared/model/navStore.ts` | isBottomNavVisible | - |
| `useSideGNBStore` | `shared/model/sideGNBStore.ts` | mode (closed/partial/full) | - |

**로컬 vs 글로벌 분리**: 적절함. 페이지별 `useState`(messages, step 등) + 전역은 Zustand.

---

## 5단계: 재사용 가능한 FE 모듈/패턴 식별

### 5.1 재사용하기 좋은 범용 모듈

| 모듈 | 관련 파일/폴더 | 일반화 필요 사항 | 새 모듈 이름 제안 |
|------|----------------|------------------|-------------------|
| **API Client + Error Handling** | `src/shared/api/gemini.ts` | baseURL → env, 도메인 ErrorCode → generic, copy → i18n | `frontend-api-core` |
| **Modal Registry + GlobalModal** | `src/shared/ui/modal/GlobalModal.tsx`, `src/app/providers/ModalProvider.tsx`, `ModalRegistry.tsx`, `modalStore.ts` | ModalType/ModalPropsMap → 제네릭, STRINGS 제거 | `modal-system` |
| **Toast Store + Container** | `src/shared/model/toastStore.ts`, `src/shared/ui/Toast.tsx` | STYLES/ICONS → 토큰 의존 | `toast-system` |
| **Nav Store + BottomNav** | `src/shared/model/navStore.ts`, `src/widgets/layout/BottomNav.tsx` | 탭 경로/라벨 → props/config | `bottom-nav` |
| **SideGNB Store + SideGNB** | `src/shared/model/sideGNBStore.ts`, `src/widgets/layout/SideGNB.tsx` | 세션/아이템 구조 → 제네릭 | `side-gnb` |
| **Design Tokens** | `src/shared/ui/tokens/index.ts`, `tailwind.config.ts`, `globals.css` | primary-lime → theme 변수 | `design-tokens` |
| **Routes Config** | `src/shared/config/routes.ts` | ROUTES 경로 → 프로젝트별 | `routes-config` |
| **User Store (persist)** | `src/shared/model/userStore.ts` | UserProfile 스키마 → 제네릭 | `user-store-template` |
| **Upload Flow Wizard** | `src/features/upload/UploadFlow.tsx` | Step 구조, API 연동 → 주입 | `upload-wizard` |

### 5.2 서비스에 강하게 묶인 UI/로직

| 항목 | 설명 |
|------|------|
| MiriArt 브랜드/BI | APP_NAME, primary-lime, 로고 |
| 미대/합격 도메인 | Grade, FixScope, RadarData 5축, ComparisonTier |
| STRINGS 전체 | 한글 copy (MiriArt 전용) |
| MOCK_ARTWORKS, MOCK_SESSIONS | 학교/전공/등급 구조 |
| LiveTicker, CreditStatusWidget | MiriArt 비즈니스 로직 |
| SessionListPanel, StickyContextCard | AI 멘토 채팅 맥락 |

---

## 6단계: 새로운 프론트엔드 프로젝트로의 리빌딩/변형 가이드

### 6.1 이식 순서 체크리스트

| 순서 | 항목 | 그대로 가져오기 | 개념만 참고 |
|------|------|-----------------|-------------|
| 1 | **공통 인프라** | ApiService 패턴, ApiError, toast 연동, modalStore, toastStore, GlobalModal, ModalRegistry, navStore, sideGNBStore | gemini 도메인 타입, MiriArt ModalType |
| 2 | **Auth/OAuth/토큰/라우팅** | routes.ts 패턴, UserStore persist 구조 | MiriArt Auth 미구현 → 새로 구현 |
| 3 | **도메인별 Feature** | UploadFlow Step 구조, ChatInput/MessageBubble 패턴 | AnalyzeOptions, ChatRequest, AIModelType |
| 4 | **프로젝트 전용 화면** | - | Home, Archive, ResultDetail, Profile 등 전부 |

### 6.2 새 프로젝트 적용 시 주의사항 (3~5개)

1. **하드코딩된 API URL/브랜드명 제거**  
   `VITE_API_BASE_URL` 환경변수 사용, `MiriArt`, `primary-lime` 등 브랜드 토큰을 theme 변수로 분리.

2. **환경변수/feature flag 설계**  
   `.env.example`에 필수 변수 문서화, API 키는 FE에 두지 않고 프록시(Cloud Run 등) 경유.

3. **전역 상태 최소화**  
   NavStore, SideGNBStore는 UI 전용으로 유지. 도메인 데이터는 React Query 등으로 서버 상태 분리 권장.

4. **라우트/경로 네이밍 일반화**  
   `ROUTES.APP.HOME` 등 프로젝트별로 재정의. `/app/*` prefix는 선택.

5. **에러 메시지/토스트 copy를 i18n 레이어로 분리**  
   `STRINGS` 객체를 `src/shared/config/strings.ts`에 두되, 나중에 i18next 등으로 교체 가능하게 구조화.

---

## 부록: 파일 경로 요약

| 구분 | 경로 |
|------|------|
| **엔트리** | `index.tsx`, `index.html` |
| **앱 루트** | `src/app/App.tsx` |
| **라우터** | `src/app/routers/AppRouter.tsx` |
| **설정** | `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts` |
| **API** | `src/shared/api/gemini.ts` |
| **스토어** | `src/shared/model/*.ts` |
| **라우트 상수** | `src/shared/config/routes.ts` |
| **문자열** | `src/shared/config/strings.ts` |
| **모달** | `src/app/providers/ModalProvider.tsx`, `ModalRegistry.tsx`, `src/shared/ui/modal/GlobalModal.tsx` |

---

*문서 끝*
