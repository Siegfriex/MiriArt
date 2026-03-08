-- =============================================================
-- MiriArt 프로덕션 마이그레이션 C2: reports 테이블
-- 실행 대상: miriarts:asia-northeast3:miriart-mysql
-- 실행 시점: C2 배포 직전
-- 참고: 피드 인덱스(idx_popularity, idx_scope_created, idx_type_status)는
--       migrate-prod-c1.sql에서 이미 생성됨. 재생성 불필요.
-- =============================================================

-- 1. reports 테이블 생성
--    확인: SHOW TABLES LIKE 'reports';
--    → 결과가 있으면 스킵
CREATE TABLE IF NOT EXISTS `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  `target_type` enum('POST','ANSWER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` bigint NOT NULL,
  `reason` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_report` (`user_id`,`target_type`,`target_id`),
  KEY `idx_report_target` (`target_type`,`target_id`),
  CONSTRAINT `fk_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- 검증 쿼리 (적용 후 실행)
-- ===========================================
-- SHOW TABLES LIKE 'reports';
-- DESCRIBE reports;
