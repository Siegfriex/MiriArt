#!/usr/bin/env bash
# BE Signed URL 파이프라인 헬스체크 스크립트.
# 로컬(Docker compose) 및 스테이징 Cloud Run 공용.
# 사용: BASE_URL=<BE_BASE> TOKEN=<JWT> [VALID_ANALYSIS_ID=<id>] [BAD_GCS_ANALYSIS_ID=<id>] ./healthcheck_images.sh

set -e

usage() {
  echo "Usage: BASE_URL=<url> TOKEN=<bearer_token> [VALID_ANALYSIS_ID=<id>] [BAD_GCS_ANALYSIS_ID=<id>] $0"
  echo "  BASE_URL              (필수) BE 기본 URL (예: https://xxx.run.app 또는 http://localhost:8080)"
  echo "  TOKEN                 (필수) Bearer JWT (Bearer 접두사 없이)"
  echo "  VALID_ANALYSIS_ID     (선택) 본인 소유 정상 analysisId → 200 기대"
  echo "  BAD_GCS_ANALYSIS_ID   (선택) 비정상 gcsUrl 분석 id → 502 F005 기대"
  exit 1
}

if [ -z "${BASE_URL}" ] || [ -z "${TOKEN}" ]; then
  usage
fi

# 끝 슬래시 제거
BASE_URL="${BASE_URL%/}"
AUTH_HEADER="Authorization: Bearer ${TOKEN}"

summary() {
  local path="$1"
  local code="$2"
  echo "${code} ${path}"
}

# (1) 정상 케이스 — 200
if [ -n "${VALID_ANALYSIS_ID}" ]; then
  path="/api/images/${VALID_ANALYSIS_ID}/url"
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "${AUTH_HEADER}" "${BASE_URL}${path}")
  summary "${path}" "${code}"
fi

# (2) 404 — 존재하지 않는 id
path_404="/api/images/99999999/url"
code_404=$(curl -s -o /dev/null -w "%{http_code}" -H "${AUTH_HEADER}" "${BASE_URL}${path_404}")
summary "${path_404}" "${code_404}"

# (3) 옵션: 502 F005 — 비정상 gcsUrl 분석 id
if [ -n "${BAD_GCS_ANALYSIS_ID}" ]; then
  path_502="/api/images/${BAD_GCS_ANALYSIS_ID}/url"
  code_502=$(curl -s -o /dev/null -w "%{http_code}" -H "${AUTH_HEADER}" "${BASE_URL}${path_502}")
  summary "${path_502}" "${code_502}"
fi
