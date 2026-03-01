# MiriArt BE — Cloud Run 재배포 (이미지 빌드 + 배포)
# 전제: gcloud CLI 로그인 완료, 프로젝트 miriarts
# 사용: miriart-be 루트에서 .\scripts\cloudrun-redeploy.ps1

$ErrorActionPreference = "Stop"
$PROJECT_ID = "miriarts"
$REGION = "asia-northeast3"
$IMAGE_BE = "asia-northeast3-docker.pkg.dev/miriarts/miriart-images/miriart-be:latest"
$SA_BE = "miriart-be-runner@miriarts.iam.gserviceaccount.com"
$INSTANCE = "miriarts:asia-northeast3:miriart-mysql"

$root = Join-Path $PSScriptRoot ".."
Set-Location $root

Write-Host "[1/2] Cloud Build로 이미지 빌드 및 푸시..."
gcloud builds submit --tag $IMAGE_BE --project=$PROJECT_ID .

Write-Host "[2/2] Cloud Run 배포..."
gcloud run deploy miriart-be `
  --image=$IMAGE_BE `
  --region=$REGION `
  --platform=managed `
  --no-allow-unauthenticated `
  --service-account=$SA_BE `
  --port=8080 `
  --memory=1Gi `
  --add-cloudsql-instances=$INSTANCE `
  --vpc-connector=miriart-connector `
  --vpc-egress=private-ranges-only `
  --set-secrets=DB_URL=miriart-db-url:latest,DB_USERNAME=miriart-db-username:latest,DB_PASSWORD=miriart-db-password:latest,REDIS_HOST=miriart-redis-host:latest,JWT_ACCESS_SECRET=miriart-jwt-access-secret:latest,JWT_REFRESH_SECRET=miriart-jwt-refresh-secret:latest,GOOGLE_CLIENT_ID=miriart-google-client-id:latest,GOOGLE_CLIENT_SECRET=miriart-google-client-secret:latest,KAKAO_CLIENT_ID=miriart-kakao-client-id:latest,KAKAO_CLIENT_SECRET=miriart-kakao-client-secret:latest,FRONTEND_OAUTH_SUCCESS_URL=miriart-frontend-oauth-url:latest `
  --set-env-vars="SPRING_PROFILES_ACTIVE=prod,FASTAPI_INTERNAL_URL=https://miriart-ai-946560105497.asia-northeast3.run.app,GCS_BUCKET_NAME=miriart-bucket" `
  --project=$PROJECT_ID

Write-Host "완료. health 확인: https://miriart-be-946560105497.asia-northeast3.run.app/actuator/health"
