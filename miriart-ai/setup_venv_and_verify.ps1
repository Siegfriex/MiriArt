# MiriArt miriart-ai .venv 재초기화 및 uvicorn 검증 스크립트
# 결과는 H:\MiriArt\miriart-ai\venv_verify_result.txt 에 저장

$ErrorActionPreference = "Continue"
$logPath = "H:\MiriArt\miriart-ai\venv_verify_result.txt"
$projectRoot = "H:\MiriArt\miriart-ai"

function Log { param($msg) $msg | Out-File -FilePath $logPath -Append -Encoding utf8; Write-Host $msg }

"" | Out-File -FilePath $logPath -Encoding utf8
Log "=== MiriArt miriart-ai .venv 재초기화 및 검증 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') ==="
Log ""

# 1) Python 3.11 경로 찾기
Log "--- 1. Python 3.11 경로 찾기 ---"
$py311Paths = @(
    "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe",
    "${env:ProgramFiles}\Python311\python.exe",
    "${env:ProgramFiles(x86)}\Python311\python.exe",
    "C:\Users\RYUzFAM\AppData\Local\Programs\Python\Python311\python.exe",
    "C:\Users\ryuje\AppData\Local\Programs\Python\Python311\python.exe",
    "C:\Users\$env:USERNAME\AppData\Local\Programs\Python\Python311\python.exe"
)
$py311 = $null
foreach ($p in $py311Paths) {
    if (Test-Path $p) { $py311 = $p; break }
}
if (-not $py311) {
    try {
        $found = Get-Command python -ErrorAction SilentlyContinue
        if ($found) {
            $v = & python -c "import sys; print(sys.version)" 2>$null
            if ($v -match "3\.11") { $py311 = $found.Source }
        }
    } catch {}
}
if (-not $py311) {
    Log "ERROR: Python 3.11 not found. Tried: $($py311Paths -join ', ')"
    exit 1
}
Log "Python 3.11: $py311"
Log ""

# 2) .venv 제거 후 재생성
Log "--- 2. .venv 제거 및 재생성 ---"
Set-Location $projectRoot
if (Test-Path ".venv") {
    Remove-Item -Recurse -Force ".venv"
    Log "Removed existing .venv"
}
& $py311 -m venv ".venv"
if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Log "ERROR: .venv creation failed - Scripts\python.exe missing"
    exit 1
}
Log "Created new .venv with: $py311"
Log ""

# 3) 활성화 및 버전 확인
Log "--- 3. venv 활성화 및 버전 확인 ---"
& ".\.venv\Scripts\Activate.ps1"
$pyVersion = & python --version 2>&1
Log "python --version: $pyVersion"
$cmdPython = Get-Command python -ErrorAction SilentlyContinue
$cmdPip = Get-Command pip -ErrorAction SilentlyContinue
Log "Get-Command python Source: $($cmdPython.Source)"
Log "Get-Command pip Source: $($cmdPip.Source)"
$cmdUvicorn = Get-Command uvicorn -ErrorAction SilentlyContinue
Log "Get-Command uvicorn: $(if($cmdUvicorn){$cmdUvicorn.Source}else{'not found (will install)'})"
Log ""

# 4) 의존성 설치
Log "--- 4. 의존성 설치 ---"
& python -m pip install --upgrade pip 2>&1 | Out-File -FilePath $logPath -Append -Encoding utf8
& pip install -r requirements.txt 2>&1 | Out-File -FilePath $logPath -Append -Encoding utf8
Log "pip list (fastapi, uvicorn, google-cloud-aiplatform, google-cloud-storage):"
& pip list | Select-String "fastapi|uvicorn|google-cloud-aiplatform|google-cloud-storage" | ForEach-Object { Log $_.Line }
Log ""

# 5) uvicorn 기동 (백그라운드) 후 /docs 요청
Log "--- 5. uvicorn 기동 및 /docs 검증 ---"
$venvPython = "H:\MiriArt\miriart-ai\.venv\Scripts\python.exe"
$job = Start-Job -ScriptBlock {
    Set-Location "H:\MiriArt\miriart-ai"
    & $using:venvPython -m uvicorn app.main:app --port 8000 2>&1
}
Start-Sleep -Seconds 6
$statusCode = $null
$docsError = $null
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:8000/docs" -UseBasicParsing -TimeoutSec 5
    $statusCode = $r.StatusCode
} catch {
    $docsError = $_.Exception.Message
}
Stop-Job $job
Receive-Job $job | Out-File -FilePath $logPath -Append -Encoding utf8
Remove-Job $job -Force
Log "/docs StatusCode: $(if($statusCode){$statusCode}else{'FAIL'})"
if ($docsError) { Log "/docs Error: $docsError" }
Log ""

# 6) pyvenv.cfg 확인 (경로에 .venv_311 없는지)
$cfg = Get-Content ".venv\pyvenv.cfg" -Raw
$hasOldPath = $cfg -match "venv_311"
Log "--- 6. pyvenv.cfg 내 .venv_311 참조 여부 ---"
Log "Contains .venv_311: $hasOldPath"
Log "pyvenv.cfg content:"
Log $cfg
Log ""
Log "=== 완료 ==="
