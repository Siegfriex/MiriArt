# .venv 재초기화 및 uvicorn 검증 (수동 실행 가이드)

`.venv`가 이전 경로(.venv_311)를 참조해 Fatal error가 나는 경우, 아래 순서대로 실행하세요.

## 1. Python 3.11 경로 확인

PowerShell에서:

```powershell
where.exe python
where.exe python311
# 또는
Get-Command python | Select-Object Source
```

설치 경로 예시:
- `C:\Users\<USERNAME>\AppData\Local\Programs\Python\Python311\python.exe`
- `C:\Program Files\Python311\python.exe`

## 2. .venv 완전 삭제 후 재생성

**프로젝트 폴더로 이동:**

```powershell
cd H:\MiriArt\miriart-ai
```

**기존 .venv 삭제:**

```powershell
Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue
```

**Python 3.11로 새 venv 생성 (경로를 본인 환경에 맞게 수정):**

```powershell
& "C:\Users\RYUzFAM\AppData\Local\Programs\Python\Python311\python.exe" -m venv .venv
```

다른 사용자/경로인 경우 예:

```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe" -m venv .venv
# 또는
& "C:\Program Files\Python311\python.exe" -m venv .venv
```

## 3. venv 활성화 및 버전 확인

```powershell
.\.venv\Scripts\Activate.ps1
python --version
Get-Command python
Get-Command pip
Get-Command uvicorn -ErrorAction SilentlyContinue
```

- `python --version` → `Python 3.11.x` 확인
- `Get-Command python` / `pip` 의 Source가 `.venv\Scripts\` 아래인지 확인

## 4. 의존성 설치

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
pip list | Select-String "fastapi|uvicorn|google-cloud-aiplatform|google-cloud-storage"
```

## 5. uvicorn 기동 및 /docs 확인

**기동:**

```powershell
python -m uvicorn app.main:app --port 8000
```

**다른 PowerShell 탭에서:**

```powershell
Invoke-WebRequest http://127.0.0.1:8000/docs -UseBasicParsing | Select-Object StatusCode
```

- `StatusCode 200` 이면 성공
- 기동 중 `.venv_311` 관련 Fatal error가 없어야 함

테스트 후 uvicorn은 `Ctrl+C`로 종료.

## 6. 자동 스크립트 사용 (선택)

Python 3.11이 위 예시 경로 중 하나에 있으면, 아래 한 번에 실행할 수 있습니다.

```powershell
cd H:\MiriArt\miriart-ai
powershell -ExecutionPolicy Bypass -File .\setup_venv_and_verify.ps1
```

결과는 `venv_verify_result.txt`에 기록됩니다.
