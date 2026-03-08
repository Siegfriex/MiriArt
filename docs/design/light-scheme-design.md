# 라이트 스킴 전환 설계 — 새 팔레트 + WCAG AA/AAA

## 1) 현재 색 체계 인벤토리 (다크 스킴 기준)

> 현재 코드: 새 팔레트 hex(4CAF50, 124975, 18242D, 5C6B75, F3F7F9, E3EDF3)가 primitives에 반영되어 있으나, **semantic은 여전히 다크 스킴 역할**(배경=어두운색, 본문=흰색)로 연결되어 있음.

### 1-1. shared primitives / semantic

**primitives.color** (`src/shared/ui/tokens/index.ts` 12~41행)

| 키 | hex | 비고 |
|----|-----|------|
| lime400 | #4CAF50 | Primary |
| lime300 | #66BB6A | Primary hover |
| dark900 | #18242D | BG darkest (현재 semantic bgPrimary) |
| dark800 | #1E2D3D | |
| dark700 | #2A3A4A | |
| dark600 | #5C6B75 | |
| white | #FFFFFF | |
| gray400 | #9CA8B2 | |
| gray500 | #5C6B75 | |
| red500, blue500, orange500 | #E53935, #124975, #F97316 | |
| successGreen, successGreenMuted | #43A047, rgba(67,160,71,0.15) | |
| errorRed, errorRedMuted | #E53935, rgba(229,57,53,0.15) | |
| warningOrange, warningOrangeMuted | #F97316, rgba(249,115,22,0.15) | |
| infoBlue, infoBlueMuted | #124975, rgba(18,73,117,0.15) | |
| primaryMuted, primaryBorder | rgba(76,175,80,0.10/0.30) | |
| neutralLight100, neutralLight200 | #F3F7F9, #E3EDF3 | |

**semantic.color** (동일 파일 60~82행)

| 키 | 현재 값 | 참조/직접 |
|----|---------|-----------|
| bgPrimary | dark900 | primitives (#18242D) |
| bgSecondary | dark800 | primitives |
| bgTertiary | dark700 | primitives |
| textHigh | white | primitives (다크 스킴 본문) |
| textMid | gray400 | primitives |
| textLow | gray500 | primitives |
| textInverse | dark900 | primitives (버튼 위 텍스트) |
| brandPrimary | lime400 | primitives |
| brandDim | primaryMuted | primitives |
| borderDefault / borderSubtle | rgba(255,255,255,0.05/0.10) | 직접 (다크용) |
| borderActive | primaryBorder | primitives |
| statusError/Info/Success/Warning + Muted | errorRed, infoBlue, successGreen, warningOrange 등 | primitives |

### 1-2. design brand/neutral/semantic

`src/design/tokens.ts` — 이미 shared 기반으로 리팩터됨(7행 import, 45~69행).

| 구분 | 현재 소스 | 값(실제) |
|------|-----------|----------|
| brand.primary / primaryHover / primaryMuted | primitives.lime400, lime300, primaryMuted | #4CAF50, #66BB6A, rgba(76,175,80,0.10) |
| neutral.0~900 | primitives.white, neutralLight100/200, gray*, dark600~900 | #FFF, #F3F7F9, #E3EDF3, #9CA8B2, #5C6B75, #1E2D3D~#18242D |
| semantic.success/error/warning/info | semantic.color.status* | shared와 동일 |

### 1-3. Tailwind 최종 색 키

**shared 기반** (tailwind.config.ts 17~43행):  
`primary-lime`, `primary-lime-dim`, `dark-900/800/700/600`, `surface`, `surface-alt`, `surface-tertiary`, `muted`, `muted-alt`, `border-default`, `border-subtle`, `text-primary`(white), `text-secondary`, `text-mid`, `text-low`, `text-inverse`(dark900), `semantic.error/success/warning/info`.

**design 기반** (designThemeAdditive.colors spread):  
`brand-primary`, `brand-primary-hover`, `brand-primary-muted`, `neutral-0`~`neutral-900`, `semantic-success`, `semantic-success-muted`, `semantic-error`, `semantic-error-muted`, `semantic-warning`, `semantic-info`, `semantic-info-muted`.

**요약**: 다크 스킴에서는 배경=dark*, surface=dark*, 본문=white/gray → 라이트 전환 시 배경=neutralLight/white, 본문=dark900/gray 로 역할만 바꾸면 됨.

---

## 2) 라이트 스킴 설계 (역할 재해석 + 새 팔레트 매핑)

### 2-1. 역할 재해석 (라이트 기준, hex)

| 역할 | 제안 hex | 비고 |
|------|----------|------|
| 페이지 배경 (bgPrimary) | #F3F7F9 | neutralLight100 |
| 섹션/스트립 배경 (bgSecondary) | #E3EDF3 | neutralLight200 |
| 카드/폼/시트 (surface, bgTertiary) | #FFFFFF | white |
| 기본 텍스트 (textPrimary) | #18242D | dark900, 본문·헤더 |
| 보조 텍스트 (textMid) | #5C6B75 | dark600 |
| 저강도 텍스트/placeholder (textLow) | #8B9CA8 | gray400 또는 새 톤 |
| primary 버튼/CTA base | #4CAF50 | lime400 |
| primary 버튼 hover | #66BB6A | lime300 |
| primary 위 텍스트 (textInverse) | #FFFFFF | white |
| secondary/링크 | #124975 | infoBlue |

### 2-2. WCAG/시인성 관점

- **textPrimary(#18242D) vs bgPrimary(#F3F7F9)**  
  대비 약 12:1 수준 → **안전(AAA)**.

- **textMid(#5C6B75) vs bgPrimary(#F3F7F9)**  
  대비 약 4.5~5:1 → **안전(AA)**.  
  vs bgSecondary(#E3EDF3)도 AA 수준 유지.

- **primary(#4CAF50) vs bgPrimary(#F3F7F9)**  
  버튼 배경으로 쓸 때: **안전**.  
  primary 위 텍스트는 white → **안전(AAA)**.

- **statusError(#E53935) / success(#43A047) vs #F3F7F9**  
  대비 4.5 이상 → **안전(AA)**.  
  muted 배경은 연한 tint라 텍스트는 base 색 또는 dark900 쓰면 **안전**.

### 2-3. primitives.color 설계안 (라이트 스킴, 키 유지·값만 재배치)

기존 Tailwind 클래스명(primary-lime, dark-*, surface, text-mid 등)은 그대로 두고, **라이트용 역할**에 맞춰 primitives 값을 배치.

| primitives 키 | 라이트 스킴 용도 | 제안 hex | 비고 |
|---------------|------------------|----------|------|
| dark900 | 본문/헤더(textPrimary) | #18242D | 유지 |
| dark800 | 강조 텍스트/구분선 | #1E2D3D | 유지 |
| dark700 | textSecondary 후보 | #2A3A4A | 유지 |
| dark600 | textMid, 보조 텍스트 | #5C6B75 | 유지 |
| gray400 | textLow, placeholder | #8B9CA8 | 라이트에서 약간 연하게 |
| gray500 | 비활성/더 연한 텍스트 | #5C6B75 또는 #9CA8B2 | dark600와 통일 또는 구분 |
| white | surface, 카드 배경, textInverse | #FFFFFF | 유지 |
| neutralLight100 | bgPrimary (페이지 배경) | #F3F7F9 | 유지 |
| neutralLight200 | bgSecondary (섹션 배경) | #E3EDF3 | 유지 |
| lime400, lime300 | primary CTA base/hover | #4CAF50, #66BB6A | 유지 |
| blue500, infoBlue | secondary, 링크 | #124975 | 유지 |
| successGreen, errorRed, warningOrange | 상태색 | #43A047, #E53935, #F97316 | 유지 |

**border**: 라이트에서는 어두운 톤이 필요.  
- borderDefault: `rgba(24,36,45,0.08)` (dark900 기반)  
- borderSubtle: `rgba(24,36,45,0.12)`  

primitives에 추가 제안:  
`borderDefaultLight: 'rgba(24,36,45,0.08)'`, `borderSubtleLight: 'rgba(24,36,45,0.12)'`.  
(아래 3-3에서 semantic이 이 둘만 참조하도록 제안.)

---

## 3) semantic 재해석 & 상태색 설계

### 3-1. semantic.bg/text 재해석 (라이트)

| semantic 키 | 라이트 역할 | primitives 참조 |
|-------------|-------------|------------------|
| bgPrimary | 페이지 배경 | neutralLight100 |
| bgSecondary | 섹션/컨텐츠 영역 | neutralLight200 |
| bgTertiary | 카드/폼/시트 | white |
| textHigh | 기본 텍스트(본문·헤더) | dark900 |
| textMid | 보조 텍스트 | dark600 또는 gray400 |
| textLow | placeholder/비활성 | gray500 또는 gray400 |
| textInverse | primary 버튼 위 텍스트 | white |
| borderDefault | 구분선(라이트) | 새: borderDefaultLight |
| borderSubtle | 강한 구분선(라이트) | 새: borderSubtleLight |

primitives에 추가 제안:  
`borderDefaultLight: 'rgba(24,36,45,0.08)'`, `borderSubtleLight: 'rgba(24,36,45,0.12)'`.

### 3-2. semantic 상태색 (라이트 배경 위)

- **statusSuccess** base: #43A047 (successGreen) 유지.  
  **statusSuccessMuted**: 라이트 배경용으로 `rgba(67,160,71,0.12)` 권장 (배경 위에서 구분되며 텍스트 대비 유지).

- **statusError** base: #E53935 유지.  
  **statusErrorMuted**: `rgba(229,57,53,0.10)` ~ `0.12`.

- **statusWarning** base: #F97316 유지.  
  **statusWarningMuted**: `rgba(249,115,22,0.12)`.

- **statusInfo** base: #124975 유지.  
  **statusInfoMuted**: `rgba(18,73,117,0.12)`.

(primary #4CAF50와 success #43A047는 이미 톤이 다르므로 구분 가능.)

### 3-3. semantic.color 수정 스니펫

primitives에 라이트용 border 2개 추가한 뒤, semantic을 아래처럼 전환.  
(스킴 전환 시점에 한 번만 적용하면 됨.)

```ts
// src/shared/ui/tokens/index.ts — primitives.color에 추가
borderDefaultLight: 'rgba(24,36,45,0.08)',
borderSubtleLight: 'rgba(24,36,45,0.12)',

// semantic.color — 라이트 스킴용 재해석 (primitives만 참조)
color: {
  bgPrimary: primitives.color.neutralLight100,
  bgSecondary: primitives.color.neutralLight200,
  bgTertiary: primitives.color.white,
  bgOverlay: 'rgba(0,0,0,0.4)',
  textHigh: primitives.color.dark900,
  textMid: primitives.color.dark600,
  textLow: primitives.color.gray500,
  textInverse: primitives.color.white,
  brandPrimary: primitives.color.lime400,
  brandDim: primitives.color.primaryMuted,
  borderDefault: primitives.color.borderDefaultLight,
  borderSubtle: primitives.color.borderSubtleLight,
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

라이트에서 status*Muted를 더 연하게 쓰고 싶으면 primitives에 `successGreenMutedLight` 등 별도 필드를 두고 위에서 참조하면 됨.

---

## 4) design/tokens & Tailwind colors SSOT 통합 (라이트 스킴 기준)

### 4-1. design/tokens → shared 기반

이미 `src/design/tokens.ts`는 shared를 import해 brand/neutral/semantic을 구성하고 있음(7행, 45~69행).  
라이트 전환 시에는 **shared 쪽 semantic만 라이트로 바꾸면** design/tokens는 수정 없이 자동 반영됨.

추가로, typography/spacing/radius/shadow는 그대로 두고, colors만 shared에 일원화되어 있으면 됨.

### 4-2. tailwind.config.ts colors 정리

- **shared가 SSOT**: `colors` 블록에서 의미 있는 색은 모두 `primitives`/`semantic` 참조로 유지.  
- **text-primary / text-inverse**: 라이트에서는 본문이 어두운색이어야 하므로, config에서 `text-primary`를 `semantic.color.textHigh`(또는 primitives.dark900)로, `text-inverse`를 `primitives.color.white`로 두면 됨.  
  현재는 `text-primary: primitives.color.white`이므로, **라이트 전환 시** `text-primary: semantic.color.textHigh`로 바꾸면 semantic 한 곳만 바꿔도 됨.

제안 스니펫:

```ts
// tailwind.config.ts — colors 내
'text-primary': semantic.color.textHigh,
'text-secondary': semantic.color.textMid,
'text-mid': semantic.color.textMid,
'text-low': semantic.color.textLow,
'text-inverse': semantic.color.textInverse,
// surface 계열도 semantic으로 통일 시
surface: semantic.color.bgPrimary,
'surface-alt': semantic.color.bgSecondary,
'surface-tertiary': semantic.color.bgTertiary,
```

그러면 라이트 전환 시 semantic만 3-3처럼 바꾸면 Tailwind의 text-*, surface* 도 함께 라이트로 전환됨.  
designThemeAdditive.colors는 그대로 두어도 되고, semantic-* 는 이미 shared semantic을 참조하므로 추가 수정 불필요.

---

## 5) UI 영향 & QA 체크 포인트 (라이트 전환 주의)

### 5-1. 영향 받는 컴포넌트

- **레이아웃**: PageContainer, FullScreenContainer — 배경이 dark → neutralLight100/white 계열로 바뀜.
- **버튼**: Button (primary/secondary/outline) — primary는 lime 배경+white 텍스트로 유지, 배경 대비만 바뀜.
- **폼**: TextInput, Select — 배경·테두리·placeholder가 라이트용 border/배경으로 전환, 에러 시 semantic-error 유지.
- **피드백**: Toast, ConfirmDialog — 배경/텍스트/버튼이 라이트 배경 위에서 읽기 쉬운지 확인.
- **카드/리스트**: PostCard, SessionCard, StickyContextCard — surface-alt/card 배경이 E3EDF3/white 계열, 텍스트가 dark900/5C6B75.
- **상태 표시**: QnA 상태 뱃지(OPEN/SOLVED), 업로드 실패 UI, 좋아요/에러 아이콘 — semantic-success/error/warning이 라이트 배경 위에서 대비 확인.
- **글로벌**: globals.css의 body 배경/텍스트가 rootVars → primitives/semantic 기반이므로, injectRootVars만 쓰면 라이트로 전환됨.

### 5-2. QA 체크 시나리오

1. **본문/헤더 대비**  
   - 화면: 홈 피드, 글 상세, 설정.  
   - 확인: bgPrimary(#F3F7F9) 위에서 제목·본문(textPrimary #18242D), 보조 문구(textMid #5C6B75)가 AA(이상적으로 AAA) 만족하는지.

2. **primary/secondary 버튼**  
   - 화면: 로그인, 글쓰기, 모달 확인.  
   - 확인: primary(#4CAF50) 위 white 텍스트, secondary/outline 버튼이 라이트 배경과 구분되며 대비 충분한지.

3. **상태색 vs primary**  
   - 화면: QnA 상세(OPEN/SOLVED 뱃지), 결과 상세(fixScope), Toast success/error.  
   - 확인: success(#43A047)와 primary(#4CAF50) 시각적 구분, error/warning이 라이트 배경 위에서 읽기 쉬운지.

4. **Input/Select 에러**  
   - 화면: 로그인/회원가입 폼에서 의도적 에러 유도.  
   - 확인: border-semantic-error, focus ring semantic-error가 라이트 배경·placeholder와 충분한 대비인지.

5. **QnA 상태 뱃지**  
   - 화면: QnA 목록/상세.  
   - 확인: 미해결(OPEN, semantic-error 계열), 해결됨(SOLVED, primary-lime 계열), 마감(EXPIRED/CLOSED)이 라이트 배경 위에서 구분·가독성 양호한지.

---

## 요약

- **1)** 현재는 새 팔레트 hex가 primitives에 들어가 있고, semantic은 다크 스킴(배경=dark*, 본문=white)으로 연결됨. design/tokens는 이미 shared 기반.
- **2)** 라이트 스킴은 배경=F3F7F9/E3EDF3/white, 본문=18242D/5C6B75/8B9CA8 로 재해석하고, primitives 키는 유지한 채 값만 라이트 역할에 맞게 배치. WCAG AA/AAA는 제안 조합 기준으로 안전.
- **3)** semantic.color는 primitives만 참조하도록 3-3 스니펫으로 전환하고, 라이트용 border 2종을 primitives에 추가. 상태색은 기존 base+muted 유지하거나 라이트용 muted만 약간 연하게 조정 가능.
- **4)** design/tokens는 수정 없이 shared 라이트 semantic만 반영. tailwind.config는 text-* / surface* 를 semantic 참조로 통일하면 한 곳만 바꿔도 라이트 전환 가능.
- **5)** PageContainer, Button, TextInput/Select, Toast, ConfirmDialog, PostCard, QnA/업로드 상태 UI 등에서 배경·텍스트·상태색 대비와 구분을 위 5가지 시나리오로 점검하면 됨.
