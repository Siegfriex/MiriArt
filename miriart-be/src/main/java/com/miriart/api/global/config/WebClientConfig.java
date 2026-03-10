package com.miriart.api.global.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.IdTokenCredentials;
import com.google.auth.oauth2.IdTokenProvider;
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.io.IOException;
import java.time.Duration;

/**
 * FastAPI 내부 호출용 WebClient 빈 설정.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>설정 키 {@code miriart.fastapi.internal-url} (기본 http://localhost:8000)로 FastAPI AI 서비스 Base URL 지정</li>
 *   <li>{@link com.miriart.api.domain.ai.service.AiProxyService} 등에서 이 WebClient로 /internal/ai/chat, /analyze 호출</li>
 *   <li>연결 타임아웃 5초, 응답 타임아웃 35초, 최대 인메모리 10MB</li>
 * </ul>
 *
 * <p>프로파일 분기:</p>
 * <ul>
 *   <li>{@code !dev}: Cloud Run SA 기반 OIDC ID Token 인증 필터 포함</li>
 *   <li>{@code dev}: 인증 없음 (로컬 개발용, GCP credentials 불필요)</li>
 * </ul>
 *
 * @author MiriArt Team
 */
@Slf4j
@Configuration
public class WebClientConfig {

    private static final int CONNECT_TIMEOUT_MS = 5_000;
    private static final int RESPONSE_TIMEOUT_SECONDS = 65;

    @Value("${miriart.fastapi.internal-url:http://localhost:8000}")
    private String fastapiInternalUrl;

    /**
     * Prod WebClient: OIDC ID Token 인증 필터 포함.
     * Cloud Run SA 메타데이터 서버에서 자동으로 credentials 획득.
     */
    @Bean("fastapiWebClient")
    @Profile("!dev")
    public WebClient fastapiWebClientProd() {
        return buildBaseWebClient()
                .filter(oidcAuthFilter())
                .build();
    }

    /**
     * Dev WebClient: 인증 없음 (로컬에 SA credentials 불필요).
     */
    @Bean("fastapiWebClient")
    @Profile("dev")
    public WebClient fastapiWebClientDev() {
        return buildBaseWebClient()
                .build();
    }

    private WebClient.Builder buildBaseWebClient() {
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(RESPONSE_TIMEOUT_SECONDS))
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, CONNECT_TIMEOUT_MS);

        return WebClient.builder()
                .baseUrl(fastapiInternalUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))  // 10MB
                .clientConnector(new ReactorClientHttpConnector(httpClient));
    }

    /**
     * Cloud Run 서비스 간 인증용 OIDC ID Token ExchangeFilter.
     * GoogleCredentials.getApplicationDefault() → IdTokenCredentials → Authorization: Bearer 헤더 주입.
     * 토큰은 ~1시간 유효, refreshIfExpired()가 내부 캐싱 처리.
     */
    private ExchangeFilterFunction oidcAuthFilter() {
        return ExchangeFilterFunction.ofRequestProcessor(request -> {
            try {
                String idToken = obtainIdToken();
                ClientRequest authedRequest = ClientRequest.from(request)
                        .headers(h -> h.setBearerAuth(idToken))
                        .build();
                return Mono.just(authedRequest);
            } catch (IOException e) {
                log.error("OIDC ID Token 획득 실패: {}", e.getMessage(), e);
                return Mono.error(e);
            }
        });
    }

    private String obtainIdToken() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();

        if (!(credentials instanceof IdTokenProvider)) {
            throw new IOException(
                    "SA credentials do not support ID token generation. "
                            + "Actual type: " + credentials.getClass().getSimpleName());
        }

        IdTokenCredentials idTokenCredentials = IdTokenCredentials.newBuilder()
                .setIdTokenProvider((IdTokenProvider) credentials)
                .setTargetAudience(fastapiInternalUrl)
                .build();

        idTokenCredentials.refreshIfExpired();
        return idTokenCredentials.getIdToken().getTokenValue();
    }
}
