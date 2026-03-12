# 인프라 SSOT 변경 이력 (에이전트 반영)

> **목적**: 에이전트가 인프라·배포·설정 관련 수정 후 SSOT를 갱신할 때, **날짜·롤·구체적 수정 내역**을 기록한다.  
> **규칙**: 최신이 **위**에 오도록 추가. 시크릿 값은 기재하지 않음.  
> **지침**: `.cursor/INFRA_SSOT_GUIDE.md` §5.

---

## 이력

### 2026-03-11 | miriart-ai(FastAPI) ↔ 문서스위트 갭 분석
- **docs/AI_CODE_AUDIT_GAP_REPORT.md** 신규: miriart-ai 코드베이스(~/projects-wsl/miriart-ai) 기준 라우트·설정·cloudbuild 스냅샷 및 문서 대조 갭 목록·권장 조치 정리. 갭: §5.2 동시성/min·max·GEMINI_LOCATION, §3.2 GEMINI_LOCATION, §1.2 Internal API 5개 목록, prod-operations-guide 포트(8080), FSD C4 구현 상태(스텁→구현됨).

### 2026-03-10 | 문서스위트 정합성 확보 (T-DOC-1·T-DOC-2·T-QA-2)
- **MiriArt_API_CONTRACT.md**: "엔드포인트·Request/Response·에러 참조 (코드 기준 SSOT)" 절 추가. 전체 엔드포인트 요약 표 및 BE_CODE_AUDIT_GAP_REPORT_FINAL §2.4.1·§2.4.2 참조 명시. (코드 변경 없음.)
- **miriarts_infra.md**: §1.1 서비스 목록 miriart-ai 행에 실제 경로 명시 — WSL `~/projects-wsl/miriart-ai`, Windows UNC `\\wsl.localhost\Ubuntu-24.04\home\sieg\projects-wsl\miriart-ai`. §4.2 "인증 필터·BE→AI 내부 호출" 절 추가 — JwtAuthenticationFilter, WebClientConfig·IAM 호출, 갭 리포트 §6 참조.

### 2026-03-10 | PRD·FSD 코드 기준 동기화
- **MiriArt_PRD_v2.md**: §0.2 Chat 저장(현재 Redis+MySQL chat_sessions 반영), §4.1 커뮤니티 C1 구현됨, §4.2 ChatSession/ChatMessage(구현됨·Redis만) 반영. 검증 기준선 2026-03-10.
- **MiriArt_FSD_v2.md**: §1 표 F8·C1·C2·C3 구현 상태·연결 API 수정. §1.1 C1 인프라, §1.2 F4·C1 엔티티. §3 F8 일부 구현됨(세션 목록 MySQL). §4 C1 구현됨, C2 채택 구현됨, C3 채택 시 평판 지급 구현됨. 최종 수정 2026-03-10.

### 2026-03-10 | 문서스위트 최신화 (갭 리포트 기준)
- **miriarts_infra.md**: §4.4 chat_sessions 존재 반영(MySQL+V5+GET /api/chat/sessions), 구현된 엔드포인트 표 보강(이미지·채팅 세션·게시글·답변·댓글·좋아요·신고). §3.2·§2 Secret/환경변수 SPRING_DATASOURCE_*, SPRING_DATA_REDIS_HOST. §4.2 CORS localhost:3000 추가, GET /api/answers/** 비고, 인증 실패 401 응답 절. §6.2 logback-spring.xml 경로·프로파일. §5.2 --set-secrets SPRING_*·cloudrun-redeploy.sh 명시. §1.1 miriart-ai 본 레포 없음 명시. 스키마 SSOT를 엔티티·Flyway·ERD_v2 기준으로 정리(mysql_erd_v1 미생성).
- **MiriArt_API_CONTRACT.md**: 인증 실패 401 절, 목록 API 페이징·정렬 표 추가.
- **MiriArt_BE_Current_State_Report.md**: docker-compose.yml 존재 반영, 런타임 env명 SPRING_*, §6 불일치 문구 수정.
- **miriarts_central.md**: §1-4 React Query 도입 반영(코드 기준 정정).
- **prod-operations-guide.md**: BE 로그 설정 SSOT(logback-spring.xml)·miriarts_infra §6.2 링크.
- **Phase 5**: FE_BE_ANALYSIS_CHECKLIST, MiriArt_ERD_v2, MiriArt_FSD_v2, CURSOR_RULES_DOCS_SSOT_산출서에서 mysql_erd_v1 참조를 엔티티·Flyway·ERD_v2 기준으로 통일.

### 2026-03-02 | 백엔드/P1 정책 반영
- P1 구현 갭 수정 반영: PlanType FREE 2→5회/월, needsProfile=false 시 분석 한도 스킵. POST /api/auth/token 응답에 role·planType, GET /api/users/me에 planType 추가.
- miriarts_infra.md §4.4: PlanType FREE(5), 한도 체크 조건·GET /api/users/me(planType)·POST /api/analyses(한도 정책) 문구 갱신.
- FSD_v2, PRD_v2, API_CONTRACT: Free 5회/월, 토큰·me 응답 필드(role, planType), plan 응답 monthlyLimit 예시 5 반영. 레포 전제 문서에 P1 크레딧·응답 필드 요약 추가.

### 2026-03-02 | 인프라 에이전트
- miriarts_infra.md §2 Cloud SQL: Cloud Shell 접속용 공개 IP·승인된 네트워크 안내 추가. Cloud Shell egress IP는 환경변수로 두지 않고 세션별 확인 후 승인된 네트워크에 `x.x.x.x/32` 추가하도록 명시. §2 내 "Cloud Shell에서 MySQL 접속 절차" 절차 4단계(변수 설정 → Proxy → Secret 비밀번호 → mysql 접속) 문서화.

### 2026-03-02 | 인프라 에이전트
- miriarts_infra.md §4.4 추가: API 구현 현황(검증됨). 유저/온보딩·AI 분석·AI Chat·성적 입시·전역 에러 정책을 코드 기준으로 정리 후 단일 진실만 반영. 구현 엔드포인트·PlanType·analysis_usage_logs·Redis 채팅 키 패턴·미구현(/api/theory 등)·GlobalExceptionHandler/ErrorCode 참조 명시.
- miriarts_infra.md §7: TODO-008 성적/입시 전용 API 미구현 추가.

### 2026-03-02 | 인프라 에이전트
- CHANGELOG_infra.md 생성. 에이전트 변경 시 SSOT 자동 업데이트 규칙·가이드(infra-ssot.mdc, INFRA_SSOT_GUIDE.md §5) 추가.

### 2026-03-02 | 백엔드 에이전트
- **스키마 SSOT** 명시: 실제 DB(MySQL) 테이블·컬럼·인덱스의 단일 참조를 `docs/mysql_erd_v1.md`(역추출·§4 정합성 점검)로 지정.
- `.cursor/rules/infra-ssot.mdc`: 스키마 SSOT 조항 추가. glob에 `docs/mysql_erd_v1.md`, `docs/MiriArt_ERD_v2.md` 추가.
- `.cursor/INFRA_SSOT_GUIDE.md`: 참조 문서 표에 스키마 SSOT 행 추가. §3 변경 시 동기화에 "DB 스키마/엔티티 → mysql_erd_v1.md §1·§2·§4 갱신, ERD_v2와 조율" 추가.
- miriarts_infra.md §2 Cloud SQL: "실제 스키마 SSOT" 행 추가(mysql_erd_v1.md, Cursor 규칙 참조).
