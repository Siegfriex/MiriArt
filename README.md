<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)

# MiriArt (미리미대)

**AI Art Mentor** — 미대 입시 준비생을 위한 AI 작품 평가 & 1:1 멘토링 플랫폼

[기능 소개](#-주요-기능) · [시작하기](#-시작하기) · [기술 스택](#-기술-스택) · [프로젝트 구조](#-프로젝트-구조)

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
   git clone https://github.com/YOUR_USERNAME/miri-art.git
   cd miri-art
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   
   `.env.local` 파일을 생성하고 다음 변수를 설정합니다.
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   
   > AI API 호출은 Cloud Run 프록시 서버를 통해 처리됩니다. 로컬 개발 시 백엔드 서버 URL을 지정하세요. API 키는 프론트엔드에 저장되지 않습니다.

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. 브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

빌드 결과물은 `dist/` 디렉터리에 생성됩니다.

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
| **AI** | Google Gemini API (Cloud Run 프록시 경유) |
| **아이콘** | Lucide React |

---

## 📁 프로젝트 구조

Feature-Sliced Design(FSD) 아키텍처를 따릅니다.

```
src/
├── app/           # 앱 초기화, 라우터, 레이아웃, 프로바이더
├── pages/         # 라우트별 페이지 (auth, home, archive, chat-room, profile, result-detail)
├── widgets/       # 복합 UI 블록 (layout, chat, artifact, artwork, home, profile, result)
├── features/      # 비즈니스 기능 (chat, upload, grade, subscription)
├── entities/      # 도메인 엔티티 (session, artwork)
└── shared/        # 공유 리소스 (api, config, model, ui)
```

---

## 🗺 로드맵

- [x] AI 작품 분석 (5축 레이더 차트)
- [x] 합격 확률 비교 아코디언
- [x] AI 멘토 채팅 (다중 모델)
- [x] 아카이브 & 필터링
- [x] 크레딧 & 구독 시트
- [ ] 실제 백엔드 API 연동
- [ ] 인증(로그인/회원가입) 연동
- [ ] PWA 지원

---

## 🤝 기여하기

기여를 환영합니다!

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

프로젝트 링크: [https://github.com/YOUR_USERNAME/miri-art](https://github.com/YOUR_USERNAME/miri-art)

---

<div align="center">

**MiriArt (미리미대)** — AI Art Mentor for 미대 입시

</div>
