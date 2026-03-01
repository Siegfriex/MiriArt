# ---- Stage 1: 빌드 ----
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Gradle Wrapper 파일 복사 (캐시 레이어 최적화)
COPY gradlew gradlew.bat ./
COPY gradle/ gradle/
# Windows CRLF → LF 변환 (Linux에서 ./gradlew 실행 시 "not found" 방지)
RUN sed -i 's/\r$//' gradlew && chmod +x ./gradlew

# 의존성 캐시 레이어: build 스크립트 먼저 복사
COPY build.gradle settings.gradle ./

# 소스 전체 복사
COPY src/ src/

# bootJar 빌드 (build.gradle의 buildDir = build2 반영)
RUN ./gradlew bootJar --no-daemon -x test

# ---- Stage 2: 런타임 ----
FROM eclipse-temurin:17-jre-jammy AS runtime

WORKDIR /

# 빌드 결과 JAR 복사 (build/libs/)
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-jar", "/app.jar"]
