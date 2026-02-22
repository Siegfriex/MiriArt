package com.miriart.api.domain.auth.oauth2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Redis에 저장되는 OAuth2 1회용 인가 코드 페이로드 (userId, email, provider). JSON 직렬화/역직렬화.
 *
 * <p>연계: {@link OAuth2LoginSuccessHandler}가 toJson()으로 Redis 저장 → FE가 code로 /api/auth/token 호출 시 {@link OAuth2TokenExchangeService}가 getAndDeleteOAuth2Code 후 fromJson()으로 복원.</p>
 *
 * @author MiriArt Team
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2AuthCodePayload {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private Long userId;
    private String email;
    private String provider;

    public static OAuth2AuthCodePayload of(Long userId, String email, String provider) {
        return new OAuth2AuthCodePayload(userId, email, provider);
    }

    public String toJson() {
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("OAuth2AuthCodePayload 직렬화 실패", e);
        }
    }

    public static OAuth2AuthCodePayload fromJson(String json) {
        try {
            return objectMapper.readValue(json, OAuth2AuthCodePayload.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("OAuth2AuthCodePayload 역직렬화 실패", e);
        }
    }
}
