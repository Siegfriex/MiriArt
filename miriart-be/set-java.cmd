@echo off
REM miriart-be 로컬 빌드용: JAVA_HOME + PATH 설정 (Eclipse Temurin 17)
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
if not exist "%JAVA_HOME%" for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-*-hotspot") do set "JAVA_HOME=%%d" & goto :done
:done
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo JAVA_HOME=%JAVA_HOME%
java -version
