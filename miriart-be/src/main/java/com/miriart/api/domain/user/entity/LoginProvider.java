package com.miriart.api.domain.user.entity;

/**
 * 소셜 로그인 제공자. Kakao / Google. OAuth2 registrationId와 대응.
 *
 * <p>연계: {@link User} provider 필드, {@link com.miriart.api.domain.auth.oauth2.CustomOAuth2UserService} provider 분기.</p>
 *
 * @author MiriArt Team
 */
public enum LoginProvider {
    KAKAO,
    GOOGLE
}
