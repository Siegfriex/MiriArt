# 팔레트 SSOT 설계 — 1차·2차 통합

## 1) 현재 색 정의 인벤토리 (기존 팔레트)

### 1-1. shared primitives / semantic

| 구분 | 키 | 현재 값 | 참조/직접 |
|------|----|---------|-----------|
| **primitives.color** | lime400 | #C2F970 | 직접 hex |
| | lime300 | #D4FB9E | 직접 hex |
| | dark900 | #121212 | 직접 hex |
| | dark800 | #1E1E1E | 직접 hex |
| | dark700 | #2C2C2C | 직접 hex |
| | dark600 | #3A3A3A | 직접 hex |
| | white | #FFFFFF | 직접 hex |
| | gray400 | #A1A1AA | 직접 hex |
| | gray500 | #71717A | 직접 hex |
| | red500 | #E53935 | 직접 hex |
| | blue500 | #1E88E5 | 직접 hex |
| | orange500 | #F97316 | 직접 hex |
| **semantic.color** | bgPrimary | dark900 | primitives |
| | bgSecondary | dark800 | primitives |
| | bgTertiary | dark700 | primitives |
| | brandPrimary | lime400 | primitives |
| | brandDim | rgba(194,249,112,0.10) | 직접 |
| | borderDefault | rgba(255,255,255,0.05) | 직접 |
| | borderSubtle | rgba(255,255,255,0.10) | 직접 |
| | borderActive | rgba(194,249,112,0.30) | 직접 |
| | statusError | red500 | primitives |
| | statusInfo | blue500 | primitives |
| | statusSuccess | lime400 | primitives |
| | statusWarning | orange500 | primitives |

### 1-2. design brand/neutral/semantic

| 구분 | 키 | hex/값 |
|------|----|--------|
| **brand** | primary | #C2F970 |
| | primaryHover | #B8F060 |
| | primaryMuted | rgba(194, 249, 112, 0.15) |
| **neutral** | 0 | #FFFFFF |
| | 100 | #F5F5F5 |
| | 200 | #E5E5E5 |
| | 300 | #D4D4D4 |
| | 400 | #A1A1AA |
| | 500 | #71717A |
| | 600 | #3A3A3A |
| | 700 | #2C2C2C |
| | 800 | #1E1E1E |
| | 900 | #121212 |
| **semantic** | success default | #22C55E |
| | success muted | rgba(34,197,94,0.15) |
| | warning default | #F97316 |
| | warning muted | rgba(249,115,22,0.15) |
| | error default | #E53935 |
| | error muted | rgba(229,57,53,0.15) |
| | info default | #1E88E5 |
| | info muted | rgba(30,136,229,0.15) |

### 1-3. Tailwind에서 실제로 쓰는 색 키

- **shared 기반**: `primary-lime`, `primary-lime-dim`, `dark-900/800/700/600`, `surface`, `surface-alt`, `surface-tertiary`, `muted`, `muted-alt`, `border-default`, `border-subtle`, `text-primary`, `text-secondary`, `text-mid`, `text-low`, `text-inverse`, `semantic.error/success/warning/info` (객체 중첩)
- **design 기반** (designThemeAdditive.colors spread): `brand-primary`, `brand-primary-hover`, `brand-primary-muted`, `neutral-0`~`neutral-900`, `semantic-success`, `semantic-success-muted`, `semantic-warning`, `semantic-warning-muted`, `semantic-error`, `semantic-error-muted`, `semantic-info`, `semantic-info-muted`
- **실제 사용**: 컴포넌트는 주로 `primary-lime`, `dark-*`, `text-*`, `bg-semantic-error`, `text-semantic-error` 등 사용. `semantic-*` 캐밥 키는 design spread로 덮어씌워져 design/tokens 값이 적용됨.

---

## 2) 새 팔레트 → primitives 설계안 (1차)

- **Primary**: #4CAF50 → lime400, lime300(밝은 변형)
- **Secondary**: #124975 → blue500(info/액센트)
- **Neutral/BG**: #18242D(darkest), #5C6B75(mid), #E3EDF3·#F3F7F9(라이트) → dark*·gray*

매핑:

| primitives 필드 | 새 값 | 비고 |
|-----------------|------|------|
| lime400 | #4CAF50 | Primary |
| lime300 | #66BB6A | Primary hover/dim |
| dark900 | #18242D | BG darkest |
| dark800 | #1E2D3D | BG |
| dark700 | #2A3A4A | BG |
| dark600 | #5C6B75 | BG + gray 계열 |
| gray400 | #9CA8B2 | 텍스트 mid (18242D 위 대비) |
| gray500 | #5C6B75 | 텍스트 low |
| blue500 | #124975 | Secondary / info |
| red500, orange500 | 유지 | error, warning |

---

## 3) semantic 상태색 설계 (2차)

- **statusSuccess**: Primary와 구분되는 그린 → #43A047 (successGreen). muted: rgba(67,160,71,0.15)
- **statusError**: red500 #E53935 유지. muted: rgba(229,57,53,0.15)
- **statusWarning**: orange500 #F97316 유지. muted: rgba(249,115,22,0.15)
- **statusInfo**: Secondary #124975 (infoBlue). muted: rgba(18,73,117,0.15)

primitives에 추가: successGreen, successGreenMuted, errorRed, errorRedMuted, warningOrange, warningOrangeMuted, infoBlue, infoBlueMuted.  
semantic은 위 primitives만 참조.

---

## 4) SSOT 통합

- design/tokens.ts: brand/neutral/semantic 색을 shared primitives/semantic에서 re-export 또는 import하여 사용.
- tailwind.config.ts: semantic-* 캐밥 키는 shared semantic 기반으로만 노출. designThemeAdditive.colors에서 semantic-* 제거하거나, design이 shared를 참조하도록 변경.

---

## 5) 상태색 사용처 & QA 체크 포인트

### 5-1. 상태색 사용처 인벤토리

| 파일 | 용도 |
|------|------|
| `src/pages/result-detail/ui/Page.tsx` | fixScope 뱃지 (StructureRebuild → semantic-error, else primary-lime) |
| `src/pages/posts/ui/PostDetailPage.tsx` | 좋아요 버튼 text-semantic-error, 북마크 호버 |
| `src/pages/posts/ui/QnaDetailPage.tsx` | OPEN 뱃지 bg-semantic-error/10, 좋아요 semantic-error |
| `src/widgets/chat/ui/StickyContextCard.tsx` | 재설계/조정 뱃지 border/text/bg semantic-error vs primary-lime |
| `src/widgets/chat/ui/SessionCard.tsx` | 에러/primary 뱃지 border-semantic-error, bg-semantic-error/10 |
| `src/features/upload/UploadFlow.tsx` | 실패 상태 아이콘/테두리 bg-semantic-error/20, border-semantic-error/30 |
| `src/shared/ui/Toast.tsx` | error 타입 bg-semantic-error |
| `src/shared/ui/modal/ConfirmDialog.tsx` | destructive 제목/버튼 text-semantic-error, bg-semantic-error |
| `src/shared/ui/TextInput.tsx` | errorClasses border-semantic-error, ring-semantic-error |
| `src/shared/ui/Select.tsx` | errorClasses border-semantic-error, ring-semantic-error |
| `src/features/chat/ui/ChatInput.tsx` | 에러 뱃지 bg-semantic-error |
| `src/widgets/profile/SettingsMenu.tsx` | 로그아웃 텍스트 text-semantic-error, hover:bg-semantic-error/10 |
| `src/shared/ui/DeadlineTimer.tsx` | 만료 전 text-semantic-warning |
| `src/widgets/community/PostCard.tsx` | 좋아요 text-semantic-error |

### 5-2. QA 우선 체크 화면 (5개)

1. **로그인/회원가입 폼** — 에러 상태 시 Input/Select 테두리·링 색 (semantic-error).
2. **QnA 상세** — OPEN/SOLVED 뱃지, 좋아요 버튼 색 (semantic-error vs primary-lime).
3. **커뮤니티 피드** — 좋아요 아이콘, 에러 토스트 (Toast error 타입).
4. **업로드 플로우** — 실패 시 아이콘·테두리 (bg/border semantic-error).
5. **삭제 확인 모달** — destructive 버튼·제목 (ConfirmDialog semantic-error).
