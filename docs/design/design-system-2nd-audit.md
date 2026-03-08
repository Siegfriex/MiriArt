# 디자인 시스템 2차 확장 — 심층 점검 보고서

> 목적: "나머지 화면 + 토큰 alias 적용" 상태 진단 및 TODO 우선순위 정리  
> 범위: `src/pages/**`, `src/widgets/**`, `src/shared/ui/**`, `tailwind.config.ts`, `tokens/**`, `globals.css`

---

## 섹션 1: 공통 컴포넌트 미사용/부분 사용 인벤토리

### 1-a) Button/TextInput/Select/PageContainer를 전혀 쓰지 않는 페이지/위젯

| 파일 경로 | 미사용 공통 컴포넌트 | 비고 | 2차 적용 우선순위 |
|-----------|----------------------|------|-------------------|
| `src/pages/auth/AuthCallback.tsx` | Button, TextInput, Select, PageContainer | 로딩 문구만 표시, 레이아웃 단순 | **낮음** |
| `src/pages/auth/Splash.tsx` | Button, TextInput, Select, PageContainer | 로고+애니메이션만, 레이아웃 단순 | **낮음** |
| `src/pages/chat-list/ui/Page.tsx` | PageContainer | SessionListPanel 래퍼만 (SessionListPanel은 FAB/SearchBar/FilterChip 사용, Button/PageContainer 없음) | **중간** |
| `src/widgets/chat/ui/SessionListPanel.tsx` | Button, PageContainer | 헤더/필터/카드만, FAB 사용. 목록 영역은 공통 컨테이너 없음 | **중간** |
| `src/widgets/layout/BottomNav.tsx` | Button | 탭 버튼 4개 모두 네이티브 `<button>` | **높음** |
| `src/widgets/community/SubTabBar.tsx` | Button | 탭 3개 모두 네이티브 `<button>` | **높음** |
| `src/widgets/community/ContextBar.tsx` | Button | Select 2개 사용. 알림/검색 버튼 2개는 네이티브 `<button>` | **중간** |
| `src/widgets/community/PostCard.tsx` | Button | 좋아요 버튼 1개 네이티브 `<button>` | **중간** |
| `src/widgets/layout/SideGNB.tsx` | Button | 닫기/퀵필터/메뉴 등 모두 네이티브 `<button>` | **높음** |
| `src/widgets/result/ComparisonAccordion.tsx` | Button | 아코디언 토글 1개 네이티브 `<button>` | **중간** |
| `src/widgets/artifact/ui/ArtifactViewer.tsx` | Button | 닫기 버튼 네이티브 `<button>` | **중간** |
| `src/widgets/profile/SettingsMenu.tsx` | Button | 메뉴 행·로그아웃 버튼 모두 네이티브 `<button>` | **높음** |

### 1-b) 일부만 쓰고 나머지는 네이티브 + Tailwind인 페이지/위젯

| 파일 경로 | 공통 사용 현황 | 네이티브로 남은 UI 요소 | 2차 적용 우선순위 |
|-----------|----------------|--------------------------|-------------------|
| `src/pages/auth/Login.tsx` | Button 2개(SNS) | 뒤로가기 버튼, "회원가입" 링크 버튼; 카카오/구글은 Button이지만 `bg-[#FEE500]` 등 인라인 오버라이드 | **높음** |
| `src/pages/auth/Onboarding.tsx` | Button(시작하기) | 뒤로가기(건너뛰기) 버튼 | **중간** |
| `src/pages/auth/Signup.tsx` | Button, TextInput, Select 전부 사용 | 뒤로가기 버튼, "로그인" 링크 버튼 | **중간** |
| `src/pages/home/ui/Page.tsx` | Button, PageContainer | "전체 보기" 버튼, FAB(글쓰기/업로드) — 네이티브 `<button>` | **높음** |
| `src/pages/archive/ui/Page.tsx` | Button, PageContainer | 정렬/필터용 버튼 2개 네이티브 | **중간** |
| `src/pages/profile/ui/Page.tsx` | Button, PageContainer | 프로필 상단 "성적 입력" 버튼, 설정 메뉴 내부는 SettingsMenu 의존 | **중간** |
| `src/pages/chat-room/ui/Page.tsx` | 없음 (Typography만) | 헤더 메뉴 버튼, 작품 썸네일 버튼, "나가기" 버튼; 로딩 문구 "AI가 생각 중..." | **높음** |
| `src/pages/result-detail/ui/Page.tsx` | Button | 뒤로가기, 삭제, 공유 등 여러 네이티브 버튼; 하단 CTA 영역 | **높음** |
| `src/pages/posts/ui/WritePostPage.tsx` | Button, TextInput, Select | 뒤로가기(헤더 X), 이미지 업로드 `<input type="file">`+label, 토글 스위치, AI 안내 블록 | **중간** |
| `src/pages/posts/ui/PostDetailPage.tsx` | Button, TextInput | 뒤로가기, 좋아요/댓글/북마크/신고 버튼 4개 | **중간** |
| `src/pages/posts/ui/QnaDetailPage.tsx` | Button, TextInput | 뒤로가기, 좋아요/답변/북마크/신고, 답변 전송 버튼 | **중간** |
| `src/features/upload/UploadFlow.tsx` | Button, TextInput | 단계별 헤더 뒤로가기, 카메라/갤러리 라벨+input, 유형 선택 토글 버튼 2개, textarea(설명) — TextInput multiline 미사용, 진행률 바, 하단 시트 버튼들 | **높음** |
| `src/features/grade/ui/GradeInputSheet.tsx` | Button | 등급/백분위 `<input type="number">` 2종, "수학 미응시" 토글 버튼; SubjectInput 컨테이너·input 전부 네이티브 | **높음** |
| `src/features/subscription/ui/SubscriptionSheet.tsx` | Button | 플랜 카드 클릭 영역(div), 결제 수단 선택 버튼 3개 네이티브 | **중간** |
| `src/features/chat/ui/ChatInput.tsx` | 없음 | 전송 input/textarea, 모델 선택·이미지 첨부·음성 버튼 등 모두 네이티브 | **높음** |
| `src/app/providers/ModalRegistry.tsx` | Button | ConfirmCreditModal 내부는 Button 사용; 메시지 일부 하드코딩 | **낮음** |

---

## 섹션 2: Tailwind 토큰/alias vs 원시 유틸 사용 현황

### 2-1) 정의된 토큰 (참조)

- **색**: `surface`, `surface-alt`, `surface-tertiary`, `muted`, `muted-alt`, `border-default`, `border-subtle`, `semantic.error` 등 (`tailwind.config.ts`, `tokens/index.ts`)
- **radius**: `rounded-large`(24px), `rounded-medium`(12px), `rounded-small`(8px)
- **zIndex**: `z-base`, `z-sticky`, `z-nav`, `z-overlay`, `z-sidebar`, `z-modal`, `z-priority`, `z-toast`, `z-critical`

### 2-2) alias를 이미 사용하는 곳

| 파일 | 사용 예 |
|------|---------|
| `src/shared/ui/Button.tsx` | `rounded-medium` (코드), 주석에 surface-alt/muted 교체 예시 |
| `src/shared/ui/FAB.tsx` | `text-text-inverse`, `z-nav` |
| `src/pages/home/ui/Page.tsx` | `rounded-large`, `z-nav` |
| `src/widgets/community/WritePostSheet.tsx` | `rounded-large` (여러 곳) |
| `src/widgets/layout/SideGNB.tsx` | `z-overlay` |
| `src/widgets/layout/BottomNav.tsx` | `z-nav` |
| `src/widgets/artifact/ui/ArtifactViewer.tsx` | `z-modal` |
| `src/shared/ui/modal/GlobalModal.tsx` | `z-modal`, `rounded-large`(bottom-sheet), `rounded-t-large` |
| `src/pages/result-detail/ui/Page.tsx` | `z-nav` (하단 CTA) |
| `src/shared/ui/GlassCard.tsx` | `rounded-large` |

### 2-3) 여전히 원시 유틸만 쓰는 곳 (요소 타입별)

**카드/패널 배경**

| 파일 | 현재 클래스 | 권장 alias |
|------|-------------|------------|
| `src/pages/home/ui/Page.tsx` (Hero, 최근 분석 카드) | `bg-dark-800`, `border-white/5`, `bg-dark-900` | `bg-surface-alt`, `border-border-default`, `bg-surface` |
| `src/widgets/community/WritePostSheet.tsx` (시트 컨테이너) | `bg-dark-800`, `border-t border-white/10` | `bg-surface-alt`, `border-t border-border-subtle` |
| `src/widgets/community/PostCard.tsx` | `bg-dark-800`, `border-white/5` | `bg-surface-alt`, `border-border-default` |
| `src/shared/ui/cards/SessionCard.tsx` | `bg-dark-800`, `border-white/5`, `bg-dark-900` | `bg-surface-alt`, `border-border-default`, `bg-surface` |
| `src/shared/ui/modal/GlobalModal.tsx` (center 모달) | `bg-dark-800`, `border-white/10` | `bg-surface-alt`, `border-border-subtle` |
| `src/pages/result-detail/ui/Page.tsx` (여러 블록) | `bg-dark-800`, `bg-dark-900`, `border-white/5`, `border-white/10` | `bg-surface-alt`/`bg-surface`, `border-border-*` |
| `src/widgets/result/ComparisonAccordion.tsx` | `bg-white/5`, `border-white/10`, `bg-dark-900/60`, `bg-dark-800` | `surface`/`surface-alt`, `border-border-subtle` |
| `src/features/grade/ui/GradeInputSheet.tsx` | `bg-dark-900/50`, `bg-dark-800` | `bg-surface`/`bg-surface-alt` |
| `src/features/subscription/ui/SubscriptionSheet.tsx` | `bg-dark-800`, `border-white/10`, `bg-dark-900` | `bg-surface-alt`, `border-border-subtle`, `bg-surface` |
| `src/features/upload/UploadFlow.tsx` | `bg-dark-900`, `bg-dark-800`, `border-white/5`, `border-white/10` | 동일 패턴 치환 |
| `src/widgets/artifact/ui/ChecklistView.tsx` | `bg-dark-900`, `border-white/5`, `bg-dark-800/50` | `bg-surface`, `border-border-default`, `bg-surface-alt` |
| `src/widgets/chat/ui/StickyContextCard.tsx` | `border-white/10`, `bg-white/5` | `border-border-subtle`, 유틸 `.glass` 또는 토큰 |
| `src/widgets/layout/BottomNav.tsx` | `bg-dark-900/90`, `border-t border-white/5` | `bg-surface/90` 또는 유지 + `border-t border-border-default` |
| `src/widgets/profile/SettingsMenu.tsx` | `bg-dark-800/50`, `hover:bg-dark-800`, `border-white/5` | `bg-surface-alt/50`, `hover:bg-surface-alt`, `border-border-default` |

**폼 컨테이너/인풋**

| 파일 | 현재 클래스 | 권장 alias |
|------|-------------|------------|
| `src/shared/ui/TextInput.tsx` | `bg-dark-800`, `border-white/5`, `placeholder-text-low` | `bg-surface-alt`, `border-border-default`, `placeholder-muted-alt` (주석에만 있음) |
| `src/shared/ui/Select.tsx` | `bg-dark-800`, `border-white/5`, `rounded-xl` | `bg-surface-alt`, `border-border-default`, `rounded-medium` |
| `src/shared/ui/Button.tsx` (variant) | `bg-dark-800`, `border-white/10`, `text-text-mid`, `hover:bg-white/5` | `bg-surface-alt`, `border-border-subtle`, `text-muted`, `hover:bg-white/5`(또는 semantic) |
| `src/features/chat/ui/ChatInput.tsx` | `bg-dark-900`, `bg-dark-800`, `border-white/5`/`border-white/10`, `text-text-mid`, `placeholder-text-low` | 전부 위와 동일 alias |
| `src/features/grade/ui/GradeInputSheet.tsx` | input `bg-dark-800`, `border-white/5` | `bg-surface-alt`, `border-border-default` |

**모달/시트/오버레이**

| 파일 | 현재 클래스 | 권장 alias |
|------|-------------|------------|
| `src/shared/ui/modal/GlobalModal.tsx` | `bg-dark-800`, `border-white/10`, `max-h-[90vh]` | `bg-surface-alt`, `border-border-subtle` (max-h는 레이아웃 토큰 있으면 적용) |
| `src/widgets/artifact/ui/ArtifactViewer.tsx` | `bg-black/60`, `border-white/10` | `bg-surface` 계열 또는 semantic overlay |
| `src/widgets/layout/SideGNB.tsx` | `bg-black/50` (backdrop) | overlay 토큰 또는 유지 |
| `src/features/upload/UploadFlow.tsx` (시트) | `bg-dark-800`, `border-t border-white/10` | `bg-surface-alt`, `border-t border-border-subtle` |

**BottomNav / SideGNB / 헤더**

| 파일 | 현재 클래스 | 권장 alias |
|------|-------------|------------|
| `src/widgets/layout/BottomNav.tsx` | `bg-dark-900/90`, `border-t border-white/5` | `bg-surface` + opacity, `border-t border-border-default` |
| `src/widgets/layout/SideGNB.tsx` | 패널 내부 `bg-dark-900`, `border-white/5` 등 | `bg-surface`, `border-border-default` |
| `src/pages/chat-room/ui/Page.tsx` (헤더) | `bg-dark-900/80`, `border-b border-white/5` | `bg-surface` + opacity, `border-border-default` |
| `src/features/upload/UploadFlow.tsx` (헤더) | `border-b border-white/5` | `border-border-default` |

**기타**

| 파일 | 현재 클래스 | 비고 |
|------|-------------|------|
| `src/app/globals.css` | `.glass`: `bg-white/5`, `border-white/10`; `.glass-panel`: `bg-dark-800/80`, `border-white/5` | 유틸 클래스 — 토큰 alias로 옮기면 일관성 상승 |
| `src/shared/ui/GlassCard.tsx` | `bg-white/5`, `border-white/10`, `bg-dark-800/80` | variant별로 surface-alt 등 적용 가능 |
| `src/shared/ui/Tooltip.tsx` | `bg-dark-800`, `border-white/10` | `bg-surface-alt`, `border-border-subtle` |
| `src/shared/ui/charts/RadarChart.tsx` | `bg-dark-800`, `border-white/10` | 동일 |
| `src/shared/ui/DeadlineTimer.tsx` | `text-text-low`, `text-semantic-warning` | `text-muted-alt`, semantic 유지 |

---

## 섹션 3: 인라인 스타일/문구/레이아웃 튐 목록

### 3-a) className 내 인라인 패턴 (`bg-[#`, `text-[`, `rounded-[`, `z-[`, `w-[`, `h-[`, `max-w-[`, `min-h-[`)

| 파일 | 라인 근처 | 요소/역할 | 토큰/공통으로 치환 가능 여부 | 우선순위 |
|------|------------|-----------|-----------------------------|----------|
| `src/pages/auth/Login.tsx` | 카카오 버튼 | `rounded-2xl h-14`, `bg-[#FEE500]`, `text-[#191919]`, `hover:bg-[#F0D800]` | Button variant + 커스텀 variant(카카오 옐로우) 또는 token 확장 | **높음** |
| `src/pages/home/ui/Page.tsx` | Hero 섹션 | `min-h-[200px]` | layout 토큰 또는 `min-h-section` 등 | 중간 |
| `src/pages/home/ui/Page.tsx` | CTA Button | `max-w-[200px]` | `max-w-content-xs` 또는 유지 | 낮음 |
| `src/pages/home/ui/Page.tsx` | 최근 분석 카드 | `min-w-[140px]` | 레이아웃 토큰 또는 유지 | 낮음 |
| `src/pages/home/ui/Page.tsx` | FAB | `w-14 h-14 min-w-[48px] min-h-[48px]` | 터치 타겟 토큰/유틸 또는 FAB 컴포넌트 | **높음** |
| `src/pages/auth/Onboarding.tsx` | 슬라이드 카드 | `w-72 h-80 rounded-[32px]` | `rounded-large`(24px) 또는 radius 토큰 추가; width/height는 레이아웃 토큰 | 중간 |
| `src/shared/ui/Tooltip.tsx` | 툴팁 | `max-w-[220px]` | 토큰 또는 유지 | 낮음 |
| `src/shared/ui/TextInput.tsx` | textarea | `min-h-[120px]` | 토큰 또는 유지 | 낮음 |
| `src/shared/ui/modal/GlobalModal.tsx` | bottom-sheet | `max-h-[90vh]` | 레이아웃 토큰 있으면 적용 | 중간 |
| `src/features/grade/ui/GradeInputSheet.tsx` | 시트 컨테이너 | `max-h-[90vh]` | 동일 | 중간 |
| `src/features/subscription/ui/SubscriptionSheet.tsx` | 시트 컨테이너 | `max-h-[90vh]` | 동일 | 중간 |
| `src/widgets/artifact/ui/ArtifactViewer.tsx` | 모달 | `max-w-lg max-h-[90vh]` | max-width는 토큰, max-h 동일 | 중간 |
| `src/widgets/artwork/ui/AnalysisCarousel.tsx` | 카드 | `min-w-[200px]` | 레이아웃 토큰 | 낮음 |
| `src/widgets/chat/ui/StickyContextCard.tsx` | 행 높이 | `h-[48px]` | 토큰 또는 유지 | 낮음 |
| `src/widgets/common/EmptyState.tsx` | 컨테이너 | `min-h-[300px]` | 토큰 또는 유지 | 낮음 |
| `src/features/chat/ui/MessageBubble.tsx` | 말풍선/버튼 | `max-w-[80%]`, `max-w-[200px]` | 레이아웃/너비 토큰 | 낮음 |
| `src/shared/ui/cards/SessionCard.tsx` | 텍스트 | `max-w-[65%]` | 유지 또는 토큰 | 낮음 |
| `src/pages/result-detail/ui/Page.tsx` | 하단 CTA | `rounded-full` (이미 토큰 있음) | — | — |

### 3-b) 문구 — STRINGS/config 없이 직접 쓰인 부분 (버튼/레이블/상태/에러)

| 파일 | 문자열 내용 | 용도 | 우선순위 |
|------|-------------|------|----------|
| `src/pages/auth/Login.tsx` | `'세션이 만료되었습니다. 다시 로그인해 주세요.'` | Toast 메시지 (에러/상태) | **높음** — STRINGS.AUTH_SESSION_EXPIRED 등으로 |
| `src/pages/auth/Login.tsx` | `카카오로 시작하기`, `Google로 시작하기` | 버튼 라벨 | **높음** — STRINGS.LOGIN_KAKAO, LOGIN_GOOGLE 등 |
| `src/pages/auth/AuthCallback.tsx` | `로그인 처리 중...` | 로딩 문구 | **높음** — STRINGS.LOADING 또는 AUTH_PROCESSING |
| `src/pages/chat-room/ui/Page.tsx` | `나가기` | 버튼 라벨 | **높음** — STRINGS.CHATROOM_EXIT 이미 있음, 미사용 |
| `src/pages/chat-room/ui/Page.tsx` | `AI가 생각 중...` | 로딩 상태 | **높음** — STRINGS.CHATROOM_THINKING 미사용 |
| `src/pages/profile/ui/Page.tsx` | `기본 플랜`, `프리미엄 플랜` | 플랜 배지 | **높음** — STRINGS.HOME_PLAN_BADGE 등 통일 |
| `src/widgets/chat/ui/SessionListPanel.tsx` | `FILTERS = ['전체', 'A등급', 'B등급', '홍익대', '국민대']` | 필터 칩 라벨 | **중간** — STRINGS 또는 community config로 |
| `src/widgets/layout/SideGNB.tsx` | `등급별` | 퀵필터 라벨 | **중간** — STRINGS.SIDEGNB_GRADE_FILTER 사용 가능 |
| `src/widgets/artifact/ui/ChecklistView.tsx` | `진행률` | 레이블 | **중간** — STRINGS.CHECKLIST_PROGRESS 등 |
| `src/features/grade/ui/GradeInputSheet.tsx` | `탐구 1과목`, `탐구 2과목` | 레이블 | **중간** — STRINGS.GRADE_INPUT_INQUIRY1/2 |
| `src/features/subscription/ui/SubscriptionSheet.tsx` | `결제 수단` | 섹션 제목 | **중간** — STRINGS.SUBSCRIPTION_PAYMENT_METHOD |
| `src/features/subscription/ui/SubscriptionSheet.tsx` | plans.features 배열 `'월 3 크레딧'`, `'기본 분석'` 등 | 플랜 기능 문구 | **중간** — STRINGS 또는 상수 모듈 |
| `src/features/subscription/ui/SubscriptionSheet.tsx` | `` `${selectedPlan} 플랜으로 업그레이드되었습니다!` `` | Toast 메시지 | **높음** — STRINGS.SUBSCRIPTION_UPGRADED(plan) |
| `src/app/providers/ModalRegistry.tsx` | `이 작업은 크레딧을 소모합니다.` | 기본 메시지 | **중간** — STRINGS.CONFIRM_CREDIT_DEFAULT |
| `src/features/upload/UploadFlow.tsx` | `카메라로 촬영` | 버튼/라벨 | **중간** — STRINGS.UPLOAD_CAMERA |
| `src/features/upload/UploadFlow.tsx` | `유형 선택` | 라벨 | **중간** — STRINGS.UPLOAD_TYPE_LABEL |
| `src/features/upload/UploadFlow.tsx` | `10MB 이하의 이미지를 선택해주세요.'` | 에러/안내 | **중간** — STRINGS.UPLOAD_FILE_SIZE |
| `src/pages/result-detail/ui/Page.tsx` | `이 결과를 삭제하면...` (Confirm 메시지) | 삭제 확인 문구 | STRINGS에 있으면 사용, 없으면 추가 |
| `src/pages/posts/ui/PostDetailPage.tsx` | `console.log('댓글 작성:', ...)` | 디버그 (제거 권장) | 낮음 |
| `src/pages/posts/ui/QnaDetailPage.tsx` | `console.log('답변 작성:', ...)` | 디버그 (제거 권장) | 낮음 |
| `src/pages/posts/ui/QnaDetailPage.tsx` | `alt="첨부 이미지"` | 이미지 alt | **중간** — STRINGS.IMAGE_ATTACHMENT_ALT 등 |

---

## 섹션 4: 디자인 시스템 2차 확장 TODO 제안 (코드라인 기반)

| # | 카테고리 | 대상 파일/컴포넌트 | 변경 방향 요약 | 예상 영향 |
|---|----------|---------------------|----------------|------------|
| 1 | 컴포넌트 통일 | `src/pages/auth/Login.tsx` | SNS 버튼 2개: Button variant 유지하되 카카오는 커스텀 variant 또는 token(primary-kakao) 추가; 뒤로가기·회원가입 링크를 Button variant="ghost" 또는 공통 링크 컴포넌트로 교체 | 작음 |
| 2 | 토큰 alias 적용 | `src/shared/ui/Button.tsx`, `TextInput.tsx`, `Select.tsx` | secondary/ghost의 `bg-dark-800`, `border-white/5`, `text-text-mid` → `bg-surface-alt`, `border-border-default`, `text-muted`; Input/Select baseClasses 동일 치환 | 중간 |
| 3 | 토큰 alias 적용 | `src/pages/home/ui/Page.tsx` | Hero·최근 분석 카드·FAB 영역: `bg-dark-800`, `border-white/5` → `bg-surface-alt`, `border-border-default`; FAB는 `<Button>` 또는 공통 FAB 컴포넌트로 교체, `z-nav` 유지 | 중간 |
| 4 | 컴포넌트 통일 | `src/widgets/layout/BottomNav.tsx` | 탭 4개 네이티브 `<button>` → Button variant="ghost" size="sm" 또는 NavTab 공통 컴포넌트; `z-nav`, `bg-dark-900/90` → `bg-surface` + opacity, `border-border-default` | 중간 |
| 5 | 컴포넌트 통일 | `src/widgets/community/SubTabBar.tsx` | 탭 3개 `<button>` → Button variant="ghost" 또는 탭 전용 컴포넌트; 배경/테두리 토큰 alias 적용 | 작음 |
| 6 | 컴포넌트 통일 + 토큰 | `src/widgets/profile/SettingsMenu.tsx` | 메뉴 행·로그아웃을 Button variant="ghost"/"secondary" 및 semantic.error 스타일로 교체; `bg-dark-800/50` → `bg-surface-alt/50`, `border-border-default` | 작음 |
| 7 | 컴포넌트 통일 | `src/pages/chat-room/ui/Page.tsx` | 헤더 메뉴·나가기 버튼을 Button으로 교체; "나가기" → STRINGS.CHATROOM_EXIT, "AI가 생각 중..." → STRINGS.CHATROOM_THINKING | 작음 |
| 8 | 컴포넌트 통일 + 토큰 | `src/features/upload/UploadFlow.tsx` | 단계별 헤더 버튼, 카메라/갤러리 라벨, 유형 선택 토글을 Button/TextInput(multiline)으로 통일; 시트·패널 `bg-dark-800`/`border-white/5` → surface-alt/border-default; 문구 STRINGS로 이관 | 큼 |
| 9 | 컴포넌트 통일 + 토큰 | `src/features/grade/ui/GradeInputSheet.tsx` | 등급/백분위 input을 TextInput type="number" 또는 number 전용 공통 컴포넌트로 교체; 컨테이너·input 스타일 토큰 alias; "탐구 1과목/2과목" STRINGS | 중간 |
| 10 | 토큰 alias 적용 | `src/widgets/community/PostCard.tsx`, `WritePostSheet.tsx`, `ContextBar.tsx` | 카드/시트 `bg-dark-800`, `border-white/5` → `bg-surface-alt`, `border-border-default`; ContextBar 알림/검색 버튼 Button variant="ghost" | 중간 |
| 11 | 토큰 alias 적용 | `src/shared/ui/cards/SessionCard.tsx`, `Tooltip.tsx`, `GlassCard.tsx`, `globals.css` | SessionCard/Tooltip/GlassCard 배경·테두리 → surface-alt, border-default/subtle; globals.css `.glass`/`.glass-panel`에서 동일 색 alias 참조 | 중간 |
| 12 | 인라인 스타일 정리 | `src/pages/auth/Login.tsx` | `bg-[#FEE500]` 등 카카오 컬러를 tailwind theme 확장(primary-kakao) 또는 Button variant로 분리해 제거 | 작음 |
| 13 | 문구/STRINGS 정리 | `src/pages/auth/Login.tsx`, `AuthCallback.tsx`, `chat-room/Page.tsx`, `profile/Page.tsx`, `SessionListPanel`, `SubscriptionSheet`, `UploadFlow` | 위 3-b 표의 항목을 STRINGS 또는 config 상수로 이관; CHATROOM_EXIT/CHATROOM_THINKING 기존 STRINGS 사용 | 중간 |
| 14 | 컴포넌트 통일 | `src/features/chat/ui/ChatInput.tsx` | 전송 input/textarea를 TextInput(multiline)으로, 모델 선택·첨부 버튼을 Button으로 교체; 배경/테두리 토큰 alias | 중간 |
| 15 | 토큰 alias 적용 | `src/pages/result-detail/ui/Page.tsx`, `ComparisonAccordion.tsx`, `StickyContextCard.tsx` | 카드/패널/헤더 전반 `bg-dark-*`, `border-white/*` → surface/border alias | 중간 |

---

## 섹션 5: 참조용 코드 스니펫 (before / after)

### 스니펫 1: 카드 배경 — 원시 유틸 → 토큰 alias

**대상**: `src/pages/home/ui/Page.tsx` Hero 섹션 및 최근 분석 카드

```tsx
// Before
<section className="relative overflow-visible rounded-large bg-dark-800 border border-white/5">
  <div className="rounded-large bg-gradient-to-br from-primary-lime/5 to-transparent p-6 min-h-[200px] ...">
    ...
    <div className="w-full aspect-[4/5] bg-dark-800 rounded-xl border border-white/5 overflow-hidden ...">
```

```tsx
// After
<section className="relative overflow-visible rounded-large bg-surface-alt border border-border-default">
  <div className="rounded-large bg-gradient-to-br from-primary-lime/5 to-transparent p-6 min-h-[200px] ...">
    ...
    <div className="w-full aspect-[4/5] bg-surface-alt rounded-medium border border-border-default overflow-hidden ...">
```

---

### 스니펫 2: Login SNS 버튼 — 인라인 색상 제거 + STRINGS

**대상**: `src/pages/auth/Login.tsx`

```tsx
// Before
<Button
  fullWidth
  size="lg"
  className="rounded-2xl h-14 text-base font-bold bg-[#FEE500] text-[#191919] hover:bg-[#F0D800]"
  onClick={handleKakaoLogin}
>
  카카오로 시작하기
</Button>
<Button ... variant="secondary" ...>
  Google로 시작하기
</Button>
```

```tsx
// After (옵션 A: tailwind.config에 primary-kakao 추가 후)
<Button
  fullWidth
  size="lg"
  className="rounded-large h-14 text-base font-bold bg-primary-kakao text-primary-kakao-inverse hover:brightness-110"
  onClick={handleKakaoLogin}
>
  {STRINGS.LOGIN_KAKAO}
</Button>
<Button fullWidth size="lg" variant="secondary" className="rounded-large h-14 text-base font-bold" onClick={handleGoogleLogin}>
  {STRINGS.LOGIN_GOOGLE}
</Button>
```

- `strings.ts`에 `LOGIN_KAKAO: '카카오로 시작하기'`, `LOGIN_GOOGLE: 'Google로 시작하기'` 추가.

---

### 스니펫 3: BottomNav 탭 — 네이티브 button → Button + 토큰

**대상**: `src/widgets/layout/BottomNav.tsx`

```tsx
// Before
<motion.nav className="fixed bottom-0 w-full z-nav bg-dark-900/90 backdrop-blur-xl border-t border-white/5 pb-safe">
  <div className="flex justify-around items-center h-16">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => handleTabPress(tab)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            isActive ? 'text-primary-lime' : 'text-text-mid'
          }`}
        >
          <Icon size={24} ... />
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      );
    })}
  </div>
</motion.nav>
```

```tsx
// After
<motion.nav className="fixed bottom-0 w-full z-nav bg-surface/90 backdrop-blur-xl border-t border-border-default pb-safe">
  <div className="flex justify-around items-center h-16">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      return (
        <Button
          key={tab.id}
          variant="ghost"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 rounded-none min-w-0 ${
            isActive ? 'text-primary-lime' : 'text-muted'
          }`}
          onClick={() => handleTabPress(tab)}
        >
          <Icon size={24} ... />
          <span className="text-caption font-medium">{tab.label}</span>
        </Button>
      );
    })}
  </div>
</motion.nav>
```

- `tab.label`은 이미 STRINGS(NAV_HOME 등) 사용 권장.

---

이 문서는 **진단 및 TODO 우선순위 정리**용이며, 실제 수정은 작업 단위로 적용하면 됩니다.
