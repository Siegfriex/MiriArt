package com.miriart.api.domain.user.entity;

/**
 * 사용자 역할. USER / ADMIN. JWT Access 토큰 role claim 및 권한 체크에 사용.
 *
 * <p>연계: {@link User} 엔티티, {@link com.miriart.api.global.security.JwtUtil} createAccessToken, SecurityContext 권한.</p>
 *
 * @author MiriArt Team
 */
public enum UserRole {
    USER,
    ADMIN
}
