# MiriArt BE API 계약

이 문서는 FE ↔ BE API 계약을 정리합니다.

---

## 인증 실패 (401)

인증이 필요한 경로에 `Authorization` 헤더 없이 접근 시 **401 Unauthorized**. Body: `{"code":"AUTH001","message":"인증이 필요합니다."}` (JSON). 상세 인증·CORS는 `docs/SSOT/miriarts_infra.md` §4.2 참조.

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

---

## 목록 API 페이징·정렬

| API | page 기본값 | size 기본값 | size 상한 | sort 기본 |
|-----|-------------|-------------|-----------|-----------|
| GET /api/analyses | 0 | 20 | 100 | createdAt, DESC |
| GET /api/chat/sessions | 0 | 20 | 미제한 | (구현 기준) |
| GET /api/posts | cursor 기반 (page 없음) | 20 | (구현 기준) | (cursor·sort 파라미터) |

*소스: BE_CODE_AUDIT_GAP_REPORT_FINAL §2.1, AnalysisController, ChatSessionController, PostController*

---

## 엔드포인트·Request/Response·에러 참조 (코드 기준 SSOT)

전체 엔드포인트 목록·Request/Response 타입·검증·에러 코드 매핑의 **단일 기준**은 실 코드와 **docs/BE_CODE_AUDIT_GAP_REPORT_FINAL.md** §2.4.1(엔드포인트별 Request/Response 요약), §2.4.2(엔드포인트별 가능 에러 코드)이다. 본 문서의 "이미지 Signed URL", "목록 API 페이징·정렬" 등은 그 일부를 계약 관점에서 요약한 것이다.

| 경로 | 메서드 | Request (요약) | Response (요약) | 에러 참조 |
|------|--------|----------------|-----------------|-----------|
| /api/auth/token | POST | TokenExchangeRequest | TokenExchangeResponse | §2.4.2 |
| /api/auth/refresh | POST | (쿠키 refreshToken) | TokenRefreshResponse | §2.4.2 |
| /api/auth/logout | POST | (쿠키) | 204 | — |
| /api/users/me | GET | — | UserProfileResponse | §2.4.2 |
| /api/users/me/profile | PATCH | UserProfileUpdateRequest | UserProfileResponse | §2.4.2 |
| /api/users/me/plan | GET | — | UserPlanResponse | §2.4.2 |
| /api/analyses | POST | image, analysisType, problemText(optional) | AnalysisStartResponse 202 | §2.4.2 |
| /api/analyses | GET | Pageable | Page&lt;AnalysisDetailResponse&gt; | §2.4.2 |
| /api/analyses/{id} | GET | id | AnalysisDetailResponse | §2.4.2 |
| /api/images/{id}/url | GET | id(analysisId) | ImageUrlResponse | §2.4.2 (I001, F005) |
| /api/chat | POST | ChatRequest | ChatResponse | §2.4.2 |
| /api/chat/sessions | GET | page, size, grade | Page&lt;ChatSessionResponse&gt; | §2.4.2 |
| /api/posts | GET | type, sort, grade, domain, cursor, size | PostsFeedPageResponse | §2.4.2 |
| /api/posts/{id} | GET | id | PostDetailResponse | §2.4.2 |
| /api/posts | POST | CreatePostRequest | PostDetailResponse 201 | §2.4.2 |
| /api/posts/{id} | PUT | CreatePostRequest | PostDetailResponse | §2.4.2 |
| /api/posts/{id} | DELETE | — | 204 | §2.4.2 |
| /api/posts/{postId}/accept/{answerId} | POST | — | success | §2.4.2 |
| /api/posts/{postId}/answers | POST | CreateAnswerRequest | Long 201 | §2.4.2 |
| /api/posts/{postId}/answers/{answerId} | PUT/DELETE | CreateAnswerRequest / — | success / 204 | §2.4.2 |
| /api/likes/toggle | POST | LikeToggleRequest | LikeToggleResponse | §2.4.2 |
| /api/comments | POST | CreateCommentRequest | CommentResponse 201 | §2.4.2 |
| /api/comments/{id} | PUT/DELETE | CreateCommentRequest / — | CommentResponse / 204 | §2.4.2 |
| /api/posts/{postId}/report | POST | ReportRequest(optional) | success 201 | §2.4.2 |
| /api/answers/{answerId}/report | POST | ReportRequest(optional) | success 201 | §2.4.2 |

*상세 DTO 필드·검증·에러 코드 문자열은 BE_CODE_AUDIT_GAP_REPORT_FINAL §2.4, §2.4.1·§2.4.2 및 코드 기준.*
