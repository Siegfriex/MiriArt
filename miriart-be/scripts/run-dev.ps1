# MiriArt BE — dev 프로파일 로컬 실행
# 전제: Docker MySQL(miriart_dev, root/password), Redis(localhost:6379), .env 존재
# 사용: .\scripts\run-dev.ps1 (miriart-be 루트에서 실행)

$ErrorActionPreference = "Stop"
$envFile = Join-Path (Join-Path $PSScriptRoot "..") ".env"
if (-not (Test-Path $envFile)) {
    Write-Error ".env not found at $envFile"
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim().Trim('"')
        [System.Environment]::SetEnvironmentVariable($key, $val, 'Process')
    }
}

$env:SPRING_PROFILES_ACTIVE = "dev"
Set-Location (Join-Path $PSScriptRoot "..")
.\gradlew.bat bootRun --no-daemon
