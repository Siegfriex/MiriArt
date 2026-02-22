package com.miriart.api.global.config;

import com.miriart.api.domain.auth.oauth2.CustomOAuth2UserService;
import com.miriart.api.domain.auth.oauth2.OAuth2LoginSuccessHandler;
import com.miriart.api.global.security.JwtAuthenticationFilter;
import com.miriart.api.global.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 (OAuth2 + JWT Stateless).
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>OAuth2 로그인: {@link CustomOAuth2UserService}, {@link OAuth2LoginSuccessHandler}로 Kakao/Google 로그인 후 JWT 발급</li>
 *   <li>API 인증: {@link JwtAuthenticationFilter}가 Authorization Bearer 토큰 검증 후 SecurityContext 주입</li>
 *   <li>공개 경로: /api/auth/**, /oauth2/**, GET /api/posts/**, GET /api/answers/**, swagger, actuator/health</li>
 *   <li>그 외 요청은 인증 필요 (FE는 JWT로 /api/* 호출)</li>
 * </ul>
 *
 * <p>Cariv SecurityConfig 수정 복사: SessionCreationPolicy.STATELESS, Google OAuth2, JwtAuthenticationFilter, MiriArt 경로 규칙 (BE_SETUP_GUIDE §4.2)</p>
 *
 * @author MiriArt Team
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final JwtUtil jwtUtil;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public — 인증 불필요
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/answers/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        // 인증 필요
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(ui -> ui.userService(customOAuth2UserService))
                        .successHandler(oAuth2LoginSuccessHandler)
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
