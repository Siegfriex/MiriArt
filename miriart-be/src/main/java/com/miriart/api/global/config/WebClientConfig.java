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
 * WebClient 설정
 * FastAPI 내부 호출용 빈 추가 (BE_SETUP_GUIDE §9 기반)
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
