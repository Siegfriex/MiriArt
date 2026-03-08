# 팔레트 SSOT 1차·2차 적용 — 최종 보고 (코드 라인 인용)

## 적용 요약

- **1차**: `primitives.color.*`를 새 팔레트(4CAF50, 124975, F3F7F9, E3EDF3, 5C6B75, 18242D)로 교체.
- **2차**: `semantic.color` 상태색을 primitives 기반으로 재매핑, design/tokens·tailwind를 shared SSOT로 통합.

---

## 1. `src/shared/ui/tokens/index.ts`

### 1-1. primitives.color (1차)

**위치**: 10~41행

| 라인 | 내용 |
|------|------|
| 10 | 주석: 새 팔레트 Primary #4CAF50, Secondary #124975, BG #18242D/#5C6B75, Neutral #F3F7F9/#E3EDF3 |
| 14~15 | `lime400: '#4CAF50'`, `lime300: '#66BB6A'` (Primary) |
| 17~20 | `dark900: '#18242D'`, `dark800: '#1E2D3D'`, `dark700: '#2A3A4A'`, `dark600: '#5C6B75'` |
| 21~22 | `white`, `gray400: '#9CA8B2'`, `gray500: '#5C6B75'` |
| 24~26 | `red500`, `blue500: '#124975'`, `orange500` (유지) |
| 27~34 | 상태 base+muted: `successGreen`/`successGreenMuted`, `errorRed`/`errorRedMuted`, `warningOrange`/`warningOrangeMuted`, `infoBlue`/`infoBlueMuted` |
| 36~37 | `primaryMuted: 'rgba(76,175,80,0.10)'`, `primaryBorder: 'rgba(76,175,80,0.30)'` |
| 39~40 | `neutralLight100: '#F3F7F9'`, `neutralLight200: '#E3EDF3'` |

**인용**:

```10:41:src/shared/ui/tokens/index.ts
/** 원시 토큰: color, spacing, radius, opacity. 새 팔레트: Primary #4CAF50, Secondary #124975, BG #18242D/#5C6B75, Neutral #F3F7F9/#E3EDF3 */
export const primitives = {
  color: {
    // Primary (green)
    lime400: '#4CAF50',
    lime300: '#66BB6A',
    // ... dark900~dark600, gray400/500, status*, primaryMuted/Border, neutralLight100/200
  },
```

### 1-2. semantic.color (2차)

**위치**: 60~82행

| 라인 | 내용 |
|------|------|
| 70 | `brandDim: primitives.color.primaryMuted` (기존 직접 rgba 제거) |
| 73 | `borderActive: primitives.color.primaryBorder` |
| 74~81 | `statusError`/`statusErrorMuted` → errorRed/errorRedMuted, `statusInfo`/`statusInfoMuted` → infoBlue/infoBlueMuted, `statusSuccess`/`statusSuccessMuted` → successGreen/successGreenMuted, `statusWarning`/`statusWarningMuted` → warningOrange/warningOrangeMuted |

**인용**:

```60:82:src/shared/ui/tokens/index.ts
  color: {
    bgPrimary: primitives.color.dark900,
    ...
    brandDim: primitives.color.primaryMuted,
    borderDefault: 'rgba(255,255,255,0.05)',
    borderSubtle: 'rgba(255,255,255,0.10)',
    borderActive: primitives.color.primaryBorder,
    statusError: primitives.color.errorRed,
    statusErrorMuted: primitives.color.errorRedMuted,
    statusInfo: primitives.color.infoBlue,
    statusInfoMuted: primitives.color.infoBlueMuted,
    statusSuccess: primitives.color.successGreen,
    statusSuccessMuted: primitives.color.successGreenMuted,
    statusWarning: primitives.color.warningOrange,
    statusWarningMuted: primitives.color.warningOrangeMuted,
  },
```

### 1-3. semantic.shadow.glow

**위치**: 110~114행

| 라인 | 내용 |
|------|------|
| 112 | `glow: '0 0 20px rgba(76,175,80,0.30)'` (Primary #4CAF50 기준) |

**인용**:

```110:114:src/shared/ui/tokens/index.ts
  shadow: {
    soft: '0 4px 12px rgba(0,0,0,0.10)',
    glow: '0 0 20px rgba(76,175,80,0.30)',
    elevated: '0 8px 32px rgba(0,0,0,0.40)',
  },
```

---

## 2. `src/design/tokens.ts`

### 2-1. import 및 colors SSOT 전환

**위치**: 1~69행

| 라인 | 내용 |
|------|------|
| 3~4 | 주석: 색 SSOT = shared/ui/tokens (primitives + semantic) 재사용 |
| 7 | `import { primitives, semantic } from '../shared/ui/tokens';` |
| 45~69 | `colors`: brand → primitives.color.lime400/lime300/primaryMuted, neutral → primitives (white, neutralLight100/200, gray*, dark600~900), semantic → semantic.color.status* / status*Muted |

**인용**:

```1:69:src/design/tokens.ts
/**
 * MiriArt 디자인 토큰 스켈레톤 v1
 * - 색 SSOT: shared/ui/tokens (primitives + semantic) 재사용.
 */
import { primitives, semantic } from '../shared/ui/tokens';
// ...
const colors = {
  brand: {
    primary: primitives.color.lime400,
    primaryHover: primitives.color.lime300,
    primaryMuted: primitives.color.primaryMuted,
  },
  neutral: { 0: primitives.color.white, 100: primitives.color.neutralLight100, ... },
  semantic: {
    success: { default: semantic.color.statusSuccess, muted: semantic.color.statusSuccessMuted },
    ...
  },
} as const;
```

---

## 3. `tailwind.config.ts`

### 3-1. colors.semantic → shared semantic 참조

**위치**: 38~43행

| 라인 | 내용 |
|------|------|
| 38~42 | `semantic: { error: semantic.color.statusError, info: semantic.color.statusInfo, success: semantic.color.statusSuccess, warning: semantic.color.statusWarning }` (기존 primitives 직접 참조 제거) |

**인용**:

```38:43:tailwind.config.ts
        semantic: {
          error: semantic.color.statusError,
          info: semantic.color.statusInfo,
          success: semantic.color.statusSuccess,
          warning: semantic.color.statusWarning,
        },
        ...designThemeAdditive.colors,
```

### 3-2. boxShadow → semantic.shadow 참조

**위치**: 71~76행

| 라인 | 내용 |
|------|------|
| 72~74 | `soft: semantic.shadow.soft`, `glow: semantic.shadow.glow`, `elevated: semantic.shadow.elevated` (glow 하드코딩 제거) |

**인용**:

```71:76:tailwind.config.ts
      boxShadow: {
        soft: semantic.shadow.soft,
        glow: semantic.shadow.glow,
        elevated: semantic.shadow.elevated,
        ...designThemeAdditive.boxShadow,
      },
```

---

## 4. 파생 경로 (수정 없음, 자동 반영)

- **`src/shared/ui/tokens/rootVars.ts`**: `getRootVarsObject()`가 `primitives`·`semantic`만 참조하므로, index.ts 변경만으로 `--color-brand`, `--color-bg-primary` 등 CSS 변수에 새 팔레트 반영.
- **`index.tsx`**: `injectRootVars()` 호출만 있음. rootVars 경로 변경 없음.
- **`src/app/globals.css`**: `var(--color-brand)`, `var(--color-bg-primary)` 등 그대로 사용.

---

## 5. 상태색 사용처 (Tailwind 클래스 기준, 라인 참고용)

| 파일 | 대표 라인·용도 |
|------|----------------|
| `src/pages/result-detail/ui/Page.tsx` | ~199: fixScope 뱃지 `bg-semantic-error` / `bg-primary-lime` |
| `src/pages/posts/ui/PostDetailPage.tsx` | ~94, ~106: 좋아요 `text-semantic-error` |
| `src/pages/posts/ui/QnaDetailPage.tsx` | ~29: OPEN 뱃지 `bg-semantic-error/10 text-semantic-error`, ~113: 좋아요 |
| `src/widgets/chat/ui/StickyContextCard.tsx` | ~68, ~106: 재설계/조정 뱃지 `border-semantic-error/30`, `bg-semantic-error/10` |
| `src/widgets/chat/ui/SessionCard.tsx` | ~70: 에러 뱃지 `border-semantic-error/30`, `bg-semantic-error/10` |
| `src/features/upload/UploadFlow.tsx` | ~366~367: 실패 UI `bg-semantic-error/20`, `border-semantic-error/30` |
| `src/shared/ui/Toast.tsx` | ~21: error 타입 `bg-semantic-error` |
| `src/shared/ui/modal/ConfirmDialog.tsx` | ~49, ~59: destructive `text-semantic-error`, `bg-semantic-error` |
| `src/shared/ui/TextInput.tsx` | ~29: errorClasses `border-semantic-error`, `ring-semantic-error` |
| `src/shared/ui/Select.tsx` | ~25: 동일 errorClasses |
| `src/features/chat/ui/ChatInput.tsx` | ~86: 에러 뱃지 `bg-semantic-error` |
| `src/widgets/profile/SettingsMenu.tsx` | ~63: 로그아웃 `text-semantic-error`, `hover:bg-semantic-error/10` |
| `src/shared/ui/DeadlineTimer.tsx` | ~40: `text-semantic-warning` |
| `src/widgets/community/PostCard.tsx` | ~113: 좋아요 `text-semantic-error` |

위 파일들은 **클래스명 변경 없이** shared → design → Tailwind 경로로 새 값이 적용됨.

---

## 6. QA 우선 체크 (5곳)

1. **로그인/회원가입 폼** — Input/Select 에러 시 테두리·링 (semantic-error).
2. **QnA 상세** — OPEN/SOLVED 뱃지, 좋아요 버튼 (semantic-error vs primary-lime).
3. **커뮤니티 피드** — 좋아요 아이콘, Toast error.
4. **업로드 플로우** — 실패 시 아이콘·테두리 (semantic-error).
5. **삭제 확인 모달** — destructive 제목·버튼 (semantic-error).

---

## 7. 수정 파일 목록 (최종)

| 파일 | 변경 요약 |
|------|-----------|
| `src/shared/ui/tokens/index.ts` | primitives.color 새 팔레트(10~41), semantic.color 상태색·brandDim·borderActive 재매핑(60~82), shadow.glow(112) |
| `src/design/tokens.ts` | shared import(7), colors를 primitives/semantic 참조로 교체(45~69) |
| `tailwind.config.ts` | colors.semantic을 semantic.color.status* 참조(38~42), boxShadow를 semantic.shadow 참조(72~74) |
| `docs/design-system/palette-ssot-design.md` | 설계·인벤토리·QA 정리 |
| `docs/design-system/palette-ssot-final-report.md` | 본 최종 보고 (코드 라인 인용) |
