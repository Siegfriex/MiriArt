package com.miriart.api.global.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 비동기 이벤트 로깅용 스레드 풀 설정.
 * Cloud Run vCPU=1 기준 보수적 세팅. 큐 포화 시 이벤트 유실 허용 (비즈니스 영향 0).
 */
@Slf4j
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean("eventExecutor")
    public Executor eventExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("event-");
        executor.setRejectedExecutionHandler(logAndDiscardPolicy());
        executor.initialize();
        return executor;
    }

    private RejectedExecutionHandler logAndDiscardPolicy() {
        return (runnable, executor) ->
                log.warn("Event executor queue full — discarding event task. " +
                        "pool={}, active={}, queue={}",
                        executor.getPoolSize(),
                        executor.getActiveCount(),
                        executor.getQueue().size());
    }
}
