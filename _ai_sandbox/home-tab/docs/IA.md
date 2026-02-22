# 홈 탭 IA (Information Architecture)

## 현재 구조 (As-Is)

```
Home (Page.tsx)
├── Header (앱명 + 플랜 뱃지)
├── LiveTicker (무한 스크롤 티커)
├── Hero CTA Card (업로드 유도)
│   └── [작품 업로드] → UPLOAD_FLOW 모달
├── Section: 최근 분석
│   └── 캐러셀 (MOCK_ARTWORKS 3개)
│       └── 카드 클릭 → /result/:id
├── CreditStatusWidget (크레딧 / 충전하기)
└── FAB (업로드) → UPLOAD_FLOW 모달
```

## 목표 구조 (To-Be, MIRIART_HOME_COMMUNITY_DESIGN_v1)

```
Home (확장)
├── Context Bar (학년▾ 도메인▾ 🔔 🔍)
├── Hero CTA Card (기존 유지)
├── Sub-Tab (Sticky): [타임라인] [질문 Q&A] [인기]
├── Feed (Infinite Scroll)
│   ├── PostCard (자유글)
│   └── PostCard (Q&A, 채택 뱃지)
├── CreditStatusWidget (기존)
├── FAB → Bottom Sheet: [✏️ 자유글] [❓ 질문하기]
└── (GNB: Home | Archive | AI Chat | Profile)
```

## Sub-Tab 정의

| Sub-Tab | 내용 | 정렬 |
|---------|------|------|
| 타임라인 | 자유글 + Q&A 혼합 | 최신순 |
| 질문 Q&A | type=qna 필터, 미해결 우선 | 미해결 → 최신순 |
| 인기 | 좋아요/답변수 기반 | 인기도 (24h) |

## 컴포넌트 계층 (목표)

```
HomePage
├── ContextBar (학년, 도메인, 알림, 검색)
├── HeroCtaCard (기존)
├── HomeFeed
│   ├── SubTabBar (타임라인 | Q&A | 인기)
│   └── PostCard[] (무한 스크롤)
├── CreditStatusWidget
└── FAB (글쓰기/질문하기 분기)
```
