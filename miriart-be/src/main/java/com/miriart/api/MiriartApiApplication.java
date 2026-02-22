package com.miriart.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * MiriArt 백엔드 Spring Boot 진입점. FE는 JWT로 /api/* 호출, 내부적으로 FastAPI AI 서비스·MySQL·Redis·GCS 연동.
 *
 * @author MiriArt Team
 */
@SpringBootApplication
public class MiriartApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiriartApiApplication.class, args);
    }
}
