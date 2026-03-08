# BE Cloud Run ↔ Cloud SQL 연결 수정 가이드

> **원인**: Cloud Run은 VPC 밖에서 실행되므로 Cloud SQL **프라이빗 IP**(10.99.0.3)에 직접 접근 불가.  
> **해결**: Cloud Run 기본 제공 **Cloud SQL 인스턴스 연결**(Unix 소켓) + **Cloud SQL Socket Factory** 사용.

---

## 1. 적용된 코드 변경

- **build.gradle**: `com.google.cloud.sql:mysql-socket-factory-connector-j-8:1.25.1` 추가됨.
- **DB_URL**: Secret Manager 값을 **소켓 방식 JDBC URL**로 바꿔야 함 (아래 2번).
- **Cloud Run 배포 옵션**: `--add-cloudsql-instances=miriarts:asia-northeast3:miriart-mysql` 필수 (아래 3번).

---

## 2. Secret Manager `miriart-db-url` 업데이트

Cloud Run에서 사용할 JDBC URL은 **호스트 없이** Cloud SQL 인스턴스 연결 이름 + Socket Factory를 사용합니다.

**Cloud Shell에서 실행** (한 줄, 줄바꿈 없음):

```bash
echo -n "jdbc:mysql:///miriart_prod?cloudSqlInstance=miriarts:asia-northeast3:miriart-mysql&socketFactory=com.google.cloud.sql.mysql.SocketFactory&useSSL=false&characterEncoding=UTF-8&serverTimezone=Asia/Seoul" | \
  gcloud secrets versions add miriart-db-url --data-file=- --project=miriarts
```

**확인**:
```bash
gcloud secrets versions access latest --secret=miriart-db-url --project=miriarts
```

---

## 3. (선택) Redis용 VPC 커넥터 생성 — 최초 1회

Redis(Memorystore)는 프라이빗 IP만 있으므로, Cloud Run이 접근하려면 **VPC 커넥터**가 필요합니다. 아직 없다면 한 번만 생성합니다.

```bash
gcloud compute networks vpc-access connectors create miriart-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=miriarts
```

이미 있으면 다음 단계로.

---

## 4. BE 이미지 재빌드 후 Cloud Run 재배포

### 4-1. 로컬에서 Docker 빌드 → 푸시 → GCP에서 배포

**1) 로컬 (PowerShell, `miriart-be` 폴더에서)**

```powershell
cd h:\MiriArt\miriart-be

# 이미지 태그
$IMAGE_BE = "asia-northeast3-docker.pkg.dev/miriarts/miriart-images/miriart-be:latest"

# Docker 빌드
docker build -t $IMAGE_BE .

# GCP 레지스트리 인증 (최초 1회)
gcloud auth configure-docker asia-northeast3-docker.pkg.dev --quiet

# 푸시
docker push $IMAGE_BE
```

**2) GCP Cloud Shell (또는 gcloud 로그인된 터미널)**

이미지는 이미 Artifact Registry에 있으므로, 아래 배포 명령만 실행하면 됩니다.

```bash
PROJECT_ID=miriarts
REGION=asia-northeast3
IMAGE_BE=asia-northeast3-docker.pkg.dev/miriarts/miriart-images/miriart-be:latest
SA_BE=miriart-be-runner@miriarts.iam.gserviceaccount.com
INSTANCE=miriarts:asia-northeast3:miriart-mysql

gcloud run deploy miriart-be \
  --image=$IMAGE_BE \
  --region=$REGION \
  --platform=managed \
  --no-allow-unauthenticated \
  --service-account=$SA_BE \
  --port=8080 \
  --memory=1Gi \
  --add-cloudsql-instances=$INSTANCE \
  --vpc-connector=miriart-connector \
  --vpc-egress=private-ranges-only \
  --set-secrets=DB_URL=miriart-db-url:latest,DB_USERNAME=miriart-db-username:latest,DB_PASSWORD=miriart-db-password:latest,REDIS_HOST=miriart-redis-host:latest,JWT_ACCESS_SECRET=miriart-jwt-access-secret:latest,JWT_REFRESH_SECRET=miriart-jwt-refresh-secret:latest,GOOGLE_CLIENT_ID=miriart-google-client-id:latest,GOOGLE_CLIENT_SECRET=miriart-google-client-secret:latest,KAKAO_CLIENT_ID=miriart-kakao-client-id:latest,KAKAO_CLIENT_SECRET=miriart-kakao-client-secret:latest,FRONTEND_OAUTH_SUCCESS_URL=miriart-frontend-oauth-url:latest \
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod,FASTAPI_INTERNAL_URL=https://miriart-ai-946560105497.asia-northeast3.run.app,GCS_BUCKET_NAME=miriart-bucket" \
  --project=$PROJECT_ID
```

- **대안**: 로컬에서 한 번에 하려면 `miriart-be` 루트에서 `.\scripts\cloudrun-redeploy.ps1` 실행 (GCP Cloud Build로 빌드 후 바로 deploy).

---

## 4-2. (대안) Cloud Build로 빌드 후 배포

로컬에서 Docker를 쓰지 않고, GCP Cloud Build로 이미지를 빌드·푸시한 뒤 배포하려면:

```bash
# 변수
PROJECT_ID=miriarts
REGION=asia-northeast3
IMAGE_BE=asia-northeast3-docker.pkg.dev/miriarts/miriart-images/miriart-be:latest
SA_BE=miriart-be-runner@miriarts.iam.gserviceaccount.com
INSTANCE=miriarts:asia-northeast3:miriart-mysql

# 1) Cloud Build로 이미지 빌드·푸시 (miriart-be 루트에서)
gcloud builds submit --tag $IMAGE_BE --project=$PROJECT_ID .

# 2) Cloud Run 배포
gcloud run deploy miriart-be \
  --image=$IMAGE_BE \
  --region=$REGION \
  --platform=managed \
  --no-allow-unauthenticated \
  --service-account=$SA_BE \
  --port=8080 \
  --memory=1Gi \
  --add-cloudsql-instances=$INSTANCE \
  --vpc-connector=miriart-connector \
  --vpc-egress=private-ranges-only \
  --set-secrets=DB_URL=miriart-db-url:latest,DB_USERNAME=miriart-db-username:latest,DB_PASSWORD=miriart-db-password:latest,REDIS_HOST=miriart-redis-host:latest,JWT_ACCESS_SECRET=miriart-jwt-access-secret:latest,JWT_REFRESH_SECRET=miriart-jwt-refresh-secret:latest,GOOGLE_CLIENT_ID=miriart-google-client-id:latest,GOOGLE_CLIENT_SECRET=miriart-google-client-secret:latest,KAKAO_CLIENT_ID=miriart-kakao-client-id:latest,KAKAO_CLIENT_SECRET=miriart-kakao-client-secret:latest,FRONTEND_OAUTH_SUCCESS_URL=miriart-frontend-oauth-url:latest \
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod,FASTAPI_INTERNAL_URL=https://miriart-ai-946560105497.asia-northeast3.run.app,GCS_BUCKET_NAME=miriart-bucket" \
  --project=$PROJECT_ID
```

- **PowerShell에서 한 번에**: `miriart-be` 루트에서 `.\scripts\cloudrun-redeploy.ps1` 실행하면 위와 동일한 순서로 동작함.

- `--add-cloudsql-instances=$INSTANCE`: Cloud Run ↔ Cloud SQL 소켓 연결 (필수).
- `--vpc-connector` / `--vpc-egress`: Redis 등 VPC 내부 접근용. 커넥터 미생성 시 3번 먼저 실행.
- `DB_URL`: 2번에서 넣은 **소켓용 URL**이 Secret에서 주입됨.

---

## 5. 로컬 개발 시 DB_URL

로컬(`application-dev.yml`)은 기존처럼 **호스트:포트** 방식 그대로 사용합니다.

- 로컬: `jdbc:mysql://localhost:3306/miriart_dev?...`
- Cloud Run: `jdbc:mysql:///miriart_prod?cloudSqlInstance=...&socketFactory=...` (위 2번 값)

`SPRING_PROFILES_ACTIVE=dev`일 때는 `DB_URL`을 로컬용으로 두면 됩니다.

---

## 6. Redis 연결 (Memorystore도 프라이빗 IP)

Cloud Run은 **Redis(Memorystore)** 에도 VPC 밖에서는 접근할 수 없습니다.  
DB는 `--add-cloudsql-instances`로 해결되지만, Redis는 **VPC 커넥터**가 필요합니다.

### 옵션 A: Serverless VPC Access 커넥터 생성 후 BE에 연결

```bash
# 1) 커넥터 생성 (리전·네트워크 일치, 최초 1회)
gcloud compute networks vpc-access connectors create miriart-connector \
  --region=asia-northeast3 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=miriarts

# 2) BE 배포 시 추가 옵션
gcloud run deploy miriart-be \
  ... \
  --vpc-connector=miriart-connector \
  --vpc-egress=private-ranges-only \
  ...
```

- `--vpc-egress=private-ranges-only`: 아웃바운드가 프라이빗 대역(10.x, Redis/기타 내부)으로만 나가고, 나머지는 기존 인터넷 경로 사용.
- Redis 호스트는 기존처럼 Secret `miriart-redis-host` 값 `10.15.105.203` 유지.

### 옵션 B: Redis 없이 기동 (임시)

세션/캐시를 Redis에 안 쓰고 기동만 해보려면, `application-prod.yml`에서 Redis 설정을 조건부로 하거나, Redis 비활성화 프로파일을 두고 배포할 수 있습니다. 운영에서는 옵션 A 권장.

---

## 7. 재배포 후 확인

- Cloud Run 로그에서 `Started MiriartApiApplication` 또는 정상 기동 메시지 확인.
- **DB**: 여전히 `Communications link failure` / `JDBCConnectionException` 이면
  - `miriart-db-url` 시크릿이 정확히 한 줄인지, 소켓 URL과 동일한지 재확인.
  - 해당 리비전에 `--add-cloudsql-instances`가 적용됐는지 콘솔에서 확인.
- **Redis**: Redis 연결 오류가 나면 5번대로 VPC 커넥터 연결 후 재배포.
