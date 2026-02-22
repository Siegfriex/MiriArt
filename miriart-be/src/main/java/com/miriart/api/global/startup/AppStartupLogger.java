package com.miriart.api.global.startup;

import com.miriart.api.global.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 앱 기동 시 주요 빈 상태를 로그에 기록
 * Debug 계측 코드 — H1 (GCS 빈 기동 실패 여부) 검증용
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AppStartupLogger implements ApplicationRunner {

    private final FileStorageService fileStorageService;

    @Override
    public void run(ApplicationArguments args) {
        String implName = fileStorageService.getClass().getSimpleName();
        log.info("=== [MiriArt BE 기동 완료] FileStorageService 구현체: {} ===", implName);
    }
}
