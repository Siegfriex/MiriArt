# 홈 탭 기능 명세 (FSD_TAB)

## 현재 구현 (As-Is)

| # | 기능 | Input | Process | Output | 상태 |
|---|------|-------|---------|--------|------|
| 1 | Hero CTA 클릭 | 클릭 | openModal('UPLOAD_FLOW') | 업로드 모달 | ✅ |
| 2 | 최근 분석 카드 클릭 | art.id | navigate(ROUTES.RESULT(id)) | 결과 상세 페이지 | ✅ |
| 3 | 전체 보기 클릭 | - | navigate(ROUTES.APP.ARCHIVE) | 아카이브 탭 | ✅ |
| 4 | 크레딧 충전 | 클릭 | openModal('SUBSCRIPTION') | 구독 모달 | ✅ |
| 5 | FAB 클릭 | 클릭 | openModal('UPLOAD_FLOW') | 업로드 모달 | ✅ |
| 6 | 첫 로그인 툴팁 | isFirstLogin | showToast(메시지, 6초) | 토스트 표시 | ✅ |

## 목표 기능 (To-Be, MIRIART_HOME_COMMUNITY_DESIGN_v1)

| # | 기능 | Input | Process | Output | 상태 |
|---|------|-------|---------|--------|------|
| 1 | Context Bar 학년/도메인 변경 | 선택값 | useUserStore 반영, 피드 refetch | 필터된 피드 | 🔲 |
| 2 | Sub-Tab 전환 | 타임라인/Q&A/인기 | type, sort 파라미터 변경 | 해당 탭 피드 | 🔲 |
| 3 | PostCard 클릭 | post.id, post.type | navigate(/posts/:id 또는 /qna/:id) | 글 상세 | 🔲 |
| 4 | FAB → Bottom Sheet | 클릭 | [자유글] [질문하기] 선택 | WritePost 페이지 | 🔲 |
| 5 | 피드 무한 스크롤 | 스크롤 끝 | cursor 기반 다음 페이지 로드 | 추가 카드 | 🔲 |
| 6 | AI에게 먼저 물어보기 | Write Flow 내 버튼 | AI Chat으로 이동 + context 전달 | 초안 생성 | 🔲 |

## API 의존 (목표)

- `GET /api/posts` — 피드 조회 (type, grade, domain, sort, cursor)
- `GET /api/posts/:id` — 글 상세
- `POST /api/posts` — 글 작성
- (기존) UPLOAD_FLOW → Result Detail
