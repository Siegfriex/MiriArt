package com.miriart.api.global.startup;

import com.miriart.api.global.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 앱 기동 시 주요 빈 상태를 로그에 기록하는 ApplicationRunner.
 *
 * <p>연계: 기동 완료 후 {@link FileStorageService} 구현체 클래스명 로그 출력.
 * dev면 MockFileStorageService, 프로덕션이면 GcsFileStorageService 확인용 (H1 검증).</p>
 *
 * @author MiriArt Team
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
