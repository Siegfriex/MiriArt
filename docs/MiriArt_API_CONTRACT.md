# MiriArt BE API 계약

이 문서는 FE ↔ BE API 계약을 정리합니다.

---

## 이미지 Signed URL

### GET /api/images/{id}/url

- **Path**: `{id}` = analysisId (분석 결과에 연결된 이미지)
- **Auth**: Bearer JWT (로그인 필수)
- **Response 200**:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://storage.googleapis.com/miriart-bucket/artworks/...?X-Goog-Signature=...",
      "expiresAt": "2026-03-10T10:15:00Z"
    }
  }
  ```
- **Error**:
  - **404** I001 IMAGE_NOT_FOUND — 해당 분석이 없거나 본인 소유가 아님
  - **502** F005 IMAGE_URL_GENERATION_FAILED — GCS Signed URL 생성 실패
- **Note**:
  - `url`은 약 15분간 유효한 GCS v4 Signed URL이다.
  - FE는 이미지 표시 시 항상 이 엔드포인트를 통해 받은 `url`만 사용해야 한다.
  - 분석 결과 등에서 AI/내부적으로 사용하는 `imageUrl`(또는 기존 public URL)은 **BE 내부/메타 용도**이며, GCS 버킷은 비공개(403)이므로 Signed URL이 유일한 접근 경로이다.
