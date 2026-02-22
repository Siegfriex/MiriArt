package com.miriart.api.domain.user.repository;

import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 사용자 JPA 리포지토리. provider+providerUserId 조회, 닉네임 존재 여부.
 *
 * <p>연계: {@link com.miriart.api.domain.auth.oauth2.CustomOAuth2UserService} findByProviderAndProviderUserId, {@link com.miriart.api.domain.user.service.UserService} existsByNickname·findById.</p>
 *
 * @author MiriArt Team
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByProviderAndProviderUserId(LoginProvider provider, String providerUserId);

    boolean existsByNickname(String nickname);
}
