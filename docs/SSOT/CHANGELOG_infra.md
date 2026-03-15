# 인프라 SSOT 변경 이력 (에이전트 반영)

> **목적**: 에이전트가 인프라·배포·설정 관련 수정 후 SSOT를 갱신할 때, **날짜·롤·구체적 수정 내역**을 기록한다.  
> **규칙**: 최신이 **위**에 오도록 추가. 시크릿 값은 기재하지 않음.  
> **지침**: `.cursor/INFRA_SSOT_GUIDE.md` §5.

---

## 이력

### 2026-03-15 | ERD v2.1 실 DB 역추출 검증·수정
- **검증 소스**: GCP Cloud SQL(miriart_prod) INFORMATION_SCHEMA 역추출 — 테이블 12개, 컬럼 전수, 인덱스 전수, FK 전수.
- **MiriArt_ERD_v2.md v2.0→v2.1**: (1) `plans` 테이블 — DDL 제거, "DB에 존재하지 않음" 명시. (2) `reports` — reporter_id→user_id, target_type ENUM('POST','ANSWER') (comment 제거), reason varchar(500), updated_at 추가. (3) `analyses.analysis_type` — ENUM→varchar(50). (4) `analyses.embedding` — 컬럼 제거(DB에 없음). (5) ENUM 케이싱 전체 uppercase 통일(FREE/QNA/POST/ANSWER 등). (6) TIMESTAMP→datetime(6) 전체 통일. (7) users.idx_email 제거(DB에 없음). (8) §6 인덱스 전략에 chat_sessions·reports 인덱스 추가.
- **miriarts_infra.md §2 Cloud SQL**: 스키마 SSOT 참조에 "ERD v2.1 실 DB 역추출 검증 완료" 반영.

### 2026-03-15 | 7개 문서 정리 완료 — 참조 정합·삭제 실행
- **목표**: 7개 문서만 남기고 나머지 docs/ 하위 .md 삭제. 코드 기준 1:1 대조 후 참조 무결성 확보.
- **.claude/INFRA_SSOT_GUIDE.md**: .cursor 버전과 동기화. §1 참조 문서 표에서 GCP_INFRA·BE_CloudRun_CloudSQL_FIX 제거, SSOT 통합 문구로 수정. §3.1 문서 갱신 순서에서 _code_snapshot_*·Community_Transaction·BE_Current_State·docs_코드베이스_문서_일치_진단 참조 제거, "코드 → miriarts_infra §4.4 → API_CONTRACT" 순서로 통일. §4 배포 상태에서 AI 항목을 "별도 레포" 문구로 교체. §5-3 트리거에서 miriart-ai·MiriArt_GCP_INFRA 경로 제거.
- **삭제 실행**: docs/ 하위 7개 문서 + docs/SSOT/ 3개 외 모든 .md 삭제(약 70개). miriart-be/docs/는 유지.
- **검증**: Phase 4(R1-R4, C1-C4) 전수 통과. 7개 문서 내 비-7개 docs/ 참조 없음(이력 제외). README·INFRA_SSOT_GUIDE에 삭제 대상 경로 없음.

### 2026-03-15 | 7개 문서 정합 및 삭제 준비 실행 플랜 적용
- **목표**: 7개 문서만 남기고 나머지 docs 삭제가 가능하도록 참조 무결성 확보.
- **miriarts_infra.md**: 운영 요약 하단에 "참조 금지: 본 레포 내 miriart-ai, miriart-ai-legacy 폴더는 문서·에이전트가 참조하지 않는다" 문구 추가. §4.4에 "BE→외부 AI API 계약 요약" 절 추가(경로·DTO·에러 매핑·타임아웃, 코드 라인 인용).
- **README.md**: 인프라 명세 링크를 docs/MiriArt_GCP_INFRA.md → docs/SSOT/miriarts_infra.md로 변경. BE 로컬 실행 상세를 docs/MiriArt_BE_SETUP_GUIDE.md → miriart-be/.env.example 및 miriarts_infra §5 참고로 변경.
- **.cursor/INFRA_SSOT_GUIDE.md**: 참조 문서 표에서 GCP_INFRA·BE_CloudRun_CloudSQL_FIX 제거/통합 문구로 수정. §3.1 문서 갱신 순서를 스냅샷·비-7개 문서 없이 "코드 → miriarts_infra §4.4 → API_CONTRACT" 등으로 수정.

### 2026-03-15 | 코드 SSOT 원칙 적용·7개 문서 동기화
- **원칙**: 문서는 코드를 따른다. 코드가 SSOT. 유일 참조는 코드(miriart-be, FE src, BE 인프라 설정). 범위: Java BE·BE 인프라·FE만. FastAPI/AI 상세·miriart-ai 경로·miriart-ai-legacy 폴더 참조 제거. AI는 "외부 서비스(별도 에이전트 관리)"로만 기술.
- **_code_snapshot_endpoints.md**, **_code_snapshot_transaction_error.md**: 상단에 "유일 참조: miriart-be 코드. AI 서비스 내부 미포함"·"범위: miriart-be만" 명시.
- **miriarts_infra.md**: 운영 요약·§1 서비스 목록·요청 플로우·§2 Cloud Run·§3 환경변수·§4 네트워크·§5 배포·§6 헬스·§7 TODO에서 miriart-ai 상세 제거. BE·FE만 상세 유지. 외부 AI 서비스 한 줄 표기.
- **miriarts_central.md**: §3 AI 서비스(miriart-ai) Python 의존성 절 전체 삭제, "외부 AI 서비스 의존성은 별도 레포에서 관리" 한 문단으로 대체. §4 Dockerfile·Cloud Build·배포 구조에서 miriart-ai 행 삭제.
- **MiriArt_FSD_v2.md**: 검증 기준에 "소스는 miriart-be·FE 코드만. AI 서비스 내부는 별도 관리." F3/F4/C4 인프라·Process 문구를 "외부 AI 서비스" 호출로 통일. C4 miriart-ai 경로·스텁 설명 제거.
- **MiriArt_PRD_v2.md**: §3.1 기술 스택 AI Service → "외부 AI 서비스(별도 레포·별도 에이전트 관리)". §4.1 F3/F4 "BE가 외부 AI 서비스 호출". §5.1 C4·§6 리스크 "외부 AI 서비스" 표현으로 변경. §0.2 Legacy 대비 표 동일 정리.
- **MiriArt_ERD_v2.md**: 상단 "실제 스키마 SSOT" 문구에 "코드(miriart-be 엔티티·Flyway V5/V6)" 명시.
- **MiriArt_API_CONTRACT.md**: (스냅샷·infra §4.4와 이미 일치하여 본 수정 없음. AI 내부 경로 없음.)

### 2026-03-12 | 코드·문서 동기화 디벨롭
- **AUTH001 이중 사용 해소**: ErrorCode에 AUTH_REQUIRED(AUTH009, 401, "인증이 필요합니다.") 추가. SecurityConfig authenticationEntryPoint에서 ErrorCode.AUTH_REQUIRED 사용. 문서: MiriArt_API_CONTRACT, _code_snapshot_endpoints, miriarts_infra §4.4, API_CONTRACT 401 설명 → AUTH009 반영. FE miriartApi.ts handleApiError AUTH009 메시지 "인증이 필요합니다. 로그인해 주세요."로 통일.
- **갭 리포트 참조 → SSOT**: MiriArt_FSD_v2.md C1 구현 상태 소스를 BE_CODE_AUDIT_GAP_REPORT_FINAL §2.1 대신 miriarts_infra §4.4, _code_snapshot_endpoints §1로 변경. miriarts_infra §4.2 인증 필터 문구에서 BE_CODE_AUDIT_GAP_REPORT_FINAL §6 대신 SecurityConfig, JwtAuthenticationFilter 소스로 정리.
- **PRD §8 검증**: MiriArt BE Setup Guide 미존재 → §8 표에 "(미생성)" 표기. §7 문서 이력에 2.4 "§8 참조 문서 목록 검증·미존재 항목 정리" 추가.
- **갱신 순서 문서화**: .cursor/INFRA_SSOT_GUIDE.md에 §3.1 "문서 갱신 순서" 절 추가(엔드포인트·ErrorCode, TX·락·예외, 스키마, 구현 상태별 갱신 순서).

### 2026-03-10 | TX·에러·로직 문서 코드 1:1 매핑
- **docs/_code_snapshot_transaction_error.md** 신규: 트랜잭션 경계(@Transactional 서비스·메서드·파일:라인), 락(PostRepository.findByIdForUpdate, AnswerCommandService.acceptAnswer), 예외 경로(BusinessException throw 위치·ErrorCode), 크리티컬 플로우(acceptAnswer, toggleLike, reportTarget, deleteComment, startAnalysis 3단계 TX) 스냅샷.
- **docs/SSOT/miriarts_infra.md**: §4.4 전역 에러 정책에 GlobalExceptionHandler:36-38 참조 및 트랜잭션·락·예외 상세 문서 참조( _code_snapshot_transaction_error, BE_Current_State_Report, Transaction_Lock_Exception_Report) 추가.
- **docs/_code_snapshot_endpoints.md**: §7 트랜잭션·락·예외 별도 스냅샷 참조 추가.
- **docs/MiriArt_API_CONTRACT.md**: "엔드포인트별 발생 가능 에러(ErrorCode)" 절 추가. throw 위치·401/402/404/409 설명, GlobalExceptionHandler 처리 명시.
- **docs/MiriArt_ERD_v2.md**: §4.2 posts 테이블 하단에 TX·락 비고(accepted_answer_id·answer_count 갱신: AnswerCommandService, PostRepository.findByIdForUpdate) 추가.
- **docs/MiriArt_BE_Current_State_Report.md**: §1-2 트랜잭션 사용 패턴 표를 실제 코드 기준으로 전면 갱신. startAnalysis TX 없음, AnalysisFailHandler savePending/complete/markFailed, ChatSessionService·PostCommandService·CommentCommandService·PostQueryService·ReportService·PersonaService·LikeCommandService·AnswerCommandService·ReputationService·UserService 등 파일:라인 기재.
- **docs/MiriArt_Community_Transaction_Lock_Exception_Report.md**: 전면 수정. "커뮤니티 쓰기 서비스 없음·락 미사용" 등 구식 문구 삭제. 서비스 계층·@Transactional·락(PostRepository:39-41, AnswerCommandService:82)·카운터·UNIQUE·예외·분석 3단계 TX 코드 기준으로 재작성.
- **docs/guides/prod-operations-guide.md**: §C 채택 락에 PostRepository.java:39-41, AnswerCommandService.java:82 파일:라인 명시.
- **docs/MiriArt_FSD_v2.md**: TX·에러 상세 참조(Transaction_Lock_Report, _code_snapshot_transaction_error, API_CONTRACT) 추가. C2 채택 구현에 findByIdForUpdate(PostRepository:39-41, AnswerCommandService:82) 명시.
- **docs/MiriArt_PRD_v2.md**: 에러·TX 정책 참조(API_CONTRACT, MiriArt_Community_Transaction_Lock_Exception_Report) 추가.

### 2026-03-12 | 문서 계층 코드 SSOT 동기화 (Phase 0–7)
- **docs/_code_snapshot_endpoints.md** 신규: BE 엔드포인트 전수·ErrorCode·페이징·CORS·엔티티·FE API↔스키마 스냅샷 (문서 갱신용 기준표).
- **miriarts_infra.md**: §4.4 구현된 엔드포인트 전수 표 추가(메서드·경로·컨트롤러:라인). ErrorCode 요약(코드 기준) 절 추가. §4.4 참조에 docs/_code_snapshot_endpoints.md 명시.
- **miriarts_central.md**: §1-1 package.json에 @tanstack/react-query 추가, 소스(package.json) 명시. §1-4 데이터 패칭 정책을 miriartApi·useSessionList·토큰 가드 기준으로 갱신. §2 소스(build.gradle) 명시.
- **MiriArt_API_CONTRACT.md**: 엔드포인트 표에 컨트롤러:라인 열 추가, 페이징 표에 소스(파일:라인) 추가. 401·전수 참조를 miriarts_infra §4.4·_code_snapshot_endpoints.md·FE schemas 명시.
- **MiriArt_ERD_v2.md**: 상단에 "실제 운영 스키마: 엔티티·Flyway·본 문서" 문구 추가. §3.1 chat_sessions를 V5/V6·ChatSession.java 기준 DDL·소스 표기로 갱신. plans 테이블 "(현재 미사용)" 명시.
- **MiriArt_FSD_v2.md**: 검증 기준·참조를 miriarts_infra §4.4·_code_snapshot_endpoints.md로 통일. §1.2 F4 ERD §3.1 참조 추가. 문서 갱신 규칙에서 API_CONTRACT·miriarts_infra §4.4 동기화 명시.
- **MiriArt_PRD_v2.md**: 검증 기준선 2026-03-12, docs/_code_snapshot_endpoints.md·API_CONTRACT 참조. §4.2 ChatSession에 V6 model_type 추가. 문서 이력 2.2 (2026-03-12) 추가.
- **.cursor/rules/infra-ssot.mdc**, **.claude/rules/infra-ssot.mdc**: 스키마 SSOT를 엔티티·Flyway·ERD_v2로 통일. glob에서 docs/mysql_erd_v1.md 제거, docs/_code_snapshot_endpoints.md 추가.
- **.cursor/INFRA_SSOT_GUIDE.md**, **.claude/INFRA_SSOT_GUIDE.md**: 스키마 SSOT 행·§3 변경 시 동기화 문구를 엔티티·Flyway·ERD_v2 기준으로 수정.

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
