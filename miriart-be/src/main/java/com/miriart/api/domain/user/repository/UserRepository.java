package com.miriart.api.domain.user.repository;

import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 사용자 JPA 리포지토리. provider+providerUserId 조회, 닉네임 존재 여부.
 *
 * <p>연계: {@link com.miriart.api.domain.auth.oauth2.CustomOAuth2UserService} findByProviderAndProviderUserId, {@link com.miriart.api.domain.user.service.UserService} existsByNickname·findByIdOrThrow.</p>
 *
 * @author MiriArt Team
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByProviderAndProviderUserId(LoginProvider provider, String providerUserId);

    boolean existsByNickname(String nickname);

    /**
     * ID로 조회, 없으면 MEMBER_NOT_FOUND 예외. 서비스 레이어 반복 패턴 제거용.
     */
    default User findByIdOrThrow(Long id) {
        return findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));
    }
}
