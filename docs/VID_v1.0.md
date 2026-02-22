# MiriArt Visual Interface Design (VID) Ver 1.1

> AI 기반 미술/디자인 작품 평가 및 멘토링 모바일 앱 — 전역 디자인 시스템

---

## 문서 메타데이터

| 항목 | 값 |
|------|-----|
| 버전 | 1.1 |
| 최종 업데이트 | 2025-02-18 |
| 인코딩 | UTF-8 |
| 레퍼런스 | [Genie Chatbot - AI Assistant UX UI Design (Behance)](https://www.behance.net/gallery/217080729/Genie-Chatbot-AI-Assistant-UX-UI-Design/modules/1236442511) |

---

## 목차

0. [개요 및 레퍼런스](#0-개요-및-레퍼런스)
1. [00_Principle (디자인 원칙)](#1-00_principle-디자인-원칙)
2. [10_Foundation (기초 스타일)](#2-10_foundation-기초-스타일)
3. [20_Components (아토믹 컴포넌트)](#3-20_components-아토믹-컴포넌트)
4. [30_Patterns (복합 모듈, AI Chatbot Focus)](#4-30_patterns-복합-모듈-ai-chatbot-focus)
5. [40_Motion (인터랙션 가이드)](#5-40_motion-인터랙션-가이드)
6. [부록](#6-부록)

---

## 0. 개요 및 레퍼런스

### 0.1 Genie Chatbot 벤치마크 요약

MiriArt VID는 [Genie Chatbot - AI Assistant UX UI Design](https://www.behance.net/gallery/217080729/Genie-Chatbot-AI-Assistant-UX-UI-Design/modules/1236442511)을 웹 그라운딩 레퍼런스로 활용합니다.

| 분석 항목 | Genie App 특징 | MiriArt 적용 매핑 |
|----------|----------------|-------------------|
| **Glassmorphism** | 반투명 카드, backdrop-filter, 배경 흐림 | Sticky Context Card, Side GNB, Type B Action Card |
| **Card-Based Interface** | Image Generation, AI Search, Chat Files 카드 | Checklist, Image Gallery, Ref Link (Type B) |
| **Bottom-Heavy** | 입력창·퀵액션 하단 1/3, 한 손 조작 | Interaction Bar, Floating Toggle, FAB |
| **Color Palette** | Light, pleasant colors, 파스텔 그라디언트 | Lime #C2F970, Soft Gradient (Lime+Purple) |
| **Typing Indicator** | 시각적 풍부한 애니메이션 | 3-dot Wave / 오로라 모션 |

### 0.2 AI 챗봇 디자인 모범 사례

Carbon Design System, Horizon Design System, Chatbot Accessibility Playbook 기반:

| 원칙 | 설명 | MiriArt 적용 |
|------|------|---------------|
| **Turn-taking** | 사용자/AI 메시지 구분, Typing Indicator | Type A 좌/우 정렬, Typing Indicator |
| **Error Recovery** | AI Timeout, Retry, Empty State | 30초 Timeout + Retry, Empty State 가이드 |
| **Contextual Awareness** | 맥락 유지 | Sticky Context Card (등급, fixScope, Radar) |
| **Progressive Disclosure** | 점진적 정보 노출 | Type B 확장 (Checklist 체크, Gallery 스와이프) |
| **Accessibility** | 터치 영역, 다크 모드 | 44px+ 터치 영역, Anti-aliasing |

### 0.3 문서-앱 스펙 매핑

| 입력 문서 | 용도 |
|----------|------|
| [.md](../../.md) | 앱 구조 명세, Typography, Chat Room, Side GNB, §0.4 AI 화면 플로우, §5.4 Artifact View |
| [Agent_DEV.md](../../Agent_DEV.md) | Block 타입(Type A/B/C), Sticky Context 스키마, Agent→Block 매핑, §21 Artifact View |

---

## 1. 00_Principle (디자인 원칙)

> "개발자가 구현할 때 흔들리지 않게 잡아주는 철학"

### 1.1 Ethereal Utility (공기 같은 유용성)

**정의**: 배경은 흐릿하게(Blur), 정보는 선명하게.

- 복잡한 로직(5-Line Analysis, FSD 구조)은 백엔드에 숨김
- 프론트엔드에는 "마치 공기처럼 가벼운 인터페이스"만 노출
- **적용**: Glassmorphism (`backdrop-filter: blur(20px)`)으로 Sticky Context Card, Side GNB, Action Card에 적용

**Reference**: Genie App — "Pocket-sized Power Move", 유리 질감 카드

### 1.2 Bottom-Heavy (하단 중심)

**정의**: 조작부는 엄지 영역(Thumb Zone)에 배치.

- 주요 조작 요소(입력창, FAB, 모델 스위처)를 화면 하단 1/3에 집중
- 상단은 Viewer(정보 조회) 영역으로 활용
- **적용**: Interaction Bar, Floating Toggle, New Chat FAB — [.md §5.3](../../.md)

**Reference**: Genie App — Bottom-Heavy Design, 한 손 조작

### 1.3 Tactile Feedback (촉각적 반응)

**정의**: 시각적 깊이감(Depth)과 햅틱의 조화.

- **Depth**: Soft Shadow, Layering, Glassmorphism으로 카드가 떠 있는 느낌
- **Haptic**: 터치 시 Vibration API (선택) — 버튼 탭, Chip 선택, 체크리스트 완료
- **적용**: 모든 인터랙티브 요소에 시각적 피드백 + 햅틱 가이드

---

## 2. 10_Foundation (기초 스타일)

> `shared/ui/tokens`에 상수(Constant)로 정의될 값들

### 2.1 Typography (서체 시스템)

| Token Name | Usage | Font Family | Weight | Size | Line Height | Letter Spacing |
|------------|-------|-------------|--------|------|-------------|----------------|
| **Display / H1** | 온보딩, 메인 타이틀 | KR: SUITE / EN: Rubik | Extrabold / Semibold | 32px | 42 (130%) | -0.5 |
| **Heading / H2** | 섹션 헤더, 카드 타이틀 | KR: SUITE / EN: Rubik | Bold / Medium | 22px | 30 (136%) | -0.2 |
| **Subhead / H3** | 서브 타이틀, 강조 텍스트 | KR: SUITE / EN: Rubik | Medium / Regular | 18px | 24 (133%) | 0 |
| **Body / P1** | 채팅 메시지, 본문 | KR: SUITE / EN: Rubik | Medium / Light | 14px | 22 (157%) | 0 |

**소스**: [.md §7](../../.md)

### 2.2 Color Palette (색상 시스템)

| 역할 | 값 | 용도 |
|------|-----|------|
| **Primary (Brand)** | `#C2F970` (Lime) | Action, Active State, FAB, 전송 버튼 |
| **Secondary (Bg)** | Off-White / Soft Gradient (Lime + Purple) | 배경, Chat Room Ambient |
| **Semantic Critical** | Red | fixScope "구조 재설계 필요" |
| **Semantic Safe** | Blue | 합격권 표시 |
| **Surface (Glass)** | `rgba(255, 255, 255, 0.7)` + `backdrop-filter: blur(20px)` | Sticky Card, Side GNB, Action Card |
| **Text Primary** | Dark Grey / Black | 본문, 가독성 |

**CSS 변수 예시**:
```css
--color-primary-lime: #C2F970;
--color-fixscope-critical: #E53935;
--color-pass-safe: #1E88E5;
--surface-glass: rgba(255, 255, 255, 0.7);
--blur-glass: 20px;
```

### 2.3 Layout & Grid

| 토큰 | 값 | 용도 |
|------|-----|------|
| **Grid** | 4-Column (Default) / 5-Column (Archive Grid View) | 레이아웃 |
| **Radius Large** | 24px | Cards, Modals |
| **Radius Medium** | 12px | Buttons, Inputs |
| **Shadow Soft** | Y: 4px, Blur: 12px, Opacity: 10% | 카드, FAB |

---

## 3. 20_Components (아토믹 컴포넌트)

> `shared/ui` 폴더에 들어갈 재사용 가능한 부품

### 3.1 Buttons

| 컴포넌트 | 스펙 | 앱 스펙 매핑 |
|----------|------|-------------|
| **FAB (Floating Action Button)** | Lime 컬러, 우측 하단 고정, Icon only / Text+Icon | [.md §2.4](../../.md) New Chat FAB, §2.2 Quick Upload FAB |
| **Ghost Button** | 배경 없음, 텍스트만 | 더보기, 퀵 액션 |

**FAB 상세**:
- Position: `position: fixed`, `right: 16px`, `bottom: env(safe-area-inset-bottom) + GNB 높이`
- Size: 56px × 56px (Icon only), 가변 (Text+Icon)
- Radius: 28px (원형) 또는 24px (Large Radius)

### 3.2 Cards

| 컴포넌트 | 스펙 | 앱 스펙 매핑 |
|----------|------|-------------|
| **Session Card** | 썸네일 + 텍스트 + 태그 조합, Grade Badge Overlay | §2.4 Session Card |
| **Analysis Card** | 아카이브용 썸네일 카드, AI 한줄 코멘트 | §2.3 Archive |

**공통 스펙** (Genie Reference):
- `border-radius: 24px` (Large)
- Soft Shadow (Y:4, Blur:12, Opacity:10%)
- 터치 유도성(Affordance) — 터치 가능함을 시각적으로 전달

### 3.3 Inputs

| 컴포넌트 | 스펙 | 앱 스펙 매핑 |
|----------|------|-------------|
| **Chat Input** | 가변 높이(Auto-growing), Max 500자 | §5.3 Input Field |
| **Search Bar** | 아이콘 포함, 둥근 모서리 (Radius Medium) | §2.4, §6.2 |

### 3.4 Chips

| 컴포넌트 | 스펙 | 앱 스펙 매핑 |
|----------|------|-------------|
| **Filter Chip** | On/Off 상태 (학교/등급 필터) | §2.4 Filter Section |
| **Action Chip** | AI 모델 스위처 (Ask / Plan / Critic / Inference) | §5.3 Floating Toggle |

---

## 4. 30_Patterns (복합 모듈, AI Chatbot Focus)

> `widgets` 또는 `features` 레이어에서 조립될 덩어리들

### 4.1 Sticky Context Card

| State | 높이 | 구성 | Agent_DEV 연계 |
|-------|------|------|----------------|
| **Max** | 120px | 등급 배지, 점수, fixScope 태그, Radar Chart | [Agent_DEV §5.1](../../Agent_DEV.md) 스키마 |
| **Min (Sticky)** | 44px | 헤더 하단 흡착, 1줄 요약 (등급\|타이틀\|점수) | |

**Glassmorphism**: Max→Min 전환 시 배경 Blur 유지, 정보 단절 없음

### 4.2 Chat Bubbles

| Type | 설명 | 데이터 스키마 | Agent 연동 |
|------|------|---------------|------------|
| **Type A** | 일반 텍스트 (User: 우측 / AI: 좌측) | `{ type: "text", content: string }` | direct_execute |
| **Type B (Widget)** | Checklist, Image Gallery, Ref Link | `{ type: "action_card", subtype, items }` | generate_checklist, search_similar_pass_works, get_ref_link |
| **Type C** | Quick Reply Chips | `{ type: "chips", options }` | suggest_next_action |

**Agent→Block 매핑**: [Agent_DEV §6.3](../../Agent_DEV.md)

**Type B Artifact 확장** (Agent_DEV §16.3 Block vs Artifact, §21.1):
- Checklist/Gallery가 Artifact일 때: 채팅 내 인라인 → **별도 뷰 전환** (§4.5 Artifact View 패턴)

### 4.3 Side GNB Drawer

| State | 너비 | 용도 | GNB |
|-------|------|------|-----|
| **State 1 (Partial)** | 80% | Session Quick Switcher | 숨김 유지 |
| **State 2 (Full)** | 100% | AI Chat Tab Root (D1) | 노출 |

**구성**: [+ New Chat], Recent History, 등급별/도메인별 퀵 필터 — [.md §6](../../.md)

### 4.4 Typing Indicator

- **스펙**: 3-dot Wave Animation 또는 라임 오로라 모션
- **의미**: "AI가 지금 당신을 위해 생각하고 있다"
- **적용**: Chat Room §5.2

### 4.5 Artifact View 패턴

| 패턴 | 스펙 | Agent_DEV |
|------|------|-----------|
| **Checklist Artifact View** | 체크리스트 전용 화면, 진행률 바, Glassmorphism 카드 | §21.1, §19.1 |
| **Gallery Artifact View** | 5컬럼 그리드, 확대 뷰, 선택/비교 모드 | §21.1, §19.2 |
| **Placeholder + 로딩** | Artifact 생성 요청 시 로딩바, 폴링 완료 시 전환 | §18 |

**앱 스펙 매핑**: [.md §5.4](../../.md)

---

## 5. 40_Motion (인터랙션 가이드)

> Framer Motion 등 프론트엔드 애니메이션 라이브러리 설정값

### 5.1 Page Transition

| 전환 | 스펙 | 적용 |
|------|------|------|
| **Chat Room Enter** | GNB Slide Down, Duration: 300ms, Ease-out | Depth 1 → Depth 2 |
| **Chat Room Exit** | GNB Slide Up, 복구 | Depth 2 → Depth 1 |

### 5.2 Micro-interaction

| 모션 | 스펙 | 적용 |
|------|------|------|
| **Side GNB Snap** | 드래그 놓을 시 자석 효과, Spring mass: 1, stiffness: 100 | State 1 ↔ State 2 |
| **Typing Indicator** | 3-dot Wave Animation | AI 응답 대기 |
| **Sticky Card Morph** | Max→Min 전환, Glassmorphism 유지 | 스크롤 시 |

**검증**: Manifesto "Fluid Structure", 끊김 없는 전환

---

## 6. 부록

### 6.1 토큰 상수표 (TypeScript 예시)

```typescript
// shared/ui/tokens/colors.ts
export const colors = {
  primary: { lime: '#C2F970' },
  semantic: { critical: '#E53935', safe: '#1E88E5' },
  surface: { glass: 'rgba(255, 255, 255, 0.7)', blur: 20 },
};

// shared/ui/tokens/typography.ts
export const typography = {
  display: { size: 32, lineHeight: 42, weight: { kr: '800', en: '600' } },
  heading: { size: 22, lineHeight: 30, weight: { kr: '700', en: '500' } },
  subhead: { size: 18, lineHeight: 24, weight: { kr: '500', en: '400' } },
  body: { size: 14, lineHeight: 22, weight: { kr: '500', en: '300' } },
};

// shared/ui/tokens/layout.ts
export const layout = {
  radius: { large: 24, medium: 12 },
  shadow: { y: 4, blur: 12, opacity: 0.1 },
  grid: { default: 4, archive: 5 },
};
```

### 6.2 검증 체크리스트

| 검증 항목 | 기준 | 상태 |
|----------|------|------|
| 문서-앱 스펙 일치 | .md, Agent_DEV.md 모든 UI 요소 커버 | 완료 (§6.3 교차 참조) |
| Genie 레퍼런스 반영 | Glassmorphism, Card-Based, Bottom-Heavy 명시 | 완료 |
| AI 챗봇 포커스 | Type A/B/C, Sticky Context, 4-Mode Toggle 상세 | 완료 |
| 구현 가능성 | shared/ui/tokens, 컴포넌트 경로 명시 | 완료 |
| 접근성 | 터치 영역 44px+, 다크 모드 Anti-aliasing | §2, §3 주석 |

### 6.3 문서-앱 스펙 교차 참조

| 앱 스펙 (.md) | VID 섹션 |
|---------------|----------|
| §0 사이트맵 | §5.1 Page Transition |
| §2.2 Quick Upload FAB | §3.1 FAB |
| §2.3 Archive, Analysis Card | §3.2 Analysis Card |
| §2.4 AI Chat, Session Card, Filter, Search Bar | §3.2 Session Card, §3.4 Filter Chip, §3.3 Search Bar |
| §5 Chat Room, Sticky Context, Message Bubbles, Interaction Bar | §4.1, §4.2, §5 |
| §5.4 Artifact View | §4.5 |
| §6 Side GNB | §4.3 |
| §7 Typography | §2.1 |
| §7.4 VID 연계 | — (역참조) |
| §8 예외 플로우 | §0.2 Error Recovery |
| §0.4 AI 화면 플로우 | §0.3 문서-앱 스펙 매핑 |

| Agent_DEV | VID 섹션 |
|------------|----------|
| §5 Sticky Context 스키마 | §4.1 |
| §6.2 Block 타입 (Type A/B/C) | §4.2 |
| §6.3 Agent→Block 매핑 | §4.2 |
| §21 Artifact View | §4.5 |
