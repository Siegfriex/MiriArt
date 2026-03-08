# Cursor 룰·docs·SSOT 정리 산출서 (로컬 기준)

> **기준**: 본 로컬 디바이스 (Windows Cursor 루트 `C:\Users\6sieg\Dev\MiriArt`)  
> **목적**: (1) Cursor 룰로 이동할 항목 (2) docs 내 경로 지정 배치 (3) SSOT 폴더 유지 (4) 관련 .mdc·.md 수정 소요 산출

---

## 1. Cursor 룰로 이동할 항목

| 현재 위치 (루트) | 이동 후 경로 | 비고 |
|------------------|--------------|------|
| `infra-ssot.mdc` | `.cursor/rules/infra-ssot.mdc` | globs는 `docs/` 경로 참조 → 파일 이동 후 그대로 유효 |
| `INFRA_SSOT_GUIDE.md` | `.cursor/INFRA_SSOT_GUIDE.md` | 기존 문서·mdc에서 이미 `.cursor/INFRA_SSOT_GUIDE.md`로 참조 중 |

**이동만 하면 되는 항목**: 위 2개.  
**추가 룰**: `miriart-dev-rules.mdc`는 이미 `.cursor/rules/`에 있음 → 수정 불필요(경로 참조 없음).

---

## 2. docs 내 배치 (경로 지정, SSOT 유지)

기존 `infra-ssot.mdc`·`INFRA_SSOT_GUIDE.md`가 참조하는 경로는 모두 **`docs/`** 하위를 전제로 함.  
**SSOT 폴더**: 루트 `SSOT/`를 **`docs/SSOT/`**로 이동하여 유지(이름·구조 동일).

### 2.1 docs/SSOT/ (SSOT 폴더 유지)

| 현재 위치 | 이동 후 |
|-----------|---------|
| `SSOT/CHANGELOG_infra.md` | `docs/SSOT/CHANGELOG_infra.md` |
| `SSOT/miriarts_central.md` | `docs/SSOT/miriarts_central.md` |
| `SSOT/miriarts_infra.md` | `docs/SSOT/miriarts_infra.md` |

### 2.2 docs/ (인프라·스키마·API·설계)

| 현재 위치 (루트) | 이동 후 |
|------------------|---------|
| `MiriArt_GCP_INFRA.md` | `docs/MiriArt_GCP_INFRA.md` |
| `MiriArt_BE_CloudRun_CloudSQL_FIX.md` | `docs/MiriArt_BE_CloudRun_CloudSQL_FIX.md` |
| `MiriArt_ERD_v2.md` | `docs/MiriArt_ERD_v2.md` |
| `MiriArt_API_CONTRACT.md` | `docs/MiriArt_API_CONTRACT.md` |
| `MiriArt_PRD_v2.md` | `docs/MiriArt_PRD_v2.md` |
| `MiriArt_FSD_v2.md` | `docs/MiriArt_FSD_v2.md` |
| `MIRIART_HOME_COMMUNITY_DESIGN_v1.md` | `docs/MIRIART_HOME_COMMUNITY_DESIGN_v1.md` |

### 2.3 docs/design/ (디자인·팔레트·라이트 스킴·QA)

| 현재 위치 (루트) | 이동 후 |
|------------------|---------|
| `design-system-2nd-audit.md` | `docs/design/design-system-2nd-audit.md` |
| `light-scheme-design.md` | `docs/design/light-scheme-design.md` |
| `light-scheme-qa-checklist.md` | `docs/design/light-scheme-qa-checklist.md` |
| `palette-ssot-design.md` | `docs/design/palette-ssot-design.md` |
| `palette-ssot-final-report.md` | `docs/design/palette-ssot-final-report.md` |

### 2.4 기타 (프롬프트·가이드)

| 현재 위치 (루트) | 이동 후 | 비고 |
|------------------|---------|------|
| `도커_빌드_푸시_GCP_디플로이_프롬프트.md` | `.cursor/prompts/도커_빌드_푸시_GCP_디플로이_프롬프트.md` 또는 `docs/ops/도커_빌드_푸시_GCP_디플로이_프롬프트.md` | 프롬프트 보관은 `.cursor/prompts/`, 공용 문서화는 `docs/ops/` 중 선택 |
| *(없음)* | `docs/mysql_erd_v1.md` | infra-ssot.mdc·GUIDE에서 참조하나 현재 루트에 없음 → 추후 생성 시 `docs/`에 둘 것 |

---

## 3. 수정 소요 — .mdc / .md (로컬 기준)

이동 후 **경로가 바뀌는 참조**만 수정하면 됨.  
(이미 `docs/`·`.cursor/`를 전제로 한 참조는 이동만 하면 됨.)

### 3.1 .mdc 수정

| 파일 (이동 후 경로) | 수정 내용 | 예상 건수 |
|---------------------|-----------|-----------|
| `.cursor/rules/infra-ssot.mdc` | 없음. globs가 `docs/SSOT/**`, `docs/MiriArt_*INFRA*.md` 등이므로 파일을 docs로 옮기면 그대로 적용됨. | 0 |

### 3.2 .md 수정 — docs/ 경로 참조

아래 파일들은 **다른 .md나 문서 내에서 상대 경로로 `docs/...`를 참조**하고 있음.  
**현재는 루트에 있어서** `docs/`가 없으므로, **파일을 docs로 이동한 뒤**에는 경로가 맞음.  
단, **서로를 참조하는 문서 내 링크**가 상대경로(예: `docs/MiriArt_GCP_INFRA.md`)로 되어 있으면, **해당 파일이 `docs/` 안으로 들어간 후**에는 같은 `docs/` 내 상대 경로로 바꿀 수 있음(선택).

| 파일 (이동 후) | 수정 필요 여부 | 수정 내용 |
|----------------|----------------|-----------|
| `docs/SSOT/miriarts_infra.md` | 선택 | 내부 `docs/MiriArt_GCP_INFRA.md` 등 → `MiriArt_GCP_INFRA.md`(같은 docs 기준 상대경로)로 단순화 가능. 현재도 `docs/` 기준이면 동작함. |
| `docs/SSOT/CHANGELOG_infra.md` | 있음 | `.cursor/INFRA_SSOT_GUIDE.md` → 이미 올바름. `.cursor/rules/infra-ssot.mdc` 문구는 이동 후 경로와 일치. |
| `INFRA_SSOT_GUIDE.md` → `.cursor/INFRA_SSOT_GUIDE.md` | 없음 | 본문이 모두 `docs/...` 참조 → 이동만 하면 됨. |
| `README.md` (루트) | 있음 | `[docs/MiriArt_GCP_INFRA.md](docs/MiriArt_GCP_INFRA.md)` → 이동 후에도 동일 경로이므로 **수정 없음**. |

### 3.3 .md 수정 — 루트에 두는 파일이 docs를 참조하는 경우

| 파일 | 수정 내용 | 예상 건수 |
|------|-----------|-----------|
| `README.md` | 없음. `docs/MiriArt_GCP_INFRA.md` 링크는 docs 이동 후에도 유효. | 0 |

### 3.4 기타 참조 (문서 간)

- `MiriArt_FSD_v2.md`, `MiriArt_API_CONTRACT.md`, `MiriArt_PRD_v2.md` 등은 `miriarts_infra`, `docs/SSOT/`, `MiriArt_ERD_v2` 등을 **문서명·§섹션**으로 참조.  
- **경로가 아닌 문서명**으로 참조하므로, **파일만 `docs/`로 이동**하면 되고, **내부 경로 수정은 불필요**할 수 있음.  
- 단, **상대 링크**가 있다면 이동 후 `docs/` 기준으로 조정(예: `[ERD v2](MiriArt_ERD_v2.md)` 등).

---

## 4. 수정 소요 요약 (로컬 기준)

| 구분 | 항목 | 수정 건수(예상) |
|------|------|------------------|
| **Cursor 룰** | `infra-ssot.mdc` → `.cursor/rules/infra-ssot.mdc` 이동 | 0 (내용 수정 없음) |
| | `INFRA_SSOT_GUIDE.md` → `.cursor/INFRA_SSOT_GUIDE.md` 이동 | 0 (내용 수정 없음) |
| **docs 배치** | `SSOT/` → `docs/SSOT/` (3파일) | 0 (이동만) |
| | 루트 `MiriArt_*.md` 등 → `docs/` 또는 `docs/design/` (위 표 기준) | 0 (이동만) |
| **.md 내부** | `docs/SSOT/miriarts_infra.md` 내 상대 링크 단순화 | 선택 1건 |
| | `docs/SSOT/CHANGELOG_infra.md` | 0 (이미 .cursor 경로 참조) |
| **루트 README** | `docs/MiriArt_GCP_INFRA.md` 링크 | 0 (경로 동일) |

**총 필수 수정**: **0건** (이동만으로 기존 `docs/`·`.cursor/` 참조와 일치).  
**선택 수정**: `miriarts_infra.md` 내부에서 같은 docs 내 문서 참조 시 상대경로로 정리 1건.

---

## 5. 작업 순서 제안 (로컬)

1. **`docs/` 생성** 및 **`docs/design/`** 생성.
2. **SSOT 유지**: `SSOT/` → `docs/SSOT/` 로 이동(폴더 통째).
3. **인프라/설계 문서**: 루트의 `MiriArt_*.md`, `MIRIART_HOME_*.md` → `docs/` 로 이동.
4. **디자인 문서**: `design-system-2nd-audit.md`, `light-scheme-*.md`, `palette-ssot-*.md` → `docs/design/` 로 이동.
5. **Cursor 룰**: `infra-ssot.mdc` → `.cursor/rules/infra-ssot.mdc`, `INFRA_SSOT_GUIDE.md` → `.cursor/INFRA_SSOT_GUIDE.md`.
6. **한글 파일명**: `도커_빌드_푸시_GCP_디플로이_프롬프트.md` → `.cursor/prompts/` 또는 `docs/ops/` 중 하나로 이동.
7. **(선택)** `docs/SSOT/miriarts_infra.md` 내부 동일 docs 문서 링크 상대경로 정리.

이후 `.cursor/rules/infra-ssot.mdc`의 globs와 `.cursor/INFRA_SSOT_GUIDE.md`의 표는 **수정 없이** 그대로 사용 가능.
