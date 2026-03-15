# MiriArt BE — 문서 참조

> 모든 SSOT·설계 문서는 [miriart_docs 레포](https://github.com/Siegfriex/miriart_docs)에서 관리합니다.
> BE 코드 변경 시 관련 SSOT 문서를 miriart_docs PR에서 함께 갱신해야 합니다.

## 핵심 문서

| 문서 | 경로 (miriart_docs) | BE 관련 섹션 |
|------|---------------------|-------------|
| **인프라 SSOT** | `infra/miriarts_infra.md` | §2 GCP 리소스, §3 환경변수·Secret, §4.4 API·ErrorCode, §5 배포 |
| **버전·의존성 SSOT** | `central/miriarts_central.md` | §2 Gradle 의존성, §4 Dockerfile·yml |
| **API 계약** | `api/MiriArt_API_CONTRACT.md` | 엔드포인트·Request/Response·ErrorCode |
| **ERD** | `erd/MiriArt_ERD_v2.md` | MySQL 스키마 (실 DB 검증 완료) |
| **FSD** | `fsd/MiriArt_FSD_v2.md` | I-P-O-E 기능 흐름·컨트롤러:라인 |
| **PRD** | `prd/MiriArt_PRD_v2.md` | §4 기능 갭 분석·엔티티 요약 |
| **변경 이력** | `changelog/CHANGELOG_infra.md` | 인프라·배포·설정 변경 기록 |

## BE 변경 시 문서 갱신 규칙

1. **엔드포인트·ErrorCode 추가/변경** → `infra/miriarts_infra.md` §4.4 + `api/MiriArt_API_CONTRACT.md`
2. **DB 스키마·Flyway 추가** → `erd/MiriArt_ERD_v2.md` + 엔티티 동기화
3. **application*.yml·Secret·배포 파라미터 변경** → `infra/miriarts_infra.md` §3·§5 + `central/miriarts_central.md` §4
4. **의존성(build.gradle) 변경** → `central/miriarts_central.md` §2
5. 모든 인프라 관련 수정 후 → `changelog/CHANGELOG_infra.md`에 이력 추가

## BE 내부 문서 (이 레포)

| 파일 | 설명 |
|------|------|
| `AI_INTERNAL_API_CONTRACT.md` | BE→외부 AI 서비스 내부 API 상세 계약 |
| `work-log-*.md` | 작업 로그 |
