# 인프라 SSOT 변경 이력 (에이전트 반영)

> **목적**: 에이전트가 인프라·배포·설정 관련 수정 후 SSOT를 갱신할 때, **날짜·롤·구체적 수정 내역**을 기록한다.  
> **규칙**: 최신이 **위**에 오도록 추가. 시크릿 값은 기재하지 않음.  
> **지침**: `.cursor/INFRA_SSOT_GUIDE.md` §5.

---

## 이력

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
