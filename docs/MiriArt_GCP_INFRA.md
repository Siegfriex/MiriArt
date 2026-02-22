# MiriArt GCP 인프라 명세서 v1.0

> **작성일**: 2026-02-22 | **GCP 프로젝트명**: miriart | **GCP 프로젝트 ID**: miriarts
> **리전**: asia-northeast3 (서울)

---

## 1. 활성화 필요 API 목록

| API 이름 | 서비스 ID | 용도 |
|----------|-----------|------|
| Cloud Run API | `run.googleapis.com` | BE/AI 서비스 배포 |
| Cloud Build API | `cloudbuild.googleapis.com` | CI/CD 파이프라인 |
| Artifact Registry API | `artifactregistry.googleapis.com` | Docker 이미지 저장 |
| Cloud Storage API | `storage.googleapis.com` | 이미지 파일 저장 |
| Vertex AI API | `aiplatform.googleapis.com` | Gemini Vision, Chat |
| Cloud SQL Admin API | `sqladmin.googleapis.com` | MySQL (Cloud SQL) |
| Secret Manager API | `secretmanager.googleapis.com` | 환경변수/시크릿 관리 |
| Identity and Access Management API | `iam.googleapis.com` | 서비스 계정 관리 |
| Cloud Resource Manager API | `cloudresourcemanager.googleapis.com` | 프로젝트 정책 |
| Compute Engine API | `compute.googleapis.com` | VPC 네트워크 |
| Service Networking API | `servicenetworking.googleapis.com` | Private IP (Cloud SQL 연결) |
| Redis (Memorystore) API | `redis.googleapis.com` | Memorystore for Redis |

**Phase C5 추가 예정**:
| Firebase Cloud Messaging API | `fcm.googleapis.com` | 푸시 알림 (Phase C5) |

---

## 2. 서비스 계정 목록

### 2.1 `miriart-ai-runner`
**용도**: FastAPI AI 서비스 (Cloud Run) 런타임 계정

| 항목 | 값 |
|------|-----|
| 계정 ID | `miriart-ai-runner` |
| 이메일 | `miriart-ai-runner@miriarts.iam.gserviceaccount.com` |

| 역할 (Role) | 권한 설명 |
|-------------|-----------|
| `roles/aiplatform.user` | Vertex AI / Gemini API 호출 |
| `roles/storage.objectAdmin` | GCS 버킷 이미지 읽기/쓰기 |

---

### 2.2 `miriart-be-runner`
**용도**: Java BE 서비스 (Cloud Run) 런타임 계정

| 항목 | 값 |
|------|-----|
| 계정 ID | `miriart-be-runner` |
| 이메일 | `miriart-be-runner@miriarts.iam.gserviceaccount.com` |

| 역할 (Role) | 권한 설명 |
|-------------|-----------|
| `roles/storage.objectAdmin` | GCS 이미지 업로드/URL 생성 |
| `roles/run.invoker` | FastAPI AI Cloud Run 내부 호출 |
| `roles/cloudsql.client` | Cloud SQL (MySQL) 연결 |
| `roles/secretmanager.secretAccessor` | Secret Manager 환경변수 읽기 |

---

### 2.3 `miriart-cloudbuild`
**용도**: Cloud Build CI/CD 파이프라인 서비스 계정

| 항목 | 값 |
|------|-----|
| 계정 ID | `miriart-cloudbuild` |
| 이메일 | `miriart-cloudbuild@miriarts.iam.gserviceaccount.com` |

| 역할 (Role) | 권한 설명 |
|-------------|-----------|
| `roles/run.admin` | Cloud Run 서비스 배포 |
| `roles/iam.serviceAccountUser` | 서비스 계정 위임 |
| `roles/artifactregistry.writer` | 컨테이너 이미지 푸시 |
| `roles/storage.objectAdmin` | Build 캐시 버킷 접근 |

---

### 2.4 `miriart-local-dev` (로컬 개발 전용)
**용도**: 로컬 개발 환경에서 GCS/Vertex AI 접근용

| 항목 | 값 |
|------|-----|
| 계정 ID | `miriart-local-dev` |
| 이메일 | `miriart-local-dev@miriarts.iam.gserviceaccount.com` |
| 키 파일 | `service-account-dev.json` (절대 Git 커밋 금지) |

| 역할 (Role) | 권한 설명 |
|-------------|-----------|
| `roles/aiplatform.user` | Vertex AI 로컬 테스트 |
| `roles/storage.objectAdmin` | GCS 로컬 테스트 |

---

## 3. GCS 버킷 구조

| 버킷명 | 용도 | 접근 정책 |
|--------|------|-----------|
| `miriart-bucket` | 작품 이미지, 편집 이미지, 프로필 이미지 | 비공개 (서비스 계정만 접근) |
| `miriart-build-cache` | Cloud Build 캐시 | Cloud Build만 접근 |

**`miriart-bucket` 폴더 구조**:
```
miriart-bucket/
├── artworks/{userId}/{YYYY-MM-DD}/{uuid}_{filename}   ← 작품 원본
├── edited/{uuid}.jpg                                   ← AI 편집 결과
├── community/{postId}/{uuid}_{filename}               ← 커뮤니티 첨부 (Phase C)
└── profiles/{userId}/avatar.jpg                       ← 프로필 이미지 (Phase 2)
```

---

## 4. Cloud Run 서비스 목록

| 서비스명 | 이미지 | 포트 | 인증 | 메모리 | 리전 |
|----------|--------|------|------|--------|------|
| `miriart-ai` | `gcr.io/miriarts/miriart-ai` | 8080 | 비공개 (내부 호출만) | 1Gi | asia-northeast3 | `https://miriart-ai-946560105497.asia-northeast3.run.app` |
| `miriart-be` | `gcr.io/miriarts/miriart-be` | 8080 | 공개 (JWT 검증) | 1Gi | asia-northeast3 | `https://miriart-be-946560105497.asia-northeast3.run.app` |

---

## 5. Cloud SQL (MySQL 8.x) 설정

| 항목 | 값 |
|------|-----|
| 인스턴스명 | `miriart-mysql` |
| 데이터베이스명 | `miriart_prod` |
| Private IP | `10.99.0.3` |
| 리전 | `asia-northeast3` |
| 연결 방식 | Private IP (VPC 피어링) |
| Java BE 연결 | Cloud SQL Auth Proxy 또는 Private IP |

---

## 6. Memorystore Redis 설정

| 항목 | 값 |
|------|-----|
| 인스턴스명 | `miriart-redis` |
| 버전 | Redis 7.x |
| Private IP | `10.15.105.203` |
| 리전 | `asia-northeast3` |
| 메모리 | 1GB (기본) |
| 연결 | VPC Private IP |

---

## 7. Artifact Registry

| 저장소명 | 형식 | 리전 |
|----------|------|------|
| `miriart-images` | Docker | asia-northeast3 |

---

## 8. Secret Manager 시크릿 목록

| 시크릿 ID | 용도 | 사용 서비스 |
|-----------|------|------------|
| `miriart-jwt-access-secret` | JWT Access Token 서명 키 | miriart-be |
| `miriart-jwt-refresh-secret` | JWT Refresh Token 서명 키 | miriart-be |
| `miriart-db-url` | MySQL JDBC URL | miriart-be |
| `miriart-db-username` | MySQL 사용자명 | miriart-be |
| `miriart-db-password` | MySQL 비밀번호 | miriart-be |
| `miriart-redis-host` | Redis 호스트 IP | miriart-be |
| `miriart-kakao-client-id` | 카카오 OAuth2 Client ID | miriart-be |
| `miriart-kakao-client-secret` | 카카오 OAuth2 Secret | miriart-be |
| `miriart-google-client-id` | 구글 OAuth2 Client ID | miriart-be |
| `miriart-google-client-secret` | 구글 OAuth2 Secret | miriart-be |
| `miriart-frontend-oauth-url` | OAuth 성공 후 FE 리다이렉트 URL | miriart-be |

---

## 9. 환경변수 → Secret Manager 매핑

| Spring Boot 환경변수 | Secret Manager ID |
|----------------------|-------------------|
| `DB_URL` | `miriart-db-url` |
| `DB_USERNAME` | `miriart-db-username` |
| `DB_PASSWORD` | `miriart-db-password` |
| `REDIS_HOST` | `miriart-redis-host` |
| `KAKAO_CLIENT_ID` | `miriart-kakao-client-id` |
| `KAKAO_CLIENT_SECRET` | `miriart-kakao-client-secret` |
| `GOOGLE_CLIENT_ID` | `miriart-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | `miriart-google-client-secret` |
| `JWT_ACCESS_SECRET` | `miriart-jwt-access-secret` |
| `JWT_REFRESH_SECRET` | `miriart-jwt-refresh-secret` |
| `FRONTEND_OAUTH_SUCCESS_URL` | `miriart-frontend-oauth-url` |

---

## 10. GCP Cloud Shell 세팅 명령어 (전체)

> GCP Cloud Shell 또는 gcloud CLI 설치 환경에서 순서대로 실행

### 변수 설정 (맨 먼저 실행)

```bash
PROJECT_ID="miriarts"
REGION="asia-northeast3"
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
```

---

### Step 1: API 활성화 (전체 일괄)

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  storage.googleapis.com \
  aiplatform.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  cloudresourcemanager.googleapis.com \
  compute.googleapis.com \
  servicenetworking.googleapis.com \
  redis.googleapis.com \
  --project=$PROJECT_ID

# 활성화 확인
gcloud services list --enabled --filter="name:run OR name:aiplatform OR name:storage" --project=$PROJECT_ID
```

---

### Step 2: 서비스 계정 생성 + IAM 바인딩

#### 2-1. miriart-ai-runner (FastAPI 런타임)

```bash
gcloud iam service-accounts create miriart-ai-runner \
  --display-name="MiriArt AI Service Runner" \
  --project=$PROJECT_ID

SA_AI="miriart-ai-runner@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_AI}" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_AI}" \
  --role="roles/storage.objectAdmin"
```

#### 2-2. miriart-be-runner (Java BE 런타임)

```bash
gcloud iam service-accounts create miriart-be-runner \
  --display-name="MiriArt BE Runner" \
  --project=$PROJECT_ID

SA_BE="miriart-be-runner@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BE}" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BE}" \
  --role="roles/run.invoker"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BE}" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BE}" \
  --role="roles/secretmanager.secretAccessor"
```

#### 2-3. miriart-cloudbuild (CI/CD)

```bash
gcloud iam service-accounts create miriart-cloudbuild \
  --display-name="MiriArt Cloud Build" \
  --project=$PROJECT_ID

SA_BUILD="miriart-cloudbuild@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BUILD}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BUILD}" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BUILD}" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_BUILD}" \
  --role="roles/storage.objectAdmin"
```

#### 2-4. miriart-local-dev (로컬 개발 전용 키 발급)

```bash
gcloud iam service-accounts create miriart-local-dev \
  --display-name="MiriArt Local Dev" \
  --project=$PROJECT_ID

SA_DEV="miriart-local-dev@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_DEV}" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_DEV}" \
  --role="roles/storage.objectAdmin"

# 로컬용 키 파일 발급 (Git 커밋 금지!)
gcloud iam service-accounts keys create \
  ./service-account-dev.json \
  --iam-account=$SA_DEV \
  --project=$PROJECT_ID

echo "키 파일 생성 완료: service-account-dev.json"
echo "주의: 이 파일을 .gitignore에 추가하세요"
```

---

### Step 3: GCS 버킷 생성

```bash
# 메인 이미지 버킷
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION \
  gs://miriart-bucket

# CORS 설정 (FE 직접 업로드 대비, Phase 2)
cat > /tmp/cors.json << 'EOF'
[{
  "origin": ["https://app.miriart.com", "http://localhost:5173"],
  "responseHeader": ["Content-Type", "Authorization"],
  "method": ["GET", "PUT", "POST"],
  "maxAgeSeconds": 3600
}]
EOF
gsutil cors set /tmp/cors.json gs://miriart-bucket

# 서비스 계정에 버킷 접근 권한 명시적 추가
gsutil iam ch \
  serviceAccount:${SA_AI}:objectAdmin \
  gs://miriart-bucket

gsutil iam ch \
  serviceAccount:${SA_BE}:objectAdmin \
  gs://miriart-bucket

# Cloud Build 캐시 버킷
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION \
  gs://miriart-build-cache

# 버킷 확인
gsutil ls -p $PROJECT_ID
```

---

### Step 4: Artifact Registry Docker 저장소 생성

```bash
gcloud artifacts repositories create miriart-images \
  --repository-format=docker \
  --location=$REGION \
  --description="MiriArt Docker Images" \
  --project=$PROJECT_ID

# 확인
gcloud artifacts repositories list \
  --location=$REGION \
  --project=$PROJECT_ID
```

---

### Step 5: Secret Manager 시크릿 생성

```bash
# 각 시크릿을 echo 파이프로 생성 (실제 값은 나중에 update)
for SECRET_ID in \
  miriart-jwt-access-secret \
  miriart-jwt-refresh-secret \
  miriart-db-url \
  miriart-db-username \
  miriart-db-password \
  miriart-redis-host \
  miriart-kakao-client-id \
  miriart-kakao-client-secret \
  miriart-google-client-id \
  miriart-google-client-secret \
  miriart-frontend-oauth-url; do
    echo "placeholder" | gcloud secrets create $SECRET_ID \
      --data-file=- \
      --project=$PROJECT_ID 2>/dev/null || \
    echo "$SECRET_ID already exists, skipping"
done

# 실제 값 업데이트 예시 (각자 값 입력)
echo -n "your_jwt_access_secret_base64" | gcloud secrets versions add \
  miriart-jwt-access-secret --data-file=- --project=$PROJECT_ID

echo -n "jdbc:mysql://PRIVATE_IP:3306/miriart_prod" | gcloud secrets versions add \
  miriart-db-url --data-file=- --project=$PROJECT_ID

# 시크릿 목록 확인
gcloud secrets list --project=$PROJECT_ID
```

---

### Step 6: Cloud SQL (MySQL 8.x) 생성

```bash
# Cloud SQL 인스턴스 생성 (Private IP VPC 피어링)
gcloud sql instances create miriart-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=$REGION \
  --no-assign-ip \
  --network=default \
  --project=$PROJECT_ID

# 데이터베이스 생성
gcloud sql databases create miriart_prod \
  --instance=miriart-mysql \
  --charset=utf8mb4 \
  --collation=utf8mb4_unicode_ci \
  --project=$PROJECT_ID

# DB 사용자 생성
gcloud sql users create miriart \
  --instance=miriart-mysql \
  --password="StrongPassword123!" \
  --project=$PROJECT_ID

# Private IP 확인 (BE 환경변수에 사용)
gcloud sql instances describe miriart-mysql \
  --format="value(ipAddresses[0].ipAddress)" \
  --project=$PROJECT_ID
```

---

### Step 7: Memorystore Redis 생성

```bash
gcloud redis instances create miriart-redis \
  --size=1 \
  --region=$REGION \
  --redis-version=redis_7_0 \
  --network=default \
  --project=$PROJECT_ID

# Redis IP 확인 (BE 환경변수에 사용)
gcloud redis instances describe miriart-redis \
  --region=$REGION \
  --format="value(host)" \
  --project=$PROJECT_ID
```

---

### Step 8: Cloud Run 서비스 초기 배포 (빈 컨테이너로 등록)

```bash
# AI 서비스 (내부 전용)
gcloud run deploy miriart-ai \
  --image=gcr.io/cloudrun/hello \
  --region=$REGION \
  --no-allow-unauthenticated \
  --service-account=$SA_AI \
  --project=$PROJECT_ID

# BE 서비스 (공개)
gcloud run deploy miriart-be \
  --image=gcr.io/cloudrun/hello \
  --region=$REGION \
  --allow-unauthenticated \
  --service-account=$SA_BE \
  --project=$PROJECT_ID

# AI 서비스 URL 확인 (BE의 FASTAPI_INTERNAL_URL 환경변수로 사용)
gcloud run services describe miriart-ai \
  --region=$REGION \
  --format="value(status.url)" \
  --project=$PROJECT_ID
```

---

### Step 9: BE가 AI 서비스를 내부 호출할 수 있도록 IAM 설정

```bash
# BE 서비스 계정이 AI Cloud Run을 호출할 수 있도록
gcloud run services add-iam-policy-binding miriart-ai \
  --region=$REGION \
  --member="serviceAccount:${SA_BE}" \
  --role="roles/run.invoker" \
  --project=$PROJECT_ID
```

---

### Step 10: 최종 확인

```bash
echo "=== API 활성화 확인 ==="
gcloud services list --enabled --project=$PROJECT_ID | grep -E "run|aiplatform|storage|sql|redis|secret"

echo "=== 서비스 계정 확인 ==="
gcloud iam service-accounts list --project=$PROJECT_ID

echo "=== GCS 버킷 확인 ==="
gsutil ls -p $PROJECT_ID

echo "=== Artifact Registry 확인 ==="
gcloud artifacts repositories list --location=$REGION --project=$PROJECT_ID

echo "=== Cloud Run 서비스 확인 ==="
gcloud run services list --region=$REGION --project=$PROJECT_ID

echo "=== Secret Manager 확인 ==="
gcloud secrets list --project=$PROJECT_ID

echo "=== Cloud SQL 확인 ==="
gcloud sql instances list --project=$PROJECT_ID

echo "=== Redis 확인 ==="
gcloud redis instances list --region=$REGION --project=$PROJECT_ID

echo "=== 세팅 완료 ==="
```

Step 10 실행 후 모든 항목이 정상 출력되면 GCP 인프라 세팅이 완료된 것입니다.
완료 후 `service-account-dev.json` 파일을 로컬 `miriart-ai/.env`에 경로 등록하세요.

---

## 11. 세팅 완료 후 로컬 .env 연결 체크리스트

| 항목 | 파일 | 업데이트 내용 |
|------|------|--------------|
| FastAPI | `miriart-ai/.env` | `GOOGLE_APPLICATION_CREDENTIALS=./service-account-dev.json` |
| FastAPI | `miriart-ai/.env` | `GCS_BUCKET_NAME=miriart-bucket`, `GCP_PROJECT_ID=miriarts` |
| Java BE | `application-dev.yml` | `DB_URL`, `REDIS_HOST`, `KAKAO_CLIENT_ID`, `JWT_SECRET` 등 |
| .gitignore | 루트 | `service-account-dev.json`, `*.env.local` 추가 확인 |
