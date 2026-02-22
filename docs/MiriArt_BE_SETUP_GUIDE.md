# MiriArt BE Setup Guide v1.0

> **목적**: `miriart-be/` 신규 Spring Boot 프로젝트 초기 세팅 + Cariv 패턴 이식 체크리스트
> **버전**: 1.0 | **작성일**: 2026-02-22
> **Cariv BE 참조 경로**: `H:\n_0221\02_21dys\BE\seller\` — 수정 없음, 패턴만 복사
> **신규 프로젝트 경로**: `H:\n_0221\02_21dys\miriart-be\`

---

## 참고 기준

- [Spring Boot — Structuring Your Code](https://docs.spring.io/spring-boot/reference/using/index.html) — 패키지 구조, Main 클래스 위치
- [Spring Boot Full Reference (3.x)](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/) — Security, JPA, Validation
- [Spring Security OAuth2 Login](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html) — 카카오+구글 Multi-Provider
- [Spring Boot and OAuth2 Tutorial](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- [Spring Data Redis TTL](https://www.baeldung.com/spring-data-redis-ttl) — Redis 세션 TTL 설계
- [Spring Session + Redis](https://docs.spring.vmware.com/spring-session/reference/guides/boot-redis.html)
- [JWT httpOnly Cookie Best Practices](https://jwt.app/blog/jwt-best-practices) — Access 15분, Refresh 7일

---

## 1. 프로젝트 초기화

### 1.1 Spring Initializr 설정

```
Group:      com.miriart
Artifact:   api
Name:       miriart-api
Package:    com.miriart.api
Java:       17
Build:      Gradle (Groovy)
Spring Boot: 3.4.x (latest stable)
```

**Dependencies 선택**:
- Spring Web
- Spring Security
- OAuth2 Client
- Spring Data JPA
- Spring Data Redis
- Spring Validation
- MySQL Driver
- Lombok
- Spring Boot DevTools (dev only)
- springdoc-openapi (수동 추가)

### 1.2 프로젝트 위치

```
H:\n_0221\02_21dys\
├── src/                  ← FE (기존 유지)
├── miriart-be/           ← Java BE (신규)
│   ├── src/
│   ├── build.gradle
│   └── ...
├── miriart-ai/           ← FastAPI (Phase 2, 스텁만)
└── docs/
```

---

## 2. `build.gradle` 전체 설정

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.4.2'
    id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.miriart'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Web
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'  // WebClient (FastAPI 호출)

    // Security & OAuth2
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'

    // Data
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    runtimeOnly 'com.mysql:mysql-connector-j'

    // Validation
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // JWT — 버전은 최신 jjwt 확인
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.6'

    // GCS (Google Cloud Storage)
    implementation 'com.google.cloud:spring-cloud-gcp-starter-storage:5.x.x'

    // Swagger UI
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.x.x'

    // Lombok
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // Test
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'

    // Dev
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

---

## 3. 패키지 구조

```
com.miriart.api/
├── MiriartApiApplication.java          ← @SpringBootApplication
│
├── global/                             ← Cariv global/ 그대로 복사 후 수정
│   ├── config/
│   │   ├── SecurityConfig.java         ← 수정 복사 (경로/Provider 추가)
│   │   ├── RedisConfig.java            ← 그대로 복사 (prefix만 변경)
│   │   ├── JpaConfig.java              ← 그대로 복사
│   │   ├── WebClientConfig.java        ← 그대로 복사 (FastAPI용)
│   │   └── CorsConfig.java             ← 수정 복사 (origin 변경)
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java ← 그대로 복사
│   │   ├── BusinessException.java      ← 그대로 복사
│   │   ├── ErrorCode.java              ← 수정 복사 (MiriArt 코드 추가)
│   │   └── ErrorResponse.java          ← 그대로 복사
│   ├── entity/
│   │   └── BaseEntity.java             ← 그대로 복사
│   ├── response/
│   │   └── ApiResponse.java            ← 그대로 복사 (없으면 신규 작성)
│   ├── security/
│   │   ├── JwtUtil.java                ← 그대로 복사
│   │   ├── JwtProperties.java          ← 그대로 복사
│   │   └── JwtAuthenticationFilter.java ← 신규 작성 (Cariv에 미구현)
│   └── redis/
│       └── RedisService.java           ← 그대로 복사 (prefix 변경)
│
└── domain/
    ├── auth/                           ← Cariv auth/ 70% 재사용
    │   ├── controller/
    │   │   └── AuthController.java
    │   ├── service/
    │   │   ├── OAuth2TokenExchangeService.java
    │   │   └── OAuth2AuthCodeService.java
    │   ├── oauth2/
    │   │   ├── CustomOAuth2UserService.java  ← 카카오+구글 이중 provider
    │   │   ├── OAuth2LoginSuccessHandler.java
    │   │   └── OAuth2AuthCodePayload.java
    │   └── dto/
    │       ├── OAuth2TokenExchangeRequestDto.java
    │       └── OAuth2TokenExchangeResponseDto.java
    │
    ├── user/                           ← 신규 (Cariv Member 참조 변형)
    │   ├── controller/UserController.java
    │   ├── service/UserService.java
    │   ├── entity/User.java
    │   ├── repository/UserRepository.java
    │   └── dto/
    │
    ├── analysis/                       ← 신규 (Legacy FSD F3 기반)
    │   ├── controller/AnalysisController.java
    │   ├── service/AnalysisService.java
    │   ├── entity/Analysis.java
    │   ├── repository/AnalysisRepository.java
    │   ├── repository/AnalysisUsageLogRepository.java
    │   └── dto/
    │
    ├── ai/                             ← 신규 (FastAPI WebClient 프록시)
    │   ├── controller/AiChatController.java
    │   ├── service/AiProxyService.java
    │   └── dto/
    │
    ├── storage/                        ← Cariv FileStorageService 패턴 재사용
    │   ├── FileStorageService.java     ← 인터페이스
    │   ├── GcsFileStorageService.java  ← GCS 구현체 (Cariv NoOp 교체)
    │   └── FileCategory.java
    │
    └── community/                      ← 신규 (Phase C, 뼈대만)
        ├── controller/
        ├── service/
        ├── entity/
        └── dto/
```

---

## 4. Cariv → MiriArt 파일 이식 체크리스트

### 4.1 그대로 복사 (도메인 비종속)

| 파일 | 변경 사항 |
|------|-----------|
| `global/exception/GlobalExceptionHandler.java` | package명만 변경 (`com.cariv.seller` → `com.miriart.api`) |
| `global/exception/BusinessException.java` | package명만 변경 |
| `global/exception/ErrorResponse.java` | package명만 변경 |
| `global/entity/BaseEntity.java` | package명만 변경 |
| `global/config/JpaConfig.java` | package명만 변경 |
| `global/config/WebClientConfig.java` | package명만 변경 |
| `global/security/JwtUtil.java` | package명만 변경 |
| `global/security/JwtProperties.java` | package명만 변경 |
| `global/redis/RedisService.java` | package명 변경 + key prefix `cariv:` → `miriart:` |

### 4.2 수정 복사

| 파일 | 수정 내용 |
|------|-----------|
| `global/config/SecurityConfig.java` | ① 경로 규칙 재정의 (아래 참조) ② Google OAuth provider 추가 ③ JWT 필터 추가 |
| `global/config/RedisConfig.java` | Redis host/port 환경변수명 변경 |
| `global/exception/ErrorCode.java` | MiriArt 신규 코드 추가: `AN001~003`, `CR001~002`, `AI001~002`, `CM001~007` |
| `domain/auth/oauth2/CustomOAuth2UserService.java` | 카카오 전용 → 카카오+구글 분기 추가. `@placeholder.cariv.com` 제거 |
| `domain/auth/service/OAuth2LoginSuccessHandler.java` | 리다이렉트 URL → `FRONTEND_OAUTH_SUCCESS_URL` env var |

**SecurityConfig filterChain 경로 규칙**:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            // Public
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()   // C2: 읽기 공개
            .requestMatchers(HttpMethod.GET, "/api/answers/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .requestMatchers("/actuator/health").permitAll()
            // Internal (FastAPI → BE, 서비스 계정 토큰으로 분리)
            // .requestMatchers("/internal/**").hasRole("INTERNAL_SERVICE")
            // Authenticated
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(ui -> ui.userService(customOAuth2UserService))
            .successHandler(oAuth2LoginSuccessHandler)
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

### 4.3 신규 작성 (Cariv에 없음)

| 파일 | 기반 |
|------|------|
| `global/security/JwtAuthenticationFilter.java` | Cariv 30일 TODO였던 미구현 필터 |
| `global/response/ApiResponse.java` | Cariv 패턴 참조 신규 작성 |
| `domain/user/entity/User.java` | ERD_v2 `users` 테이블 기반 |
| `domain/analysis/entity/Analysis.java` | ERD_v2 `analyses` 테이블 기반 |
| `domain/analysis/service/AnalysisService.java` | FSD_v2 F3 로직 |
| `domain/ai/service/AiProxyService.java` | WebClient로 FastAPI 호출 |
| `domain/storage/GcsFileStorageService.java` | Cariv `FileStorageService` 인터페이스 구현 |
| `domain/community/entity/Post.java` | ERD_v2 Community 테이블 기반 (Phase C) |

---

## 5. `application.yml` 설정

### 5.1 `application.yml` (공통)

```yaml
spring:
  profiles:
    active: dev
  application:
    name: miriart-api
  jpa:
    open-in-view: false
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher

server:
  port: 8080

miriart:
  frontend:
    oauth-success-url: ${FRONTEND_OAUTH_SUCCESS_URL:http://localhost:5173}
  fastapi:
    internal-url: ${FASTAPI_INTERNAL_URL:http://localhost:8000}
  jwt:
    access-expiration-ms: 900000        # 15분
    refresh-expiration-ms: 604800000    # 7일
```

### 5.2 `application-dev.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/miriart_dev?useSSL=false&characterEncoding=UTF-8&serverTimezone=Asia/Seoul
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update     # 개발: 자동 스키마 갱신
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  data:
    redis:
      host: localhost
      port: 6379
  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: ${KAKAO_CLIENT_ID:dev-kakao-id}
            client-secret: ${KAKAO_CLIENT_SECRET:dev-kakao-secret}
            client-authentication-method: client_secret_post
            authorization-grant-type: authorization_code
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope: profile_nickname, account_email
          google:
            client-id: ${GOOGLE_CLIENT_ID:dev-google-id}
            client-secret: ${GOOGLE_CLIENT_SECRET:dev-google-secret}
            scope: email, profile
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id

miriart:
  jwt:
    secret:
      access: ${JWT_ACCESS_SECRET:devAccessSecretBase64EncodedMiriArtDev32}
      refresh: ${JWT_REFRESH_SECRET:devRefreshSecretBase64EncodedMiriArtDev32}

logging:
  level:
    com.miriart.api: DEBUG
    org.springframework.security: DEBUG
```

### 5.3 `application-prod.yml`

```yaml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate     # 운영: Flyway가 스키마 관리
  data:
    redis:
      host: ${REDIS_HOST}
      port: ${REDIS_PORT:6379}
  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: ${KAKAO_CLIENT_ID}
            client-secret: ${KAKAO_CLIENT_SECRET}
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}

miriart:
  jwt:
    secret:
      access: ${JWT_ACCESS_SECRET}
      refresh: ${JWT_REFRESH_SECRET}
  gcs:
    bucket: ${GCS_BUCKET_NAME}

logging:
  level:
    com.miriart.api: INFO
```

---

## 6. 환경변수 목록

| 변수명 | 예시 | 필수 | 설명 |
|--------|------|------|------|
| `DB_URL` | `jdbc:mysql://...` | 운영 | MySQL JDBC URL |
| `DB_USERNAME` | `miriart` | 운영 | DB 사용자명 |
| `DB_PASSWORD` | `...` | 운영 | DB 비밀번호 |
| `REDIS_HOST` | `redis.internal` | 운영 | Redis 호스트 |
| `REDIS_PORT` | `6379` | 선택 | Redis 포트 |
| `KAKAO_CLIENT_ID` | `abc123` | 필수 | 카카오 OAuth2 클라이언트 ID |
| `KAKAO_CLIENT_SECRET` | `...` | 필수 | 카카오 OAuth2 시크릿 |
| `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` | 필수 | 구글 OAuth2 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | `...` | 필수 | 구글 OAuth2 시크릿 |
| `JWT_ACCESS_SECRET` | Base64 인코딩된 32자 이상 문자열 | 필수 | Access Token 서명 키 |
| `JWT_REFRESH_SECRET` | Base64 인코딩된 32자 이상 문자열 | 필수 | Refresh Token 서명 키 |
| `FRONTEND_OAUTH_SUCCESS_URL` | `https://app.miriart.com` | 필수 | OAuth2 성공 후 FE 리다이렉트 기본 URL |
| `FASTAPI_INTERNAL_URL` | `https://miriart-ai-...run.app` | 필수 | FastAPI Cloud Run URL |
| `GCS_BUCKET_NAME` | `miriart-bucket` | 필수 | GCS 버킷 이름 |

---

## 7. Redis 설정 (`RedisConfig.java`)

Cariv `RedisConfig.java` 그대로 복사 후 아래만 변경:

```java
// key prefix를 miriart: 로 통일
// Cariv: "cariv:" → MiriArt: "miriart:"
// RedisService.java에서 모든 key prefix 변경
```

**Redis key prefix 규칙 (`RedisService.java`)**:
```java
private static final String PREFIX = "miriart:";

public void saveOAuth2Code(String code, String payload) {
    redisTemplate.opsForValue().set(PREFIX + "oauth2:code:" + code, payload, 60, TimeUnit.SECONDS);
}

public void saveRefreshToken(Long userId, String token) {
    redisTemplate.opsForValue().set(PREFIX + "refresh:" + userId, token, 7, TimeUnit.DAYS);
}

public void saveChatSession(String sessionId, String data) {
    redisTemplate.opsForValue().set(PREFIX + "chat:session:" + sessionId, data, 72, TimeUnit.HOURS);
}
```

---

## 8. GCS 파일 스토리지 설정

### 8.1 `build.gradle` 의존성

```groovy
// GCS
implementation platform('com.google.cloud:spring-cloud-gcp-dependencies:5.x.x')
implementation 'com.google.cloud:spring-cloud-gcp-starter-storage'
```

### 8.2 `FileStorageService` 인터페이스 (Cariv 그대로)

```java
public interface FileStorageService {
    String upload(MultipartFile file, FileCategory category) throws IOException;
    void delete(String fileUrl);
}
```

### 8.3 `GcsFileStorageService` 구현체 (신규)

```java
@Service
@RequiredArgsConstructor
public class GcsFileStorageService implements FileStorageService {

    private final Storage storage;

    @Value("${miriart.gcs.bucket}")
    private String bucketName;

    @Override
    public String upload(MultipartFile file, FileCategory category) throws IOException {
        String objectName = category.getPathPrefix() + "/" +
                            LocalDate.now() + "/" +
                            UUID.randomUUID() + "_" + file.getOriginalFilename();
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, objectName)
                .setContentType(file.getContentType())
                .build();
        storage.create(blobInfo, file.getBytes());
        return "https://storage.googleapis.com/" + bucketName + "/" + objectName;
    }
}
```

### 8.4 `FileCategory` Enum

```java
public enum FileCategory {
    ARTWORK("artworks"),
    COMMUNITY("community"),
    PROFILE("profiles");

    private final String pathPrefix;
    // constructor, getter
}
```

---

## 9. FastAPI WebClient 설정

```java
@Configuration
public class WebClientConfig {

    @Value("${miriart.fastapi.internal-url}")
    private String fastapiInternalUrl;

    @Bean
    public WebClient fastapiWebClient() {
        return WebClient.builder()
                .baseUrl(fastapiInternalUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024)) // 10MB
                .build();
    }
}
```

---

## 10. Flyway 전환 가이드 (staging/prod 적용 시)

### 10.1 `build.gradle` 추가

```groovy
implementation 'org.flywaydb:flyway-mysql'
```

### 10.2 마이그레이션 파일 위치

```
src/main/resources/db/migration/
├── V1__create_users_plans.sql
├── V2__create_analyses.sql
├── V3__create_analysis_usage_logs.sql
└── V4__create_community_tables.sql  (Phase C)
```

### 10.3 `application-prod.yml` 설정

```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: false
  jpa:
    hibernate:
      ddl-auto: validate
```

**전환 순서**:
1. `dev` 환경에서 `ddl-auto: update`로 스키마 확정
2. 확정된 스키마를 `V1__init.sql`로 export
3. `staging` 환경에 Flyway 적용 → 검증
4. `prod` 배포 시 Flyway로 마이그레이션

---

## 11. `miriart-ai/` 스텁 생성 (FastAPI Phase 2 준비)

```
H:\n_0221\02_21dys\miriart-ai\
├── README.md              ← "FastAPI AI Service - Phase 2 예정"
├── requirements.txt       ← 버전 고정 예시 (비활성)
└── app/
    └── placeholder.txt    ← "AI 서비스는 Phase 2에서 구현됩니다"
```

실제 FastAPI 구현은 `AGENT_AI.md` 에이전트 프롬프트 참조.

---

## 12. 로컬 개발 실행 순서

```bash
# 1. MySQL 시작 (Docker 권장)
docker run -d --name miriart-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=miriart_dev \
  -p 3306:3306 mysql:8.0

# 2. Redis 시작
docker run -d --name miriart-redis -p 6379:6379 redis:7

# 3. FE 시작 (기존)
cd H:\n_0221\02_21dys
npm run dev   # http://localhost:5173

# 4. BE 시작
cd H:\n_0221\02_21dys\miriart-be
./gradlew bootRun --args='--spring.profiles.active=dev'
# → http://localhost:8080

# Swagger UI: http://localhost:8080/swagger-ui/index.html
```

---

## Document Metadata

| 항목 | 값 |
|------|-----|
| Version | 1.0 |
| Date | 2026-02-22 |
| Based on | Cariv BE `build.gradle`, `SecurityConfig`, `RedisConfig`, `JwtUtil` 패턴 |
| Cariv 재사용률 | global/ ~85%, auth/ ~70%, 나머지 신규 |
