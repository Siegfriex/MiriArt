-- MiriArt Prod 마이그레이션: Community C1 배포 전 실행
-- 기준: BE/community 브랜치, 2026-03-08
-- 대상: miriart_prod (Cloud SQL)
-- 실행: gcloud sql connect 또는 Cloud SQL Studio에서 실행
--
-- !! 주의: 최초 1회만 실행. 이미 적용된 prod에서 재실행 시
--    "Duplicate column name" / "Duplicate key name" 에러 발생.
--    재실행이 필요하면 아래 확인 쿼리로 존재 여부 체크 후 해당 DDL만 선택 실행할 것.

-- ===========================================
-- 1. analyses.analysis_type varchar(50) 확장
--    (이전 세션에서 코드 수정 완료, prod DB가 varchar(10)이면 기동 실패)
--    확인: SHOW COLUMNS FROM analyses WHERE Field = 'analysis_type';
--    → Type이 이미 varchar(50)이면 스킵
-- ===========================================
ALTER TABLE analyses MODIFY COLUMN analysis_type varchar(50) NOT NULL;

-- ===========================================
-- 2. posts.comment_count 컬럼 추가
--    (C1 커뮤니티 리팩토링에서 Post 엔티티에 추가, prod DB에 없으면 기동 실패)
--    확인: SHOW COLUMNS FROM posts WHERE Field = 'comment_count';
--    → 결과가 있으면 스킵
--    참고: 현재 댓글 작성 API(CommentController)는 미구현이므로 값은 항상 0.
--          C2에서 댓글 API 추가 시 incrementCommentCount 갱신 로직 필수.
-- ===========================================
ALTER TABLE posts ADD COLUMN comment_count int NOT NULL DEFAULT 0 AFTER answer_count;

-- ===========================================
-- 3. 성능 인덱스 추가 (Post 엔티티 @Index 선언에 대응)
--    Hibernate validate는 인덱스 미검증이므로 기동에는 영향 없으나, 피드 정렬/필터 성능에 필요
--    확인: SHOW INDEX FROM posts WHERE Key_name IN ('idx_type_status','idx_scope_created','idx_popularity');
--    → 해당 인덱스가 이미 있으면 스킵
-- ===========================================
-- type + status 필터 (피드 type 필터)
CREATE INDEX idx_type_status ON posts (type, status);
-- grade + domain + created_at (scope 필터 + latest 정렬)
CREATE INDEX idx_scope_created ON posts (grade_scope, domain_scope, created_at);
-- popular 정렬
CREATE INDEX idx_popularity ON posts (like_count, answer_count, created_at);

-- ===========================================
-- 4. posts.content, answers.content → TEXT 변경
--    @Lob → tinytext(255B) 매핑 이슈. ERD 설계는 TEXT(64KB).
--    255바이트 초과 게시글/답변 작성 시 DataTruncation 발생.
--    확인: SHOW COLUMNS FROM posts WHERE Field = 'content';
--    → Type이 이미 text이면 스킵
-- ===========================================
ALTER TABLE posts MODIFY COLUMN content text NOT NULL;
ALTER TABLE answers MODIFY COLUMN content text NOT NULL;

-- ===========================================
-- 검증 쿼리 (적용 후 실행)
-- ===========================================
-- SHOW COLUMNS FROM analyses WHERE Field = 'analysis_type';
-- SHOW COLUMNS FROM posts WHERE Field = 'comment_count';
-- SHOW COLUMNS FROM posts WHERE Field = 'content';
-- SHOW COLUMNS FROM answers WHERE Field = 'content';
-- SHOW INDEX FROM posts;
