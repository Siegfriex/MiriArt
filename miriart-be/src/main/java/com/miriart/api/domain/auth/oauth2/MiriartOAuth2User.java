package com.miriart.api.domain.auth.oauth2;

import com.miriart.api.domain.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * OAuth2 로그인 성공 후 SecurityContext에 저장되는 Principal. User 엔티티 기반 래퍼.
 *
 * <p>연계: {@link CustomOAuth2UserService#loadUser} 반환 타입. {@link OAuth2LoginSuccessHandler}에서 getUserId 등으로 Redis 페이로드 생성.</p>
 *
 * <p>Cariv CarivOAuth2User 이식 (클래스명·필드 변경).</p>
 *
 * @author MiriArt Team
 */
@Getter
public class MiriartOAuth2User implements OAuth2User {

    private final Long userId;
    private final String email;
    private final String provider;
    private final boolean needsProfile;
    private final Map<String, Object> attributes;

    public MiriartOAuth2User(User user, Map<String, Object> attributes) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.provider = user.getProvider().name().toLowerCase();
        this.needsProfile = user.isNeedsProfile();
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return String.valueOf(userId);
    }
}
