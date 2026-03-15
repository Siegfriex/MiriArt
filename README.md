<div align="center">

**Frontend**  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-18+-339933?logo=nodedotjs)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

**Backend**  
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![Gradle](https://img.shields.io/badge/Gradle-9.2-02303A?logo=gradle)](https://gradle.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)](https://redis.io/)

**AI Service**  
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Vertex_AI-4285F4?logo=googlecloud)](https://cloud.google.com/vertex-ai)

# MiriArt (미리미대)

**AI Art Mentor** — 미대 입시 준비생을 위한 AI 작품 평가 & 1:1 멘토링 플랫폼

[기능 소개](#-주요-기능) · [시작하기](#-시작하기) · [배포](#-배포) · [기술 스택](#-기술-스택) · [프로젝트 구조](#-프로젝트-구조)

</div>

---

## 📌 소개

**MiriArt(미리미대)**는 미술대학 입시를 준비하는 수험생을 위한 AI 기반 포트폴리오 멘토링 서비스입니다. 작품 이미지를 업로드하면 AI가 8초 만에 구도·밀도·형태력 등을 분석해 등급을 제공하고, 실제 합격작 데이터 기반의 합격 확률을 예측합니다. 또한 상위권 미대 커리큘럼으로 훈련된 AI 멘토와 1:1 채팅으로 피드백을 받을 수 있습니다.

### 주요 기능

| 기능 | 설명 |
|------|------|
| **AI 작품 분석** | 이미지 업로드 → 8초 내 5축(밀도, 형태, 완성도, 연관성, 사고력) 분석 및 등급(A~F) 제공 |
| **합격 확률 예측** | 실제 합격작 데이터 기반 TOP/HIGH/MID/LOW/CRITICAL 티어별 대학·전공 추천 |
| **AI 멘토 채팅** | Ask / Plan / Critic / Inference / Image Edit 등 5가지 모델로 1:1 코칭 |
| **커뮤니티** | 홈 피드, Q&A/일반 게시글, 좋아요·댓글, 소셜 로그인(카카오/구글) |
| **아카이브** | 분석 이력 관리, 학교별·등급별 필터링 |
| **크레딧 시스템** | 플랜별 크레딧 제한 (free/basic/premium) |

---

## 🚀 시작하기

### 요구 사항

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/Siegfriex/MiriArt.git
   cd MiriArt
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   
   `.env.local` 파일을 프로젝트 루트에 생성합니다.
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   > AI·인증·커뮤니티 API는 백엔드(Spring Boot)를 통해 처리됩니다. 로컬 개발 시 BE 서버 URL을 지정하세요. API 키는 프론트엔드에 저장되지 않습니다.

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000` 접속 (Vite 기본 포트는 5173, 본 프로젝트는 3000 사용)

### 빌드

```bash
npm run build
```
빌드 결과물은 `dist/` 디렉터리에 생성됩니다.

---

## 📦 배포

### 전체 순서

1. **배포 전 준비 (로컬)** — `vercel.json` 확인, `vite.config.ts` define 정리
2. **GitHub Push** — `deploy` 브랜치 푸시
3. **Vercel 연결** — GitHub 연동, 환경 변수 설정
4. **배포 완료** — FE URL 획득
5. **OAuth Redirect URI 등록** — 카카오/구글 개발자 콘솔에 `https://<Vercel URL>/auth/callback` 등록
6. **BE 설정** — `FRONTEND_OAUTH_SUCCESS_URL`을 Vercel URL 기준으로 업데이트

### Vercel (프론트엔드)

- **프로젝트**: GitHub `Siegfriex/MiriArt` → **Root Directory**: `./` (루트), **Branch**: `deploy`
- **Framework Preset**: Vite
- **Build**: `npm run build` / **Output**: `dist`
- **환경 변수**:
  | Key | Value | 비고 |
  |-----|--------|------|
  | `VITE_API_BASE_URL` | `https://<BE Cloud Run URL>` | BE 배포 후 실제 URL로 설정 |
  | `GEMINI_API_KEY` | (빈 값 가능) | FE 미사용, 빌드 오류 방지용 |

SPA 라우팅을 위해 루트의 `vercel.json`에 `rewrites`로 모든 경로를 `index.html`로 fallback합니다.

### 레포 구조 (모노레포)

| 경로 | 설명 |
|------|------|
| **루트** | FE (React + Vite), `package.json` 기준 |
| `miriart-be/` | Spring Boot API (인증, 커뮤니티, AI 프록시) |
| `miriart-ai/` | FastAPI AI 서비스 (Gemini) |
| `docs/` | PRD, ERD, 인프라 명세 등 |

BE/AI 배포는 GCP Cloud Run 등 별도 파이프라인을 사용합니다. 자세한 인프라 명세는 [docs/SSOT/miriarts_infra.md](docs/SSOT/miriarts_infra.md)를 참조하세요.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | React 19, Vite 6 |
| **언어** | TypeScript 5.8 |
| **스타일** | Tailwind CSS 4 |
| **상태 관리** | Zustand |
| **라우팅** | React Router 6 |
| **애니메이션** | Framer Motion |
| **백엔드** | Spring Boot (miriart-be), FastAPI (miriart-ai) |
| **AI** | Google Gemini API (BE/AI 서비스 경유) |
| **아이콘** | Lucide React |

### 백엔드 (miriart-be) — Java

| 항목 | 버전/스택 |
|------|-----------|
| **언어** | Java 17 |
| **빌드** | Gradle 9.2.1 |
| **프레임워크** | Spring Boot 3.4.2 |
| **주요 의존성** | Spring Web, WebFlux, Security, OAuth2 Client, Data JPA, Data Redis, Validation, Actuator |
| **DB** | MySQL (mysql-connector-j), Cloud SQL Socket Factory (Cloud Run 연동) |
| **인증** | OAuth2 (카카오/구글), JWT (jjwt 0.12.6) |
| **스토리지** | Google Cloud Storage (spring-cloud-gcp-starter-storage) |
| **API 문서** | SpringDoc OpenAPI 2.8.6 (Swagger UI) |
| **기타** | Lombok, GCP BOM 6.5.4 |

로컬 실행: `miriart-be/`에서 `./gradlew bootRun` (Java 17 필요). 상세는 [miriart-be/.env.example](miriart-be/.env.example) 및 [docs/SSOT/miriarts_infra.md](docs/SSOT/miriarts_infra.md) §5 참고.

### AI 서비스 (miriart-ai) — Python

| 항목 | 버전/스택 |
|------|-----------|
| **언어** | Python 3.11 |
| **프레임워크** | FastAPI 0.115.8 |
| **ASGI 서버** | Uvicorn 0.34.0 |
| **AI** | Google Cloud AI Platform 1.79.0 (Vertex AI / Gemini) |
| **스토리지** | Google Cloud Storage 2.19.0 |
| **설정·검증** | Pydantic 2.10.6, pydantic-settings 2.7.1, python-dotenv 1.0.1 |
| **기타** | httpx 0.27.2, python-multipart 0.0.20 |

로컬 실행: `miriart-ai/`에서 가상환경 생성 후 `uvicorn app.main:app --reload`. 환경 변수는 `.env` 참고 (`.env.example` 복사 후 값 입력).

---

## 📁 프로젝트 구조 (FE)

Feature-Sliced Design(FSD) 아키텍처를 따릅니다.

```
src/
├── app/           # 앱 초기화, 라우터, 레이아웃, 프로바이더
├── pages/         # 라우트별 페이지 (auth, home, archive, chat-room, profile, result-detail, posts)
├── widgets/       # 복합 UI (layout, chat, artifact, artwork, home, profile, result, community)
├── features/      # 비즈니스 기능 (chat, upload, grade, subscription, community)
├── entities/      # 도메인 엔티티 (session, artwork, community)
└── shared/        # 공유 리소스 (api, config, model, ui)
```

---

## 🗺 로드맵

- [x] AI 작품 분석 (5축 레이더 차트)
- [x] 합격 확률 비교 아코디언
- [x] AI 멘토 채팅 (다중 모델)
- [x] 아카이브 & 필터링
- [x] 크레딧 & 구독 시트
- [x] 백엔드 API 연동 (miriartApi, 인증·커뮤니티)
- [x] 소셜 로그인 (카카오/구글) + AuthCallback
- [x] 커뮤니티 홈 탭 (피드, 게시글, 좋아요)
- [ ] Vercel FE 배포 + OAuth Redirect URI 연동
- [ ] PWA 지원

---

## 🤝 기여하기

1. 저장소 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경 사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 📬 연락처

프로젝트 링크: [https://github.com/Siegfriex/MiriArt](https://github.com/Siegfriex/MiriArt)

---

<div align="center">

**MiriArt (미리미대)** — AI Art Mentor for 미대 입시

</div>
