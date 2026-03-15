# MiriArt SSOT — 버전·환경 명세서 (Central)

> 전 프로젝트 의존성/버전 Single Source of Truth.  
> 생성일: 2026-03-01.

---

## 변경 시 업데이트 규칙

- **package.json**, **build.gradle**, **requirements.txt**, **Dockerfile**, **cloudbuild.yaml**에서 버전·이미지·포트를 변경할 때는 이 SSOT 문서를 함께 갱신한다.
- 특히 **Python 의존성**(grpcio, google-cloud-aiplatform 등) 버전 변경 시에는 **3.11 기반 Docker 이미지**에서 빌드·기동 테스트를 한 뒤, 이 문서의 버전 테이블을 반영한다.

**requirements.txt 변경 규칙 (v1)**  
v1 동안 `miriart-ai/requirements.txt`를 변경하는 모든 PR은, 반드시 **Python 3.11 기반 Docker 이미지**에서 다음을 수행한 뒤에만 머지한다.

1. `pip install -r requirements.txt`
2. `uvicorn app.main:app --host 0.0.0.0 --port 8080` 기동
3. `/health` 또는 `/docs` 엔드포인트에 대해 **200 OK** 응답 확인

이 검증이 실패하는 변경사항은 프로덕션 배포 대상에 포함하지 않는다.

---

## 1. 프론트엔드(루트) 의존성 정보

### 1-1. package.json 요약

*소스: 루트 package.json (engines:6-8, dependencies:17-29, devDependencies:30-35, overrides:36).*

| 구분 | 키 | 버전 (package.json) |
|------|----|---------------------|
| **engines** | node | >=18.0.0 |
| | npm | >=9.0.0 |
| **dependencies** | @tanstack/react-query | ^5.62.0 |
| | @google/genai | ^1.41.0 |
| | clsx | ^2.1.0 |
| | framer-motion | ^11.0.0 |
| | lucide-react | ^0.574.0 |
| | react | ^19.2.4 |
| | react-dom | ^19.2.4 |
| | react-router-dom | ^6.30.3 |
| | tailwind-merge | ^2.2.1 |
| | tailwindcss | ^4.1.18 |
| | zod | ^4.3.6 |
| | zustand | ^4.5.0 |
| **devDependencies** | @tailwindcss/vite | ^4.2.0 |
| | @playwright/test | ^1.58.2 |
| | @types/node | ^22.14.0 |
| | @vitejs/plugin-react | ^5.0.0 |
| | typescript | ~5.8.2 |
| | vite | ^6.2.0 |
| **overrides** | minimatch | >=9.0.6 |

### 1-2. Lock 파일

| 항목 | 값 |
|------|-----|
| Lock 파일 종류 | **package-lock.json** (존재) |
| pnpm-lock.yaml | 없음 |
| yarn.lock | 없음 |

### 1-3. package-lock.json 기준 실제 설치 버전 (주요만)

| 패키지 | lock 버전 |
|--------|-----------|
| react | 19.2.4 |
| react-dom | 19.2.4 |
| react-router-dom | 6.30.3 |
| vite | 6.4.1 |
| tailwindcss | 4.2.0 |
| @tailwindcss/vite | 4.2.0 |
| zustand | 4.5.7 |
| framer-motion | 11.18.2 |
| @google/genai | 1.42.0 |
| @vitejs/plugin-react | 5.1.4 |
| lucide-react | 0.574.0 |
| clsx | 2.1.1 |
| tailwind-merge | 2.6.1 |
| zod | 4.3.6 |
| @tanstack/react-query | 5.90.21 |
| typescript | 5.8.3 |

### 1-4. 프론트엔드 데이터 패칭/상태 관리 정책 (v1)

*소스: src/shared/api/miriartApi.ts, useSessionList.ts, useChatMutation.ts 등.*

- **현재** FE에는 **@tanstack/react-query**가 도입되어 있으며, 세션 목록·채팅·분석 등에서 useQuery/useMutation 사용.
- 데이터 패칭은 miriartApi (apiFetch) + **React Query** 및 필요 시 Zustand 조합으로 구현됨.
- apiFetch 레이어에서 인증 토큰 자동 첨부(getAuthHeaders), 401 시 refreshToken 재시도, 공통 에러 포맷(handleApiError) 처리. 필요 시 Zod 기반 응답 스키마 검증(schemas/*.ts).
- 토큰 없을 때 API 호출 방지: useSessionList(enabled: !!tokenManager.getAccessToken()), Home/Archive에서 getAccessToken() 체크 후 getList 호출.

---

## 2. 메인 백엔드(miriart-be) Gradle 의존성·플러그인

*소스: miriart-be/build.gradle (plugins:1-4, Java toolchain:10-12), miriart-be/gradle/wrapper/gradle-wrapper.properties:3 (Gradle 9.2.1).*

### 2-1. plugins 블록

| Plugin ID | Version |
|-----------|---------|
| java | (core, 버전 없음) |
| org.springframework.boot | 3.4.2 |
| io.spring.dependency-management | 1.1.7 |

### 2-2. Java toolchain

| 항목 | 값 |
|------|-----|
| languageVersion | JavaLanguageVersion.of(17) |

### 2-3. Gradle Wrapper

| 항목 | 값 |
|------|-----|
| distributionUrl | gradle-9.2.1-bin.zip |
| **Gradle 버전** | **9.2.1** |

### 2-4. dependencies 블록 (configuration / group:name / version / 용도)

| Configuration | Group:Name | Version | 용도 |
|---------------|------------|---------|------|
| implementation | org.springframework.boot:spring-boot-starter-web | (BOM) | Web |
| implementation | org.springframework.boot:spring-boot-starter-webflux | (BOM) | Web |
| implementation | org.springframework.boot:spring-boot-starter-security | (BOM) | Security & OAuth2 |
| implementation | org.springframework.boot:spring-boot-starter-oauth2-client | (BOM) | OAuth2 |
| implementation | org.springframework.boot:spring-boot-starter-data-jpa | (BOM) | Data |
| implementation | org.springframework.boot:spring-boot-starter-data-redis | (BOM) | Redis |
| runtimeOnly | com.mysql:mysql-connector-j | (BOM) | MySQL |
| runtimeOnly | com.google.cloud.sql:mysql-socket-factory-connector-j-8 | 1.25.1 | Cloud SQL 소켓 |
| implementation | org.springframework.boot:spring-boot-starter-validation | (BOM) | Validation |
| implementation | org.springframework.boot:spring-boot-starter-mail | (BOM) | Mail |
| implementation | org.springframework.boot:spring-boot-starter-actuator | (BOM) | Actuator |
| implementation | io.jsonwebtoken:jjwt-api | 0.12.6 | JWT |
| runtimeOnly | io.jsonwebtoken:jjwt-impl | 0.12.6 | JWT |
| runtimeOnly | io.jsonwebtoken:jjwt-jackson | 0.12.6 | JWT |
| implementation | com.google.cloud:spring-cloud-gcp-starter-storage | (GCP BOM 6.5.4) | GCS |
| implementation | org.springdoc:springdoc-openapi-starter-webmvc-ui | 2.8.6 | Swagger UI |
| compileOnly | org.projectlombok:lombok | (BOM) | Lombok |
| annotationProcessor | org.projectlombok:lombok | (BOM) | Lombok |
| implementation | org.flywaydb:flyway-core | (BOM) | Flyway migration |
| implementation | org.flywaydb:flyway-mysql | (BOM) | Flyway MySQL |
| testImplementation | org.springframework.boot:spring-boot-starter-test | (BOM) | Test |
| testImplementation | org.springframework.security:spring-security-test | (BOM) | Test |
| testRuntimeOnly | org.junit.platform:junit-platform-launcher | (BOM) | Test |
| testImplementation | org.wiremock:wiremock-standalone | 3.3.1 | API Mock Test |
| developmentOnly | org.springframework.boot:spring-boot-devtools | (BOM) | Dev |

**기타 설정**

- **resolutionStrategy (force):** springdoc-openapi-starter-webmvc-ui, springdoc-openapi-starter-common, springdoc-openapi-starter-webmvc-api → 2.8.6  
- **buildDir:** build.gradle에 buildDir 미설정 → Gradle 기본값 **build/** 사용. JAR 경로: **build/libs/** (miriart-be/Dockerfile COPY 경로와 일치).

---

## 3. 외부 AI 서비스 의존성

AI 서비스 의존성(Python, requirements.txt, Dockerfile, cloudbuild 등)은 **별도 레포에서 관리**한다. 본 레포에서는 미참조.

---

## 4. Dockerfile / YAML / 설정 파일 요약

### 4-1. Dockerfile

| 파일 | FROM 이미지 (tag) | EXPOSE | 실행 명령 (CMD/ENTRYPOINT) |
|------|-------------------|--------|----------------------------|
| **miriart-be/Dockerfile** | builder: eclipse-temurin:17-jdk-jammy | — | — |
| | runtime: eclipse-temurin:17-jre-jammy | 8080 | ENTRYPOINT ["java", "-jar", "/app.jar"] |
| **server/Dockerfile** | node:20-slim (builder & runner) | 8080 | CMD ["node", "dist/index.js"] |

- **BE:** JAR 복사 경로 `COPY --from=builder /app/build/libs/*.jar app.jar` (Gradle 기본 출력 build/libs 사용).
- **server/Dockerfile 용도:** `server/`는 **Express + @google/genai 기반 Node API 서버**. **(현재 비활성 / future use)**. 루트는 Vite SPA, server는 별도 앱.
- **외부 AI 서비스:** Dockerfile·배포는 별도 레포에서 관리.

### 4-2. Cloud Build

BE/FE용 Cloud Build 파이프라인은 문서·스크립트 기준 수동/스크립트 배포. 외부 AI 서비스 배포는 별도 레포에서 관리.

### 4-3. Spring application*.yml 핵심 값

| 파일 | 항목 | 값/비고 |
|------|------|---------|
| application.yml | server.port | 8080 |
| | spring.application.name | miriart-api |
| | miriart.frontend.oauth-success-url | ${FRONTEND_OAUTH_SUCCESS_URL:http://localhost:5173} |
| | miriart.fastapi.internal-url | ${FASTAPI_INTERNAL_URL:http://localhost:8000} |
| | miriart.gcs.bucket | ${GCS_BUCKET_NAME:miriart-bucket} |
| application-dev.yml | spring.datasource.url | jdbc:mysql://localhost:3306/miriart_dev?useSSL=false&... |
| | spring.data.redis | host: localhost, port: 6379 |
| | OAuth2 | kakao / google (client-id/secret 환경변수) |
| application-prod.yml | server.port | ${PORT:8080} |
| | server.forward-headers-strategy | framework |
| | spring.datasource.url/username/password | ${SPRING_DATASOURCE_URL}, ${SPRING_DATASOURCE_USERNAME}, ${SPRING_DATASOURCE_PASSWORD} (Secret 주입) |
| | spring.datasource.hikari | connection-timeout: 30000, maximum-pool-size: 10, initialization-fail-timeout: 30000 |
| | spring.data.redis | host: ${SPRING_DATA_REDIS_HOST}, port: 6379 |
| | spring.flyway | enabled: true, baseline-on-migrate: true, baseline-version: 6, locations: classpath:db/migration |
| | spring.jpa.hibernate.ddl-auto | validate |
| | miriart.auth.cookie-same-site | None (prod) |
| | miriart.jwt.secret | access: ${JWT_ACCESS_SECRET}, refresh: ${JWT_REFRESH_SECRET} |
| | miriart.jwt.expiration | access: ${JWT_ACCESS_EXPIRATION_MS:900000}, refresh: ${JWT_REFRESH_EXPIRATION_MS:604800000} |
| | management.endpoints.web.exposure | include: health |
| | OAuth2 | google만 (client-id/secret from env) |

### 4-4. v1 배포 구조 정책

v1 출시 전까지의 배포 구조는 다음과 같이 유지한다.

- **메인 백엔드 (`miriart-be`):** Gradle + Dockerfile 기반 수동 또는 스크립트형 배포
- **프론트엔드 (React/Vite SPA):** Vercel를 사용한 SPA 배포
- **외부 AI 서비스:** 별도 레포에서 관리

BE용 Cloud Build 파이프라인 추가는 v1 이후 단계에서 검토한다.

---

## 5. 최종 SSOT 요약 테이블

### 5-1. 런타임 버전 표

| 영역 | 스택 | 버전 | 출처 파일/명령 |
|------|------|------|----------------|
| FE | Node.js | v22.17.1 (권장 >=18) | node -v / package.json engines |
| FE | npm | 11.7.0 (권장 >=9) | npm -v / package.json engines |
| BE | Java | 17 | java -version, build.gradle toolchain |
| AI | Python (로컬) | 3.13.12 | .venv, python --version |
| AI | Python (운영) | 3.11 | miriart-ai/Dockerfile FROM python:3.11-slim |
| (server) | Node (Docker) | 20 | server/Dockerfile FROM node:20-slim |

### 5-2. 주요 라이브러리/프레임워크 버전 표

**FE**

| 라이브러리 | package.json 범위 | lock 실제 |
|------------|-------------------|-----------|
| React | ^19.2.4 | 19.2.4 |
| React Router | ^6.30.3 | 6.30.3 |
| Vite | ^6.2.0 | 6.4.1 |
| Tailwind CSS | ^4.1.18 | 4.2.0 |
| @tailwindcss/vite | ^4.2.0 | 4.2.0 |
| Zustand | ^4.5.0 | 4.5.7 |
| framer-motion | ^11.0.0 | 11.18.2 |
| @google/genai | ^1.41.0 | 1.42.0 |
| zod | ^4.3.6 | 4.3.6 |

**BE**

| 라이브러리 | 버전/비고 |
|------------|------------|
| Spring Boot | 3.4.2 (plugin) |
| Spring Security / OAuth2 Client | BOM |
| Spring Data JPA / Redis | BOM |
| Spring Cloud GCP (storage) | 6.5.4 (BOM) |
| SpringDoc OpenAPI | 2.8.6 |
| jjwt (api/impl/jackson) | 0.12.6 |
| MySQL Connector | BOM (Spring Boot 관리) |
| mysql-socket-factory-connector-j-8 | 1.25.1 |

**AI** *(별도 레포 miriart-ai 기준, 2026-03-15 검증)*

| 라이브러리 | 버전 |
|------------|------|
| fastapi | 0.115.8 |
| uvicorn[standard] | 0.34.0 |
| google-genai | >=1.5.0 |
| google-cloud-storage | >=2.18.0 |
| google-auth | >=2.35.0 |
| pydantic | 2.10.6 |
| pydantic-settings | 2.7.1 |
| httpx | >=0.27.0 |
| python-multipart | 0.0.20 |
| python-dotenv | 1.0.1 |
| python-json-logger | >=3.0.0 |

### 5-3. 컨테이너 이미지/포트/엔드포인트 표

| 구분 | FROM 이미지 | EXPOSE | CMD/ENTRYPOINT |
|------|-------------|--------|----------------|
| miriart-be | eclipse-temurin:17-jdk-jammy (builder), 17-jre-jammy (runtime) | 8080 | java -jar /app.jar |
| miriart-ai | python:3.11-slim | 8080 | uvicorn app.main:app --host 0.0.0.0 --port 8080 |
| server | node:20-slim | 8080 | node dist/index.js |

| 서비스 | 기본 포트 | 비고 |
|--------|-----------|------|
| FE (Vite dev) | 5173 | application.yml oauth-success-url |
| BE (Spring) | 8080 | application.yml, Dockerfile |
| AI (uvicorn 로컬) | 8000 | application.yml fastapi internal-url |
| AI (Docker/Cloud Run) | 8080 | Dockerfile, cloudbuild --port=8080 |

| Cloud Run 배포 | 서비스 이름 | 이미지 |
|----------------|-------------|--------|
| AI | miriart-ai | asia-northeast3-docker.pkg.dev/miriarts/miriart-images/miriart-ai:$COMMIT_SHA |

---

## 6. 불일치·모호한 점

| # | 구분 | 내용 | 권장 |
|---|------|------|------|
| 1 | Python 버전 | 로컬 venv 3.13.12 vs 운영 Docker 3.11-slim. | SSOT에 "로컬 3.13 / 운영 3.11" 명시해 둠. 필요 시 통일 검토. |
| 2 | server/Dockerfile | 루트 Vite와 별도 앱(Express, dist/index.js). | 용도는 4-1절에 한 줄 코멘트로 명시함. |
| 3 | FE lock 버전 | 배포 재현성은 lock 기준. | 이 문서에 lock 버전 표기함. |
| 4 | Cloud Build | miriart-ai만 cloudbuild.yaml 있음. | BE/FE 배포 방식이 별도면 SSOT에 "배포 경로"만 명시. |
| 5 | AI 패키지 | google-cloud-aiplatform → google-genai로 마이그레이션됨. | SSOT §5-2 업데이트 완료(2026-03-15). |

---

## 7. 간단 코멘트

- **프론트엔드:** package-lock.json 존재, 주요 패키지 lock 버전 표 반영. engines node>=18, npm>=9 유지.
- **백엔드:** Gradle 9.2.1, Java 17, build2 출력. JAR 경로는 Dockerfile과 build.gradle 일치.
- **AI:** requirements.txt와 pip list 일치. 로컬 Python 3.13 vs 운영 3.11 SSOT에 명시.
- **server:** Express + Gemini 기반 Node API 서버. 운영 AI는 miriart-ai(FastAPI). server는 레거시/별도 옵션으로 정리해 둠.

---

## 8. AI 서비스 구조 정책 (v1)

- v1에서 **모든 프로덕션 AI 트래픽은 `miriart-ai` (FastAPI)만 사용**한다.
- `server/`(Node + Express + @google/genai)는 **레거시/실험용**으로만 유지하며, 프로덕션 엔드포인트에서는 호출하지 않는다.
- FE/BE에서 AI 기능을 호출할 때는, 원칙적으로 **miriart-be → miriart-ai** 경로를 따른다.

---

## 9. v1 기능 플로우 우선순위

v1에서 구현·검증할 기본 플로우 순서는 다음과 같다.

1. OAuth2 + JWT 로그인 (소셜 로그인, 토큰 발급/리프레시)
2. 작품 업로드 → AI 분석 결과 조회 (Spring → miriart-ai 체인)
3. AI 멘토링 채팅 (분석 결과 기반 Q&A)
4. 커뮤니티(피드/Q&A) 기능

위 순서를 v1의 기능 구현·테스트·배포 우선순위로 삼는다.  
**"로그인 없이 사용하는 게스트 플로우"는 v1 범위에 포함하지 않는다.**

---

— 끝 —
