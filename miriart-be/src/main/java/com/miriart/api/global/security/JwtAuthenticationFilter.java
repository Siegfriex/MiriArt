package com.miriart.api.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT Access Token 인증 필터. 요청마다 Authorization Bearer 토큰 검증 후 SecurityContext 주입.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link com.miriart.api.global.config.SecurityConfig}에서 UsernamePasswordAuthenticationFilter 앞에 등록</li>
 *   <li>{@link JwtUtil}로 토큰 검증·userId·role 추출 후 Stateless 인증 객체 설정</li>
 *   <li>인증된 API(/api/chat, /api/analyses 등)에서 SecurityContextHolder로 현재 사용자 ID·권한 조회</li>
 * </ul>
 *
 * <p>MiriArt 신규 작성.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (StringUtils.hasText(token) && jwtUtil.validateAccessToken(token)) {
            Long userId = jwtUtil.getUserIdFromAccessToken(token);
            // role claim에서 권한 추출 — DB 조회 없이 stateless (Bug #3 Fix)
            String role = jwtUtil.getRoleFromAccessToken(token);
            String authority = "ROLE_" + (role != null ? role : "USER");
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(new SimpleGrantedAuthority(authority))
                    );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("JWT 인증 성공, userId: {}, role: {}", userId, authority);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }
}
