# MiriArt 인프라·SSOT 에이전트 지침

에이전트가 인프라/배포/환경설정 관련 작업을 할 때 참고할 규칙과 문서 위치를 정리한다.

**원칙**: 문서는 코드를 따른다. 코드가 SSOT. **참조 금지**: `miriart-ai`, `miriart-ai-legacy` 경로는 상세 기술하지 않는다(별도 레포·별도 에이전트 관리).

**문서 레포**: SSOT 문서의 정본은 **[miriart_docs](https://github.com/Siegfriex/miriart_docs)** 레포에 있다. 코드 레포의 `docs/`는 로컬 작업용 미러이며, 최종 반영은 miriart_docs PR로 수행한다.

---

## 1. 참조 문서 (우선순위)

| 용도 | 코드 레포 경로 | miriart_docs 경로 | 비고 |
|------|---------------|-------------------|------|
| **인프라 SSOT** | `docs/SSOT/miriarts_infra.md` | `infra/miriarts_infra.md` | GCP 리소스·배포·TODO 단일 참조 |
| **스키마 SSOT** | `docs/MiriArt_ERD_v2.md` | `erd/MiriArt_ERD_v2.md` | 실 DB(miriart_prod) 역추출 검증 완료 |
| **API 계약** | `docs/MiriArt_API_CONTRACT.md` | `api/MiriArt_API_CONTRACT.md` | 엔드포인트·에러코드 |
| **버전·의존성** | `docs/SSOT/miriarts_central.md` | `central/miriarts_central.md` | FE/BE/AI 의존성 |
| **변경 이력** | `docs/SSOT/CHANGELOG_infra.md` | `changelog/CHANGELOG_infra.md` | 인프라 변경 기록 |
| **BE 배포 스크립트** | `miriart-be/scripts/cloudrun-redeploy.sh` | — | WSL bash 기준 |
| **BE 내부 문서** | `miriart-be/docs/DOCS.md` | — | miriart_docs 링크 허브 |

---

## 2. 작성·수정 시 규칙

- **시크릿**: 실제 값은 절대 기재하지 않는다. 이름·용도·흐름만 기술.
- **근거**: 확인된 내용만 서술. 확인 안 되면 **(추론)** 표기.
- **소스 표기**: **소스(파일:라인)** 또는 `§섹션`을 붙인다.

---

## 3. 변경 시 동기화 (Change Policy)

코드 변경 시 아래 순서로 문서를 갱신한다:

1. **코드 레포 `docs/` 수정** (로컬 작업)
2. **miriart_docs 레포에 PR** (정본 반영)
3. **CHANGELOG_infra.md 이력 추가**

### 3.1 문서 갱신 순서

- **엔드포인트·ErrorCode**: 코드(controller, ErrorCode.java) → miriarts_infra §4.4 → API_CONTRACT
- **TX·락·예외**: 코드(서비스·Repository) → miriarts_infra §4.4
- **스키마**: 엔티티·Flyway → ERD_v2
- **인프라**: Cloud Run/SQL/Redis/Secret → miriarts_infra §2·§3·§5
- **의존성**: build.gradle/package.json → miriarts_central §1·§2
- **구현 상태**: FSD §1 ↔ PRD §4.1 동시 수정

---

## 4. 배포 상태 요약

- **BE**: Gradle + Dockerfile + gcloud run deploy. 스크립트: `miriart-be/scripts/cloudrun-redeploy.sh`. 상세: miriarts_infra §5.
- **FE**: Vercel Git push 자동 배포.
- **AI**: 별도 레포 관리.

---

## 5. 에이전트 변경 시 SSOT 업데이트

### 5-1. SSOT 본문 갱신

| 수정 대상 | 갱신할 SSOT |
|-----------|------------|
| Cloud Run / SQL / Redis / GCS / Secret | miriarts_infra §2·§3 |
| application*.yml, 배포 스크립트 | miriarts_infra §3·§5, miriarts_central §4 |
| SecurityConfig, CORS, 인증 경로 | miriarts_infra §4.2 |
| Dockerfile, CI/CD | miriarts_infra §5 |
| 엔드포인트·ErrorCode | miriarts_infra §4.4, API_CONTRACT |
| DB 스키마·Flyway | ERD_v2 |
| build.gradle / package.json | miriarts_central §1·§2 |

### 5-2. 변경 이력 기록

`CHANGELOG_infra.md` 맨 위에 **날짜·에이전트 롤·수정 내역** 추가.

### 5-3. 트리거 조건

- `miriart-be/**/application*.yml`, `**/Dockerfile`, 배포 스크립트 편집
- SecurityConfig, Secret/환경변수 변경
- 엔드포인트·ErrorCode·스키마 변경

인프라 무관한 FE 페이지·BE 비인증 로직만 수정한 경우 트리거하지 않음.
