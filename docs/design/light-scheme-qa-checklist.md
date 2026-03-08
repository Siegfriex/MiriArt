# 라이트 스킴 전환 후 QA 체크리스트

## 적용 요약

- **primitives**: gray400 #8B9CA8, gray500 #9CA8B2, 상태 muted 0.12, borderDefaultLight/borderSubtleLight 추가.
- **semantic**: bgPrimary=neutralLight100, bgSecondary=neutralLight200, bgTertiary=white, textHigh=dark900, textMid=dark600, textLow=gray500, textInverse=white, border = borderDefaultLight/borderSubtleLight.
- **Tailwind**: text-primary/surface 등 = semantic 기반, designThemeAdditive 먼저 spread 후 shared로 덮어써 SSOT 유지.
- **컴포넌트**: FullScreenContainer, Button, TextInput, Select, globals.css .glass, Login, Home, PostDetail, QnaDetail, WritePost, AuthCallback, BottomNav, PostCard, Profile, ResultDetail, Onboarding, FirstUploadTutorial, SubTabBar, SessionListPanel, SessionCard, CreditStatusWidget 등 라이트용 alias 적용.

---

## 1) 본문/헤더 텍스트 vs 배경 대비 (AA/AAA)

| 확인 화면 | 확인 내용 |
|-----------|-----------|
| **홈** (`/app/home`) | H1(앱명), Hero CTA 제목·설명, 최근 분석 카드 제목이 `bg-surface`(#F3F7F9) 위에서 `text-text-primary`(#18242D)로 읽기 쉬운지. 보조 텍스트 `text-text-mid`(#5C6B75) 대비 충분한지. |
| **글 상세** (`/posts/:id`, `/qna/:id`) | 제목·본문·댓글 영역이 `bg-surface`/`surface-alt` 위에서 `text-text-primary`로 AA 이상인지. |
| **프로필** (`/app/profile`) | 프로필 제목, 닉네임, 크레딧 숫자, 학력 카드 텍스트가 라이트 배경 위에서 선명한지. |
| **글쓰기** (`/write`) | 헤더 제목, 폼 라벨·입력값이 `text-primary`/`text-mid`로 구분되는지. |

---

## 2) primary/secondary 버튼 vs 배경 대비, hover 시각 피드백

| 확인 화면 | 확인 내용 |
|-----------|-----------|
| **로그인** (`/auth/login`) | Primary(카카오/구글) 버튼 위 텍스트 가독성. Secondary 스타일 버튼이 `bg-surface-alt`+`border-border-default`로 배경과 구분되는지. |
| **홈·프로필·모달** | Primary CTA(`bg-primary-lime` + `text-text-inverse`) 대비. Secondary/Outline 버튼 hover 시 `bg-surface-tertiary` 등 피드백 확인. |
| **포커스 링** | `focus-visible:ring-primary-lime` + `ring-offset-surface`가 라이트 배경 위에서 잘 보이는지. |

---

## 3) 상태색(success/error/warning/info)과 primary 색 구분

| 확인 화면 | 확인 내용 |
|-----------|-----------|
| **QnA 상세** | OPEN(미해결) 뱃지 `bg-semantic-error/10 text-semantic-error`, SOLVED `primary-lime` 계열이 라이트 배경 위에서 구분·가독성 양호한지. |
| **Toast** | success(primary-lime 계열), error(semantic-error) 타입이 각각 구분되는지. |
| **결과 상세** | fixScope 뱃지(재설계=error, 조정=primary-lime) 구분. |
| **업로드 실패** | 에러 영역 `bg-semantic-error/20`, `border-semantic-error/30` 가독성. |

---

## 4) Input/Select 에러·disabled 상태 가독성

| 확인 화면 | 확인 내용 |
|-----------|-----------|
| **회원가입/로그인 폼** | 에러 시 `border-semantic-error`, focus ring `ring-semantic-error`가 `bg-surface-alt` 위에서 명확한지. |
| **placeholder** | `placeholder-text-low`(#8B9CA8 등)가 입력값(`text-text-primary`)과 구분되는지. |
| **disabled** | opacity 50% 등으로 비활성 상태가 분명한지. |

---

## 5) 카드/시트/모달 경계(surfaces) 인지성

| 확인 화면 | 확인 내용 |
|-----------|-----------|
| **홈** | Hero 섹션 `bg-surface-alt`, 카드 `border-border-default`로 페이지 배경(`bg-surface`)과 구분되는지. |
| **프로필** | 구독 카드, 학력 카드가 `surface-alt` + `border-default`로 블록 구분이 되는지. |
| **모달/시트** | ConfirmDialog, WritePostSheet, UploadFlow 등이 `bg-surface-tertiary` 또는 `surface-alt`로 배경과 계층이 드러나는지. |
| **BottomNav** | `bg-surface-alt/95` + `border-border-default`로 상단 콘텐츠와 구분되는지. |

---

## 나머지 적용 패턴 (추가 점검 시 참고)

아직 `bg-dark-900`/`bg-dark-800`/`text-white`가 남아 있을 수 있는 파일:

- **UploadFlow** (여러 스텝): 컨테이너 `bg-dark-900` → `bg-surface`, 콘텐츠 블록 `bg-dark-800` → `bg-surface-alt`, 헤더/본문 `text-white` → `text-text-primary`.
- **ComparisonAccordion, RadarChart, ArtifactViewer, GalleryView** 등: 이미지/오버레이 위 텍스트는 가독을 위해 `text-white` 유지 가능. 카드 배경만 `surface-alt`/`border-default`로 전환하면 됨.
- **ChatInput, chat-room Page**: 입력 영역·헤더를 `surface-alt`/`text-primary` 기준으로 필요 시 조정.
- **GlassCard, PersonaAvatar** 등: 사용처가 라이트 배경이면 `glass`/`glass-panel`(globals.css)이 이미 라이트용으로 수정됨.

일관 규칙: **배경**은 `bg-surface`(페이지), `bg-surface-alt`(섹션/카드), `bg-surface-tertiary`(내부 블록). **본문/헤더**는 `text-text-primary`, 보조는 `text-text-mid`/`text-low`. **disabled**는 `text-disabled` 토큰 사용 권장(개별 opacity 대신). **테두리**는 `border-border-default`/`border-subtle`. **색 배경 위 텍스트**(primary 버튼, 에러 뱃지 등)는 `text-text-inverse` 또는 `text-white` 유지.

---

## 6) 아이콘 전용 / 서브틀 컨트롤 (1회 집중)

실제 기기에서 아래 네 군데만 한 번 쭉 돌려보기. 최소 3:1 대비 수준 확인.

| 대상 | 확인 내용 |
|------|-----------|
| **BottomNav** | 활성/비활성 아이콘·라벨이 `bg-surface-alt/95` 위에서 구분·가독되는지. |
| **SubTabBar** | 활성/비활성 탭 텍스트·아이콘 대비. |
| **FilterChip** | 선택/비선택 상태가 border·배경으로 명확한지. |
| **ContextBar** | 액션 아이콘(알림, 검색) hover 시 시인성. |

---

## 7) 포커스 / 키보드 내비게이션 (1회)

아래 네 화면에서 **Tab으로 한 바퀴** 돌며 `focus-visible` 링(ring-primary-lime + ring-offset-surface)이 보이는지 확인. 포커스가 안 보이는 컴포넌트가 나오면 해당 컴포넌트만 ring/offset 보완.

| 화면 | 경로 |
|------|------|
| 로그인 | `/auth/login` |
| 글쓰기 | `/write` |
| 홈 | `/app/home` |
| 채팅방 | `/chat/:sessionId` |
