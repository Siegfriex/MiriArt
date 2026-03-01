-- 로컬 prod 재현용: miriart_prod DB 및 miriart 계정 생성
-- MySQL root로 실행: mysql -u root -p < scripts/init-miriart-prod-local.sql
-- 또는 Docker: docker exec -i <mysql_container> mysql -u root -p < scripts/init-miriart-prod-local.sql

CREATE DATABASE IF NOT EXISTS miriart_prod
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'miriart'@'localhost' IDENTIFIED BY 'MiriArt!!!';
CREATE USER IF NOT EXISTS 'miriart'@'%' IDENTIFIED BY 'MiriArt!!!';
-- Docker 호스트에서 접속 시 출발지 IP(예: 172.17.0.1)에도 권한 필요
CREATE USER IF NOT EXISTS 'miriart'@'172.17.0.1' IDENTIFIED BY 'MiriArt!!!';

GRANT ALL PRIVILEGES ON miriart_prod.* TO 'miriart'@'localhost';
GRANT ALL PRIVILEGES ON miriart_prod.* TO 'miriart'@'%';
GRANT ALL PRIVILEGES ON miriart_prod.* TO 'miriart'@'172.17.0.1';

FLUSH PRIVILEGES;
