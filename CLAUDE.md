# MiriArt (미리미대) — FE + BE 모노레포

> AI 미대 입시 평가·코칭 플랫폼. React FE + Spring Boot BE.

## 핵심 경로

| 경로 | 용도 |
|------|------|
| `src/` | FE — React 19 + TypeScript + Vite 6 + Zustand + Tailwind 4 |
| `miriart-be/` | BE — Java 17 + Spring Boot 3.4 + JPA + MySQL + Redis |
| `docs/` | SSOT 문서 로컬 미러 (정본: miriart_docs 레포) |

## 규칙

- **WSL 전용**: 모든 실행·빌드·배포는 WSL Ubuntu에서만.
- **문서 정본**: [miriart_docs](https://github.com/Siegfriex/miriart_docs). `docs/`는 로컬 미러.
- **AI 서비스**: 별도 레포 [miriart-ai](https://github.com/Siegfriex/miriart-ai). 이 레포에서 직접 수정하지 않음.
- **시크릿 금지**: 환경변수 이름·흐름만. 실제 값 미기재.

## 실행

```bash
cd ~/projects-wsl/MiriArt

# FE
npm install && npm run dev    # localhost:5173

# BE
cd miriart-be && ./gradlew bootRun   # localhost:8080
```

## 참조

- 상세 룰: `.claude/rules/`
- SSOT 가이드: `.claude/INFRA_SSOT_GUIDE.md`
