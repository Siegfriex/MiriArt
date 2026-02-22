package com.miriart.api.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * PATCH /api/users/me/profile 요청 DTO
 */
@Getter
@NoArgsConstructor
public class UserProfileUpdateRequest {

    @NotBlank(message = "닉네임은 필수입니다")
    @Size(min = 2, max = 20, message = "닉네임은 2~20자여야 합니다")
    private String nickname;

    @NotBlank(message = "학년은 필수입니다")
    @Pattern(regexp = "^(고1|고2|고3|재수|N수)$", message = "유효하지 않은 학년입니다")
    private String grade;

    @NotBlank(message = "도메인은 필수입니다")
    @Pattern(regexp = "^(기초디자인|기초소양|수채화|소묘|사고의전환|만화·애니)$", message = "유효하지 않은 도메인입니다")
    private String domain;
}
