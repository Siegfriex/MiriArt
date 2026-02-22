package com.miriart.api.domain.auth.oauth2;

import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * OAuth2 사용자 정보 로딩 서비스. Kakao·Google provider 분기, 사용자 조회/생성 후 MiriartOAuth2User 반환.
 *
 * <p>연계 구조:</p>
 * <ul>
 *   <li>{@link com.miriart.api.global.config.SecurityConfig} oauth2Login.userInfoEndpoint에서 등록</li>
 *   <li>로그인 성공 시 {@link OAuth2LoginSuccessHandler}가 Redis에 code 저장 후 FE 리다이렉트</li>
 *   <li>{@link User} findByProviderAndProviderUserId 또는 save로 신규 생성 → {@link MiriartOAuth2User}로 래핑</li>
 * </ul>
 *
 * <p>Cariv 이식 + 구글 provider 추가.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.debug("OAuth2 로그인 시도 - provider: {}", registrationId);

        String providerUserId;
        String email;

        if ("kakao".equals(registrationId)) {
            // 카카오: attributes 구조 = { id: 123, kakao_account: { email, profile: { nickname } } }
            providerUserId = String.valueOf(attributes.get("id"));
            email = extractKakaoEmail(attributes);

        } else if ("google".equals(registrationId)) {
            // 구글: attributes 구조 = { sub: "...", email: "...", name: "..." }
            providerUserId = (String) attributes.get("sub");
            email = (String) attributes.get("email");

        } else {
            throw new BusinessException(ErrorCode.OAUTH_PROVIDER_UNSUPPORTED);
        }

        LoginProvider provider = LoginProvider.valueOf(registrationId.toUpperCase());
        User user = findOrCreateUser(provider, providerUserId, email);

        log.debug("OAuth2 사용자 로드 완료 - userId: {}, provider: {}", user.getId(), registrationId);
        return new MiriartOAuth2User(user, attributes);
    }

    @SuppressWarnings("unchecked")
    private String extractKakaoEmail(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) {
            return null;
        }
        Boolean emailAgreement = (Boolean) kakaoAccount.get("email_needs_agreement");
        if (Boolean.TRUE.equals(emailAgreement)) {
            // 이메일 동의 미완료 → null 허용 (닉네임으로 대체)
            return null;
        }
        return (String) kakaoAccount.get("email");
    }

    private User findOrCreateUser(LoginProvider provider, String providerUserId, String email) {
        return userRepository.findByProviderAndProviderUserId(provider, providerUserId)
                .orElseGet(() -> {
                    log.info("신규 사용자 생성 - provider: {}, providerUserId: {}", provider, providerUserId);
                    return userRepository.save(
                            User.builder()
                                    .provider(provider)
                                    .providerUserId(providerUserId)
                                    .email(email)
                                    .build()
                    );
                });
    }
}
