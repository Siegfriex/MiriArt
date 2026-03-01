# MiriArt BE — prod 프로파일 로컬 재현
# 전제: 로컬 MySQL miriart_prod, 사용자 miriart/MiriArt!!!, Redis localhost:6379, .env(dev용) 존재
# 사용: $env:DB_PASSWORD = "MiriArt!!!"; .\scripts\run-prod-local.ps1 (miriart-be 루트에서 실행)
#       DB_USERNAME/DB_PASSWORD는 이 스크립트에 넣지 않고, 호출 전에 env로 설정할 것.

$ErrorActionPreference = "Stop"
$envFile = Join-Path (Join-Path $PSScriptRoot "..") ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim().Trim('"')
            [System.Environment]::SetEnvironmentVariable($key, $val, 'Process')
        }
    }
}

$env:SPRING_PROFILES_ACTIVE = "prod"
$env:DB_URL = "jdbc:mysql://localhost:3306/miriart_prod?useSSL=false&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&serverTimezone=Asia/Seoul"
$env:DB_USERNAME = "miriart"
# DB_PASSWORD는 호출 전에 반드시 설정: $env:DB_PASSWORD = "MiriArt!!!"
if (-not [System.Environment]::GetEnvironmentVariable("DB_PASSWORD", "Process")) {
    Write-Error "DB_PASSWORD not set. Example: `$env:DB_PASSWORD = 'MiriArt!!!'; .\scripts\run-prod-local.ps1"
    exit 1
}

# OAuth 성공 후 리다이렉트할 FE URL. 로컬 FE로 로그인 테스트할 땐 호출 전에 설정:
#   $env:FRONTEND_OAUTH_SUCCESS_URL = "http://localhost:5173"; .\scripts\run-prod-local.ps1
if (-not [System.Environment]::GetEnvironmentVariable("FRONTEND_OAUTH_SUCCESS_URL", "Process")) {
    $env:FRONTEND_OAUTH_SUCCESS_URL = "https://miri-art.vercel.app"
}

Set-Location (Join-Path $PSScriptRoot "..")
.\gradlew.bat bootRun --no-daemon
