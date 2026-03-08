-- MiriArt Prod 마이그레이션: Community C1 배포 전 실행
-- 기준: BE/community 브랜치, 2026-03-08
-- 대상: miriart_prod (Cloud SQL)
-- 실행: gcloud sql connect 또는 Cloud SQL Studio에서 실행

-- ===========================================
-- 1. analyses.analysis_type varchar(50) 확장
--    (이전 세션에서 코드 수정 완료, prod DB가 varchar(10)이면 기동 실패)
-- ===========================================
ALTER TABLE analyses MODIFY COLUMN analysis_type varchar(50) NOT NULL;

-- ===========================================
-- 2. posts.comment_count 컬럼 추가
--    (C1 커뮤니티 리팩토링에서 Post 엔티티에 추가, prod DB에 없으면 기동 실패)
-- ===========================================
ALTER TABLE posts ADD COLUMN comment_count int NOT NULL DEFAULT 0 AFTER answer_count;

-- ===========================================
-- 3. 성능 인덱스 추가 (Post 엔티티 @Index 선언에 대응)
--    Hibernate validate는 인덱스 미검증이므로 기동에는 영향 없으나, 피드 정렬/필터 성능에 필요
-- ===========================================
-- type + status 필터 (피드 type 필터)
CREATE INDEX idx_type_status ON posts (type, status);
-- grade + domain + created_at (scope 필터 + latest 정렬)
CREATE INDEX idx_scope_created ON posts (grade_scope, domain_scope, created_at);
-- popular 정렬
CREATE INDEX idx_popularity ON posts (like_count, answer_count, created_at);

-- ===========================================
-- 검증 쿼리
-- ===========================================
-- SHOW COLUMNS FROM analyses WHERE Field = 'analysis_type';
-- SHOW COLUMNS FROM posts WHERE Field = 'comment_count';
-- SHOW INDEX FROM posts;
