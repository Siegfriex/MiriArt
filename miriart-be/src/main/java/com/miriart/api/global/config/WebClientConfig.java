package com.miriart.api.global.config;

import io.netty.channel.ChannelOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

/**
 * FastAPI 내부 호출용 WebClient 빈 설정.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>설정 키 {@code miriart.fastapi.internal-url} (기본 http://localhost:8000)로 FastAPI AI 서비스 Base URL 지정</li>
 *   <li>{@link com.miriart.api.domain.ai.service.AiProxyService} 등에서 이 WebClient로 /internal/ai/chat, /analyze, /edit-image 호출</li>
 *   <li>연결 타임아웃 5초, 응답 타임아웃 35초, 최대 인메모리 10MB</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Configuration
public class WebClientConfig {

    private static final int CONNECT_TIMEOUT_MS = 5_000;
    private static final int RESPONSE_TIMEOUT_SECONDS = 35;

    @Value("${miriart.fastapi.internal-url:http://localhost:8000}")
    private String fastapiInternalUrl;

    @Bean
    public WebClient fastapiWebClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(RESPONSE_TIMEOUT_SECONDS))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, CONNECT_TIMEOUT_MS);

        return WebClient.builder()
                .baseUrl(fastapiInternalUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))  // 10MB
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
