# miriart-be 로컬 빌드용: JAVA_HOME + PATH 설정 (Eclipse Temurin 17)
# 사용: .\set-java.ps1   또는  & .\set-java.ps1
$jdkPath = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
if (-not (Test-Path $jdkPath)) {
    $jdkPath = (Get-ChildItem "C:\Program Files\Eclipse Adoptium\jdk-*-hotspot" -ErrorAction SilentlyContinue | Select-Object -First 1).FullName
}
if ($jdkPath) {
    $env:JAVA_HOME = $jdkPath
    $env:Path = "$jdkPath\bin;" + $env:Path
    Write-Host "JAVA_HOME=$env:JAVA_HOME"
    & "$jdkPath\bin\java.exe" -version
} else {
    Write-Error "Eclipse Adoptium JDK 17 not found under C:\Program Files\Eclipse Adoptium"
}
