# .venv 재초기화 및 uvicorn 검증 — 결과 요약

## 적용한 작업

1. **pyvenv.cfg 수정**  
   `command` 라인이 `.venv_311`을 가리키던 것을 **`.venv`** 로 변경했습니다.  
   (경로: `miriart-ai\.venv\pyvenv.cfg`)

2. **자동화 스크립트**  
   - `setup_venv_and_verify.ps1`: venv 삭제 → 재생성 → pip 설치 → uvicorn 기동 → `/docs` 요청까지 한 번에 실행.  
   - Python 3.11 경로는 RYUzFAM, ryuje, `%LOCALAPPDATA%`, `Program Files` 등을 순서대로 시도합니다.

3. **수동 실행 가이드**  
   - `RUN_VENV_SETUP.md`: Python 3.11 경로 확인, .venv 삭제/재생성, 활성화, pip 설치, uvicorn 기동, `/docs` 확인 순서 정리.

4. **현재 .venv 상태**  
   - `Scripts` 폴더가 없거나 깨진 상태이면, **.venv 전체 삭제 후 Python 3.11로 다시 생성**해야 합니다.  
   - `RUN_VENV_SETUP.md` 2단계 또는 `setup_venv_and_verify.ps1` 실행으로 재생성하세요.

---

## 검증 결과 요약표 (로컬에서 실행 후 기입)

로컬 PowerShell에서 `RUN_VENV_SETUP.md` 또는 `setup_venv_and_verify.ps1`을 실행한 뒤, 아래 표를 채워서 확인하세요.

| 항목 | 결과 |
|------|------|
| **python --version** | Python 3.11.x (venv 활성화 후) |
| **Get-Command python Source** | `…\miriart-ai\.venv\Scripts\python.exe` |
| **Get-Command pip Source** | `…\miriart-ai\.venv\Scripts\pip.exe` |
| **설치된 fastapi 버전** | requirements.txt와 일치 (예: 0.115.8) |
| **설치된 uvicorn 버전** | requirements.txt와 일치 (예: 0.34.0) |
| **설치된 google-cloud-aiplatform 버전** | requirements.txt와 일치 (예: 1.79.0) |
| **설치된 google-cloud-storage 버전** | requirements.txt와 일치 (예: 2.19.0) |
| **python -m uvicorn app.main:app --port 8000 기동** | 성공 (Fatal error 없음) |
| **http://127.0.0.1:8000/docs StatusCode** | 200 |
| **이전 경로(.venv_311) 참조 에러** | 없음 (재생성 후) |

---

## 한 번에 실행 (자동 스크립트)

```powershell
cd H:\MiriArt\miriart-ai
powershell -ExecutionPolicy Bypass -File .\setup_venv_and_verify.ps1
```

실행이 끝나면 `venv_verify_result.txt`에서 위 표 항목에 해당하는 로그를 확인할 수 있습니다.
