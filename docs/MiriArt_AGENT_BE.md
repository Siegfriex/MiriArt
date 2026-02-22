# AGENT_BE.md — MiriArt Java BE 빌딩 에이전트 프롬프트

> **역할**: MiriArt `miriart-be/` 신규 Spring Boot 프로젝트 빌딩 전담 시니어 아키텍트
> **버전**: 1.0 | **작성일**: 2026-02-22

---

## 참고 기준

구현 시 아래 공식 문서 패턴을 우선 적용할 것:

- **코드 구조**: [Spring Boot — Structuring Your Code](https://docs.spring.io/spring-boot/reference/using/index.html)
- **전체 레퍼런스**: [Spring Boot Full Reference (3.x)](https://docs.spring.io/spring-boot/docs/3.2.1/reference/htmlsingle/)
- **글로벌 예외**: [Baeldung — Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
- **REST 에러 처리**: [Baeldung — REST API Error Handling Best Practices](https://www.baeldung.com/rest-api-error-handling-best-practices)
- **OAuth2 설정**: [Spring Security OAuth2 Login — Core Config](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/core.html)
- **OAuth2 튜토리얼**: [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- **Redis TTL**: [Spring Data Redis — TTL 설정](https://www.baeldung.com/spring-data-redis-ttl)
- **Redis 세션**: [Spring Session + Redis Boot Guide](https://docs.spring.vmware.com/spring-session/reference/guides/boot-redis.html)
- **JWT 토큰 보안**: [JWT Security Best Practices 2025](https://jwt.app/blog/jwt-best-practices)

---

## 컨텍스트

```
프로젝트명: MiriArt BE (com.miriart.api)
신규 프로젝트 경로: H:\n_0221\02_21dys\miriart-be\
Cariv BE 참조 경로: H:\n_0221\02_21dys\BE\seller\ (수정 없음, 패턴 복사만)

스택:
- Java 17, Spring Boot 3.4.x, Gradle
- Spring Security + OAuth2 Client (카카오 + 구글)
- Spring Data JPA + MySQL 8.x
- Spring Data Redis (TTL 세션, Refresh Token)
- WebFlux WebClient (FastAPI 내부 호출)
- springdoc-openapi (Swagger UI)
- Lombok

인증:
- 카카오 + 구글 OAuth2 only (이메일/비밀번호 없음)
- Access Token: response body, 만료 15분
- Refresh Token: httpOnly Secure Cookie (Path=/api/auth/refresh), 만료 7일

API 계약서: docs/02_21dys_API_CONTRACT.md
ERD: docs/02_21dys_ERD_v2.md
기능명세: docs/02_21dys_FSD_v2.md
세팅 가이드: docs/02_21dys_BE_SETUP_GUIDE.md

Cariv 재사용 전략: docs/Cariv→MiriArt 패턴 재사용 전략.md
  - global/ 패키지 (SecurityConfig, JwtUtil, GlobalExceptionHandler, BaseEntity,
    RedisConfig, ErrorCode, ErrorResponse, BusinessException): 85~95% 재사용
  - domain/auth/ (OAuth2TokenExchangeService, OAuth2LoginSuccessHandler): 70% 재사용 + Google provider 추가
  - 커뮤니티 도메인 (Post, Answer, Persona, ReputationLedger): 완전 신규
```

---

## Task 1: Cariv global/ 패키지 스캔 및 이식 diff

**작업 지시**:

1. `H:\n_0221\02_21dys\BE\seller\src\main\java\com\cariv\seller\global\` 디렉토리를 스캔하라.

2. 각 파일에 대해 다음 태그 중 하나를 부여하라:
   - `[COPY_AS_IS]`: package명만 바꾸면 되는 파일
   - `[MODIFY]`: 내용 수정이 필요한 파일 (구체적 diff 제시)
   - `[SKIP]`: Cariv 전용 로직으로 MiriArt에 불필요한 파일

3. `[MODIFY]` 태그 파일에 대해 구체적인 수정 내용을 diff 형식으로 제시하라:
   - `global/config/SecurityConfig.java`: 경로 규칙 + Google OAuth2 provider 추가 + JWT Filter 추가
   - `global/exception/ErrorCode.java`: MiriArt 신규 코드 추가 (AN001~003, CR001~002, AI001~002, CM001~007)

4. `JwtAuthenticationFilter.java` (Cariv 미구현 TODO): 신규 작성 코드를 제시하라.
   - `Authorization: Bearer {token}` 헤더 파싱
   - `JwtUtil.validateAccessToken()` 검증
   - `SecurityContextHolder` 세팅

---

## Task 2: domain/auth/ — 카카오 + 구글 이중 OAuth2 + Refresh Token Cookie

**작업 지시**:

다음 파일들을 `H:\n_0221\02_21dys\miriart-be\src\main\java\com\miriart\api\domain\auth\` 에 작성하라.

**2-1. `CustomOAuth2UserService.java`**
- Cariv의 카카오 전용 코드에서 Google provider 추가:
  ```java
  // registrationId 기반 분기
  if ("kakao".equals(registrationId)) { ... }
  else if ("google".equals(registrationId)) { ... }
  ```
- 카카오: `attributes.get("id")`, `kakaoAccount.profile.nickname`, `kakaoAccount.email`
- 구글: `sub`, `name`, `email`
- `User.findOrCreate(provider, providerUserId, email)` 호출
- `@placeholder.cariv.com` 이메일 패턴 제거

**2-2. `OAuth2LoginSuccessHandler.java`**
- 성공 시 Redis에 UUID code 저장 (TTL 60초):
  ```java
  redisService.saveOAuth2Code(uuid, OAuth2AuthCodePayload.toJson(memberId, email));
  ```
- `{FRONTEND_OAUTH_SUCCESS_URL}/auth/callback?code={uuid}` 로 리다이렉트

**2-3. `OAuth2TokenExchangeService.java`**
- `POST /api/auth/token { code }` 처리
- Redis에서 code 조회 + 삭제 (1회용)
- `JwtUtil.createAccessToken(userId)`, `createRefreshToken(userId)` 호출
- Refresh Token Redis 저장: `miriart:refresh:{userId}`, TTL 7일
- 응답: `{ accessToken, expiresIn, userId, needsProfile }` + `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/refresh; Max-Age=604800`

**2-4. `AuthController.java`**
- `POST /api/auth/token` — 코드 교환
- `POST /api/auth/refresh` — 쿠키에서 refreshToken 읽기 → 새 accessToken 발급
- `POST /api/auth/logout` — refreshToken 무효화 + 쿠키 제거

---

## Task 3: domain/analysis/ — 작품 업로드 + AI 분석 (FSD F3)

**작업 지시**:

`domain/analysis/` 패키지에 다음을 작성하라.

**3-1. `Analysis.java` (Entity)**
- ERD_v2 `analyses` 테이블 기반 (`docs/02_21dys_ERD_v2.md §2.4`)
- `BaseEntity` 상속
- `@Enumerated(EnumType.STRING)` for `AnalysisStatus`, `Grade`, `FixScope`
- `scores`, `universityPredictions`는 `@Column(columnDefinition = "JSON")` + `String` 타입 (Jackson 직렬화)

**3-2. `AnalysisService.java`**
```java
@Transactional
public AnalysisStartResponse startAnalysis(Long userId, MultipartFile image, String analysisType, String problemText) {
    // 1. 크레딧 카운트 체크 (analysis_usage_logs)
    long usedThisMonth = usageLogRepository.countByUserIdAndBillingYearMonth(userId, currentMonth());
    Plan plan = userRepository.findPlanByUserId(userId);
    if (usedThisMonth >= plan.getMonthlyLimit()) throw new BusinessException(ErrorCode.CR001);

    // 2. GCS 업로드
    String gcsUrl = fileStorageService.upload(image, FileCategory.ARTWORK);

    // 3. analyses INSERT (PENDING)
    Analysis analysis = analysisRepository.save(Analysis.create(userId, gcsUrl, analysisType, problemText));

    // 4. FastAPI WebClient 호출
    InternalAnalyzeResponse aiResult = aiProxyService.analyze(gcsUrl, analysisType, problemText);

    // 5. analyses UPDATE (COMPLETED)
    analysis.complete(aiResult);
    analysisRepository.save(analysis);

    // 6. usage_logs INSERT
    usageLogRepository.save(AnalysisUsageLog.create(userId, analysis.getId(), currentMonth()));

    return AnalysisStartResponse.from(analysis);
}
```

**3-3. `AnalysisController.java`**
- `POST /api/analyses` (`@AuthenticationPrincipal MiriartUserDetails`)
- `GET /api/analyses` (페이지네이션)
- `GET /api/analyses/{id}` (본인 소유 검증)

---

## Task 4: domain/ai/ — FastAPI WebClient 프록시 (FSD F4)

**작업 지시**:

**4-1. `AiProxyService.java`**
```java
@Service
@RequiredArgsConstructor
public class AiProxyService {
    private final WebClient fastapiWebClient;
    private final RedisService redisService;

    public ChatResponse chat(ChatRequest request) {
        // Redis 세션 로드
        String sessionJson = redisService.getChatSession(request.getSessionId());
        // ...컨텍스트 추가...

        InternalChatResponse response = fastapiWebClient.post()
                .uri("/internal/ai/chat")
                .bodyValue(internalRequest)
                .retrieve()
                .onStatus(status -> status.is5xxServerError(),
                    res -> Mono.error(new BusinessException(ErrorCode.AI001)))
                .bodyToMono(InternalChatResponse.class)
                .timeout(Duration.ofSeconds(30))
                .onErrorMap(TimeoutException.class, e -> new BusinessException(ErrorCode.AI002))
                .block();

        // Redis 세션 업데이트 (TTL 72h 리셋)
        redisService.updateChatSession(request.getSessionId(), updatedSession);

        return ChatResponse.from(response);
    }
}
```

**4-2. `AiChatController.java`**
- `POST /api/chat` — 채팅 메시지 처리

---

## Task 5: Community 도메인 뼈대 (Phase C)

**작업 지시**:

다음 Entity 뼈대를 `domain/community/entity/` 에 작성하라 (ERD_v2 §4 기반):

**5-1. `Post.java`**
```java
@Entity
@Table(name = "posts")
public class Post extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") private User user;
    @Enumerated(EnumType.STRING) private PostType type;   // FREE, QNA
    @Enumerated(EnumType.STRING) private PostStatus status; // OPEN, SOLVED, EXPIRED, CLOSED
    private String title;
    @Lob private String content;
    @Column(columnDefinition = "JSON") private String tags;
    @Column(columnDefinition = "JSON") private String imageUrls;
    private LocalDateTime deadlineAt;
    // ... PostStatus 전이 메서드 포함
}
```

**5-2. `PostStatus.java`** (Enum + 상태 전이 메서드, Cariv Order 패턴 참조)

**5-3. `Answer.java`**, **`Comment.java`**, **`Persona.java`**, **`ReputationLedger.java`** — ERD_v2 기반 뼈대만

> 비즈니스 로직은 Phase C1 구현 시 추가. 지금은 Entity + Repository만.

---

## 파일 경로 및 코딩 컨벤션

- **패키지**: `com.miriart.api.{domain/global}.{layer}`
- **레이어**: Controller → Service → Repository (직접 의존만 허용)
- **DTO**: `Request`, `Response` suffix. Controller에서만 사용. Service는 도메인 객체 처리.
- **예외**: `BusinessException(ErrorCode.XXX)` 사용. Controller에서 직접 try-catch 금지.
- **응답 래퍼**: `ApiResponse<T>.success(data)` / `ApiResponse.error(errorCode)`
- **트랜잭션**: Service 계층에 `@Transactional`. 읽기 전용은 `@Transactional(readOnly = true)`.
- **Lombok**: `@RequiredArgsConstructor` 생성자 주입. `@Slf4j` 로그.
- **주석 언어**: 한국어 (팀 컨벤션)
