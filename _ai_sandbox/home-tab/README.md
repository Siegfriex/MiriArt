# MiriArt 홈 탭 샌드박스

> Google AI Studio(Gemini)가 이 폴더만 읽고도 홈 탭을 이해하고 리뉴얼 설계를 수행할 수 있도록 추출한 샌드박스입니다.

## 탭 개요

- **탭 이름**: Home (홈)
- **목적**: AI 작품 분석 CTA(Hero), 최근 분석 캐러셀, 크레딧 위젯, LiveTicker를 제공하는 메인 진입점.  
  → **리뉴얼 설계**: `docs/MIRIART_HOME_COMMUNITY_DESIGN_v1.md`에 따라 커뮤니티 피드(타임라인/Q&A/인기)를 추가하는 것이 목표.

## 주요 라우트

| 라우트 | 설명 |
|--------|------|
| `/app/home` | 홈 탭 엔트리 (MainLayout 내부) |
| `/app/archive` | 아카이브 (최근 분석 전체 보기) |
| `/result/:artworkId` | 결과 상세 (작품 카드 클릭 시) |

## 엔트리 컴포넌트

```
src/pages/home/ui/Page.tsx  →  Home
```

## 상태 관리

- **Zustand** (persist): `useUserStore` (프로필, 크레딧, 첫 로그인)
- **Zustand**: `useModalStore` (UPLOAD_FLOW, SUBSCRIPTION 등), `useToastStore` (토스트 알림)
- **React Router**: `useNavigate` (Archive, Result 상세 이동)

## 포함 파일 구조

```
src/
├── pages/home/ui/Page.tsx          # 홈 페이지 (엔트리)
├── widgets/home/
│   ├── LiveTicker.tsx             # 라이브 티커
│   ├── CreditStatusWidget.tsx     # 크레딧 위젯
│   └── index.ts
├── shared/
│   ├── ui/                        # Typography, Button, FAB, PageContainer, Section
│   ├── config/                    # strings, routes
│   └── model/                     # modalStore, userStore, toastStore, types
└── entities/artwork/model.ts      # Artwork 타입 + MOCK_ARTWORKS
```

## 의도적으로 제외한 것

- **전역 레이아웃**: BottomNav, SideGNB, ModalProvider (앱 셸)
- **다른 탭**: Archive, AI Chat, Profile 페이지
- **UploadFlow, Subscription, GradeInput**: 모달로 열리지만 홈 탭 전용 아님
- **ToastContainer**: 전역 UI
- **전역 스타일**: `globals.css`, `tailwind.config` (설계 이해용으로 `docs/`에 요약)

## 리뉴얼 설계 문서

- `docs/MIRIART_HOME_COMMUNITY_DESIGN_v1.md` — 홈 탭 커뮤니티 기능 설계서 (전체)
- `docs/IA.md` — 홈 탭 IA 구조 (현재 vs 목표)
- `docs/WIREFRAME.md` — 텍스트/ASCII 와이어프레임
- `docs/FSD_TAB.md` — 홈 탭 기능 목록 (I-P-O)

## 스택

- React 19 + TypeScript + Vite
- TailwindCSS v4 (primary-lime, dark-800 등 시맨틱 색상)
- Zustand (상태), Framer Motion (LiveTicker 애니메이션), Lucide React (아이콘)
