# MiriArt — docs 폴더 내부: 유지 목록에 없는 .md만 삭제
# 범위: H:\MiriArt\docs (및 docs\SSOT 등 하위) 만 대상. 레포 전체/ .venv 등 미포함.
# 실행: .\delete-unused-docs.ps1 (대상만 출력) / .\delete-unused-docs.ps1 -Confirm (실제 삭제)

param(
    [switch]$WhatIf = $true,
    [switch]$Confirm
)

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot
$docsRoot = Join-Path $repoRoot "docs"

# docs 폴더 안에서 유지할 .md (repo 루트 기준 상대 경로)
$keepList = @(
    "docs\SSOT\miriarts_infra.md",
    "docs\SSOT\CHANGELOG_infra.md",
    "docs\SSOT\miriarts_central.md",
    "docs\MiriArt_GCP_INFRA.md",
    "docs\mysql_erd_v1.md",
    "docs\MiriArt_ERD_v2.md",
    "docs\MiriArt_레포_전제_코드문서_정의_정리.md",
    "docs\MiriArt_API_CONTRACT.md",
    "docs\MiriArt_PRD_v2.md",
    "docs\MiriArt_FSD_v2.md",
    "docs\P1_구현_갭_및_ERD_정합성_보고서.md",
    "docs\MIRIART_HOME_COMMUNITY_DESIGN_v1.md",
    "docs\miri-art-sitemap-ASCII.md",
    "docs\design-system-2nd-audit.md",
    "docs\MiriArt_BE_CloudRun_CloudSQL_FIX.md"
)

function Normalize-RelativePath {
    param([string]$FullPath)
    $rel = $FullPath
    if ($FullPath.StartsWith($repoRoot)) {
        $rel = $FullPath.Substring($repoRoot.Length).TrimStart("\", "/")
    }
    return $rel -replace "/", "\"
}

$keepNormalized = @{}
foreach ($k in $keepList) {
    $norm = (Join-Path $repoRoot $k) -replace "/", "\"
    $keepNormalized[$norm] = $true
}

# docs 폴더 내부의 .md만 검색
$allMd = Get-ChildItem -Path $docsRoot -Filter "*.md" -Recurse -File

$toDelete = @()
foreach ($f in $allMd) {
    $full = $f.FullName -replace "/", "\"
    if (-not $keepNormalized[$full]) {
        $toDelete += $f
    }
}

Write-Host "=== 유지 목록 (삭제 제외) ===" -ForegroundColor Green
foreach ($k in $keepList) { Write-Host "  $k" }
Write-Host ""

if ($toDelete.Count -eq 0) {
    Write-Host "삭제할 .md 파일이 없습니다." -ForegroundColor Cyan
    exit 0
}

Write-Host "=== 삭제 대상 .md ($($toDelete.Count)개) ===" -ForegroundColor Yellow
foreach ($f in $toDelete) {
    $rel = Normalize-RelativePath $f.FullName
    Write-Host "  $rel"
}

if ($WhatIf -and -not $Confirm) {
    Write-Host ""
    Write-Host "※ -WhatIf 기본: 위 파일들은 삭제되지 않았습니다. 실제 삭제 시 다음처럼 실행하세요:" -ForegroundColor Cyan
    Write-Host "  .\delete-unused-docs.ps1 -Confirm" -ForegroundColor White
    exit 0
}

if (-not $Confirm) {
    Write-Host ""
    Write-Host "실제 삭제를 하려면 -Confirm 을 붙여 실행하세요." -ForegroundColor Cyan
    exit 0
}

Write-Host ""
$ans = Read-Host "위 $($toDelete.Count)개 파일을 삭제할까요? (y/N)"
if ($ans -ne "y" -and $ans -ne "Y") {
    Write-Host "취소했습니다." -ForegroundColor Gray
    exit 0
}

foreach ($f in $toDelete) {
    Remove-Item -LiteralPath $f.FullName -Force
    Write-Host "삭제: $($f.FullName)"
}
Write-Host ""
Write-Host "삭제 완료. 유지된 .md는 위 유지 목록만 남았는지 확인하세요." -ForegroundColor Green
