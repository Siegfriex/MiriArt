# Cariv Java/Spring → MiriArt 패턴 최대 활용 전략

## 핵심 원칙

Cariv Seller Backend는 Spring Boot 3.4 + JPA + MySQL + Redis 기반 모듈러 모놀리스로 평가되었으며, SecurityConfig, OAuth2 카카오, JWT, GlobalExceptionHandler, BaseEntity/Audit, Redis 캐시 등 **프로젝트에 종속되지 않는 "글로벌 패턴"**이 상당수 존재한다. 이를 MiriArt 신규 프로젝트에 재사용하는 핵심 전략은 **"글로벌 패턴은 라이브러리화, 도메인 패턴은 선별 복사, 신규 도메인은 뼈대만 참조"**로 요약된다.[^1][^2][^3]

***

## 1단계: 글로벌(Global) 패턴 — 그대로 추출·재사용

Cariv의 `global/` 패키지 구조에 해당하는 크로스컷팅 관심사는 도메인에 종속되지 않으므로, 거의 그대로 MiriArt에 가져올 수 있다.[^3]

### 1-1. SecurityConfig + OAuth2 + JWT 필터

| Cariv 원본 | MiriArt 재사용 방법 | 변경 포인트 |
|---|---|---|
| `SecurityConfig.java` (OAuth2 카카오 + JWT) | 그대로 복사 → `filterChain()` 내부 path 규칙만 수정 | `/api/community/**`, `/api/posts/**` 등 신규 경로 추가 |
| `JwtTokenProvider` / `JwtAuthenticationFilter` | 거의 100% 재사용 | 토큰 클레임에 `persona_id`, `reputation_level` 추가 고려 |
| `OAuth2UserService` (카카오 콜백) | 그대로 복사 → Google OAuth 추가 | 카카오 + Google 이중 provider 설정 |
| Redis 기반 refresh 토큰 저장 | 구조 그대로, key prefix만 `miriart:` 로 변경 | — |

Spring Security의 OAuth2/JWT 패턴은 프레임워크 레벨 설정이므로 도메인 비종속적이며, Cariv에서 검증된 구조를 그대로 가져오는 것이 가장 효율적이다.[^4][^5]

**실행 방법:**
```
// MiriArt 프로젝트에 SecurityConfig 복사 후
@Bean
SecurityFilterChain filterChain(HttpSecurity http) {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/posts/**").authenticated()  // 커뮤니티 신규 경로
        .requestMatchers("/api/ai/**").authenticated()
        .anyRequest().authenticated()
    )
    .oauth2Login(oauth2 -> oauth2
        .userInfoEndpoint(ui -> ui.userService(customOAuth2UserService))
    )
    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

### 1-2. GlobalExceptionHandler

Cariv의 `@RestControllerAdvice` 기반 전역 예외 처리기는 **100% 재사용 가능**하다.[^6][^7][^3]

| 패턴 | 재사용 수준 | MiriArt 추가분 |
|---|---|---|
| `GlobalExceptionHandler` + ErrorCode enum | 100% 복사 | 커뮤니티 전용 에러코드 추가 (`POST_NOT_FOUND`, `ALREADY_ACCEPTED`, `REPUTATION_INSUFFICIENT`) |
| `ApiResponse<T>` 공통 응답 래퍼 | 100% 복사 | 그대로 |
| `BusinessException` 도메인 예외 베이스 | 100% 복사 | `CommunityException extends BusinessException` 추가 |

### 1-3. BaseEntity / Audit 패턴

Cariv의 `@MappedSuperclass` 기반 BaseEntity(id, createdAt, updatedAt)는 MiriArt의 **모든 신규 엔티티**에 그대로 적용된다.[^8][^9][^10]

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

// MiriArt 커뮤니티 엔티티가 이를 상속
@Entity
public class Post extends BaseEntity { ... }

@Entity
public class Answer extends BaseEntity { ... }
```

### 1-4. Redis 설정 및 캐시 추상화

| Cariv 원본 | MiriArt 활용 |
|---|---|
| `RedisConfig.java` (connection, serializer) | 100% 복사 |
| Redis 토큰 저장 로직 | 복사 + 커뮤니티 인기글 캐시 추가 |
| `@Cacheable` 패턴 (있다면) | 인기 게시글, 평판 랭킹에 적용 |

***

## 2단계: 아키텍처 패턴 — 뼈대 복사 + 도메인 교체

### 2-1. 패키지 구조 매핑

Cariv의 "도메인별 패키지" 구조를 MiriArt에 그대로 적용하되, 도메인명만 교체한다.[^11][^3]

```
com.miriart/
├── global/                    ← Cariv global/ 거의 그대로
│   ├── config/                  (SecurityConfig, RedisConfig, WebConfig, CorsConfig)
│   ├── exception/               (GlobalExceptionHandler, BusinessException, ErrorCode)
│   ├── entity/                  (BaseEntity, BaseTimeEntity)
│   ├── response/                (ApiResponse<T>)
│   └── util/                    (JwtTokenProvider, ...)
│
├── domain/
│   ├── auth/                  ← Cariv auth/ 패턴 복사 + Google 추가
│   │   ├── controller/
│   │   ├── service/
│   │   ├── entity/ (Member)
│   │   └── repository/
│   │
│   ├── community/             ← 완전 신규 (MIRIART_HOME_COMMUNITY_DESIGN_v1 기반)
│   │   ├── controller/          (PostController, AnswerController, CommentController)
│   │   ├── service/             (PostService, AnswerService, ReputationService)
│   │   ├── entity/              (Post, Answer, Comment, Persona, ReputationLedger)
│   │   ├── repository/
│   │   └── dto/
│   │
│   ├── ai/                    ← FastAPI 프록시 호출 레이어
│   │   ├── controller/          (AiProxyController)
│   │   ├── service/             (AiProxyService — WebClient로 FastAPI 호출)
│   │   └── dto/
│   │
│   └── storage/               ← GCS 파일 저장
│       ├── controller/
│       ├── service/             (FileStorageService — Cariv의 인터페이스 분리 패턴 재사용)
│       └── dto/
```

### 2-2. Controller → Service → Repository 레이어 컨벤션

Cariv에서 확립된 레이어링 규칙을 **그대로 MiriArt 커뮤니티 도메인에 적용**한다:[^3]

```java
// Cariv 패턴: Controller는 Service만 호출, Service는 Repository만 호출
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    
    @PostMapping
    public ApiResponse<PostResponse> create(
        @AuthenticationPrincipal MemberDetails member,
        @RequestBody @Valid CreatePostRequest request) {
        return ApiResponse.success(postService.create(member.getId(), request));
    }
}
```

이 패턴은 Cariv의 Seller/Product 컨트롤러와 **1:1 대칭**이므로, 기존 컨트롤러를 열어놓고 도메인명만 바꿔가며 작성할 수 있다.

***

## 3단계: 도메인 패턴 — 선별적 참조·변형

### 3-1. Cariv 도메인 → MiriArt 커뮤니티 매핑

| Cariv 도메인 패턴 | MiriArt 활용 방식 | 변형 수준 |
|---|---|---|
| `Seller` 엔티티 (회원 정보) | `Member` 엔티티로 참조 → 소셜 로그인 기반으로 단순화 | 50% 변형 |
| `Product` CRUD (Controller→Service→Repo) | `Post` CRUD에 그대로 적용 | 20% 변형 (필드만 다름) |
| `Order` 상태 전이 (PENDING→CONFIRMED→...) | `Post` 상태 전이 (OPEN→SOLVED→EXPIRED) + `Answer` 채택 | 40% 변형 |
| `FileStorageService` 인터페이스 분리 | GCS 구현체로 교체, 인터페이스 100% 재사용 | 10% 변형 |
| WebClient 외부 API 호출 | AI FastAPI 호출에 동일 패턴 (+ Resilience4j 추가 권장) | 30% 변형 |

### 3-2. 상태 전이 패턴 재활용 예시

Cariv에서 주문 상태를 enum + 검증 로직으로 관리했다면, 커뮤니티 Q&A에도 같은 패턴을 적용한다:

```java
public enum PostStatus {
    OPEN, SOLVED, EXPIRED, CLOSED;
    
    public boolean canAcceptAnswer() {
        return this == OPEN;
    }
    
    public PostStatus accept() {
        if (!canAcceptAnswer()) throw new BusinessException(ErrorCode.INVALID_POST_STATUS);
        return SOLVED;
    }
}
```

***

## 4단계: 신규 도메인 (커뮤니티 전용) — Cariv 뼈대 위에 신규 구축

커뮤니티 디자인 문서에서 정의된 **Post, Answer, Comment, Persona, ReputationLedger** 5개 엔티티는 Cariv에 없으므로 신규 작성하되, 위에서 추출한 BaseEntity/레이어링/예외처리 패턴 위에 올린다.

### 4-1. 평판(Reputation) 시스템 — 이벤트 기반 패턴 적용

Spring의 ApplicationEvent를 활용하면 모듈 간 결합도를 낮출 수 있다:[^12][^11]

```java
// 답변 채택 시 이벤트 발행
@Service
public class AnswerService {
    private final ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public void acceptAnswer(Long postId, Long answerId, Long memberId) {
        // ... 채택 로직
        eventPublisher.publishEvent(new AnswerAcceptedEvent(answerId, answer.getAuthorId()));
    }
}

// 이벤트 리스너에서 포인트 적립 (모듈 분리)
@Component
public class ReputationEventListener {
    @TransactionalEventListener
    public void onAnswerAccepted(AnswerAcceptedEvent event) {
        reputationService.addPoints(event.getAuthorId(), 15, "ANSWER_ACCEPTED");
    }
}
```

이 방식은 Cariv에는 아직 없지만, Spring Modulith에서 권장하는 모듈 간 통신 패턴이며, 커뮤니티 확장 시 알림/통계 모듈 분리에 유리하다.[^12]

### 4-2. Persona(가명) 시스템

```java
@Entity
public class Persona extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    
    private String displayName;   // 자동 생성 가명
    private String domainTag;     // 디자인/회화/조소 등
    private Integer reputationScore;
    private String badgeLevel;    // Lv.1~12
}
```

***

## 5단계: 실전 파일 복사 체크리스트

아래는 Cariv 리포에서 MiriArt 신규 프로젝트로 **파일 단위 복사**할 때의 가이드다:[^1]

### 🟢 그대로 복사 (도메인 비종속)

| 파일/패키지 | 변경 사항 |
|---|---|
| `global/config/SecurityConfig.java` | OAuth provider에 Google 추가, path 규칙 수정 |
| `global/config/RedisConfig.java` | key prefix만 변경 |
| `global/config/CorsConfig.java` | 허용 origin 변경 |
| `global/exception/GlobalExceptionHandler.java` | 그대로 |
| `global/exception/BusinessException.java` | 그대로 |
| `global/exception/ErrorCode.java` | 커뮤니티 에러코드 enum 값 추가 |
| `global/response/ApiResponse.java` | 그대로 |
| `global/entity/BaseEntity.java` | 그대로 |
| `global/util/JwtTokenProvider.java` | 클레임 필드 추가 가능 |
| `global/util/JwtAuthenticationFilter.java` | 그대로 |
| `build.gradle` / `application.yml` 뼈대 | DB/Redis 접속 정보만 변경 |

### 🟡 구조만 참조 (도메인 교체 필요)

| Cariv 원본 | MiriArt 대응 | 참조 수준 |
|---|---|---|
| `domain/auth/` (OAuth 콜백, 회원가입) | `domain/auth/` (카카오+구글, 1.5-step 가입) | 70% 재사용 |
| `domain/seller/` CRUD 컨트롤러 | `domain/community/` Post CRUD | 구조만 참조, 필드 전부 변경 |
| `domain/product/` 상태 관리 | `domain/community/` Q&A 상태 전이 | 패턴만 참조 |
| `FileStorageService` 인터페이스 | GCS 구현체로 교체 | 인터페이스 100%, 구현 교체 |

### 🔴 신규 작성 (Cariv에 없음)

| 대상 | 설명 |
|---|---|
| `domain/community/entity/Post.java` | 게시글 (free/qna 타입 구분) |
| `domain/community/entity/Answer.java` | Q&A 답변 (채택 여부) |
| `domain/community/entity/Comment.java` | 댓글 |
| `domain/community/entity/Persona.java` | 가명 시스템 |
| `domain/community/entity/ReputationLedger.java` | 평판 포인트 이력 |
| `domain/community/service/ReputationService.java` | 포인트 적립/차감 로직 |
| `domain/ai/service/AiProxyService.java` | FastAPI 호출 (WebClient 패턴은 Cariv 참조) |

***

## 6단계: Gradle 멀티모듈 vs 단일 프로젝트 판단

| 선택지 | 장점 | 단점 | MiriArt 판단 |
|---|---|---|---|
| **단일 프로젝트 (권장)** | 빌드 단순, 개발 속도 ↑, Cariv 패턴 직접 복사 가능 | 모듈 간 경계 약함 | ✅ MVP 단계에 적합 |
| Gradle 멀티모듈 | 모듈 격리, 빌드 캐시 | 설정 복잡, 1인 개발에 오버헤드 | Phase 2 이후 검토 |
| Common Library JAR | 여러 프로젝트 재사용 | 버전 관리 부담, 변경 시 재빌드 | 2개 이상 프로젝트 운영 시[^13][^14] |

**MVP 권장**: 단일 프로젝트 + 패키지 레벨 모듈 분리 (`global/`, `domain/auth/`, `domain/community/`, `domain/ai/`, `domain/storage/`). Spring Modulith의 구조 검증을 추가하면 향후 멀티모듈 전환도 용이하다.[^15][^11]

***

## 7단계: IDE 에이전트 프롬프트 (실행용)

기존에 설계했던 "해체→재조립" 프롬프트를 MiriArt 커뮤니티 도메인에 특화하면:[^1]

```
당신은 MiriArt 백엔드 프로젝트의 시니어 아키텍트입니다.

[컨텍스트]
- Cariv Seller Backend(Java/Spring Boot 3.4)의 global/ 패턴을 MiriArt에 이식하는 중입니다
- 복사 대상: SecurityConfig, GlobalExceptionHandler, BaseEntity, RedisConfig, 
  JwtTokenProvider, JwtAuthenticationFilter, ApiResponse, ErrorCode, CorsConfig
- 신규 도메인: community (Post, Answer, Comment, Persona, ReputationLedger)
- 아키텍처: 단일 프로젝트, 도메인별 패키지, Controller→Service→Repository 레이어

[작업]
1. Cariv의 ./be/ 디렉토리에서 위 글로벌 패턴 파일들을 스캔하여,
   하드코딩된 Cariv/Seller 관련 참조(URL, 브랜드명, 도메인 엔티티)를 식별해 주세요.
2. 각 파일에 대해 "그대로 복사 / 일부 수정 / 참조만" 태그를 붙이고,
   수정이 필요한 경우 구체적인 diff를 제시해 주세요.
3. community 도메인의 Post 엔티티를 Cariv의 Product 엔티티 패턴을 참조하여 생성하되,
   BaseEntity 상속, PostStatus enum, PostType enum(FREE/QNA)을 포함해 주세요.
4. PostController + PostService 뼈대를 Cariv의 Controller→Service 패턴 그대로 작성해 주세요.
```

***

## 재사용률 요약

| 카테고리 | 재사용률 | 설명 |
|---|---|---|
| 글로벌 인프라 (Security, Exception, Base, Redis, Response) | **85-95%** | 도메인명/경로만 수정 |
| Auth 도메인 (OAuth + JWT) | **70-80%** | Google provider 추가, 1.5-step 가입으로 단순화 |
| CRUD 레이어링 패턴 | **60-70%** | 구조 동일, 필드/로직 교체 |
| 상태 전이 / 비즈니스 로직 | **30-40%** | 패턴만 참조, 구현은 신규 |
| 커뮤니티 전용 (평판, 가명, AI 연결) | **0%** | 완전 신규, 다만 위 뼈대 위에 구축 |

**종합 재사용률: 약 50-60%** — 이는 "빈 프로젝트에서 시작"과 비교했을 때 MVP 1차 개발 기간을 절반 가까이 단축할 수 있는 수준이다. 특히 Security/Auth/Exception 처리를 처음부터 구축하는 비용(보통 1-2주)을 사실상 0으로 줄일 수 있다.[^3]

---

## References

1. [그래. 이를 로컬 IDE 에이전트에게 넣을건데, 이를 위한 에이전트 프롬프트 제시해봐](https://www.perplexity.ai/search/13bf8b52-80b0-435e-a1f6-ec99faa942b3) - 로컬 IDE 에이전트를 “백엔드 해체·재조립 전담 시니어”로 쓰고 싶다면, 아래처럼 프롬프트를 주면 된다.  
(자바/Spring 기준이지만, 대부분 스택에 그대로 적용 가능하게 ...

2. [자바 등 - BE/내 백앤드를 스택 -> 프레임워크 -> API 명세 및 문서등 -> 로직 등등 모두 세세하게 해부하고 이를 다시 다른 프로젝트에 리빌딩 및 디벨롭 / 변형하여 사용하고 싶은데 -- 특정 사용자 계정이 아닌 범용으로 -- 이러한 니즈에 따라서 본다면 해체 방법론이 있나?](https://www.perplexity.ai/search/fb1531a4-9907-4c37-8016-040ceea3375c) - 가능하다. 그리고 이미 하고 있는 SSOT/사인업 분석이 딱 그 “해체 → 재조립” 방법론의 좋은 예다.
아래처럼 틀을 잡아두면, 자바/Spring 백엔드든 다른 스택이든 범용으로...

3. [# Cariv Seller Backend 코드베이스 역량평가 보고서

---

## 한 줄 결론

**미들~시니어 초급 / 추정 연차 3~6년 / 현재 역량 백분위 55~65 / 잠재력 백분위 65~75**

---

## 1) 코드베이스 빠른 개요 (Onboarding Summary)

### 아키텍처 한 문단

**모듈러 모놀리스** 형태의 **동기 REST API** 서버다. Spring Boot 3.4 + JPA + MySQL + Red...

...7) 개선 로드맵

### 30일

1. 핵심 서비스 단위 테스트 5~10개 추가  
2. deploy 워크플로에 `./gradlew test` 단계 추가  
3. JWT 검증을 Security 필터로 통합

### 90일

1. Flyway 도입 및 `ddl-auto: validate` 전환  
2. WebClient에 Retry 또는 Resilience4j 적용  
3. 요청 ID/상관 ID 로깅 및 기본 메트릭 수집

그렇다는데? 설명해봐](https://www.perplexity.ai/search/0a04efe9-aca0-45b0-be26-373696920ef7) - 이 보고서는, 내가 앞에서 준 “루브릭 기반 역량 평가 프롬프트”를 Cariv Seller Backend 코드베이스에 실제로 적용한 결과물이라고 보면 된다.  
각 섹션이 무엇을 ...

4. [Overriding or Replacing Boot...](https://docs.spring.io/spring-security/reference/reactive/oauth2/resource-server/jwt.html)

5. [OAuth 2.0 Resource Server JWT :: Spring Security](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)

6. [Global Exception Handling in Spring Boot with @RestControllerAdvice and @ExceptionHandler](https://josealopez.dev/en/blog/spring-boot-global-exception-handling) - Learn how to handle global exceptions in Spring Boot using @RestControllerAdvice and @ExceptionHandl...

7. [[Spring Boot] GlobalExceptionHandler 예외 처리 - seulll](https://seulow-down.tistory.com/340) - Global Exception이란?Global Exception(전역 예외 처리)이란, 애플리케이션 전반에서 발생하는 예외를 한 곳에서 통합적으로 처리할 수 있는 방식입니다.일반적...

8. [Spring JPA Data Auditing - How to design it?](https://stackoverflow.com/questions/78250782/spring-jpa-data-auditing-how-to-design-it) - How can I design entity auditing in a Spring Boot application? @Getter @Setter @Entity @AllArgsConst...

9. [Spring Data JPA Auditing: Tracking Entity Changes - Codevup](https://codevup.com/posts/spring-jpa-auditing/) - How to use Spring Data JPA's auditing features to track and record changes to database entities

10. [Auditing :: Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/auditing.html) - Spring Data provides sophisticated support to transparently keep track of who created or changed an ...

11. [Building Modular Monoliths using Spring Modulith](https://www.youtube.com/watch?v=LOrTLDpVbAA) - In this session, we'll explore how to build Modular Monoliths using Spring Boot and Spring Modulith,...

12. [Building Modular Monolith Applications with Spring Boot and Domain Driven Design](https://www.reddit.com/r/java/comments/18f07w8/building_modular_monolith_applications_with/) - Building Modular Monolith Applications with Spring Boot and Domain Driven Design

13. [How to reuse code/functionality from multiple Spring Boot applications?](https://www.reddit.com/r/AskProgramming/comments/15a6u0g/how_to_reuse_codefunctionality_from_multiple/) - How to reuse code/functionality from multiple Spring Boot applications?

14. [Creating reusable modules with spring boot - java](https://stackoverflow.com/questions/53368466/creating-reusable-modules-with-spring-boot) - I'm new to Spring and Spring boot and was looking if it was possible to create reusable modules usin...

15. [Spring Modulith Crash Course : Building Modular Monoliths using Spring Boot](https://www.youtube.com/watch?v=FkP2aZiBrhg) - #sivalabs #java #spring #springboot #springmodulith #microservices  #testing #junit #junit5 #maven 
...

