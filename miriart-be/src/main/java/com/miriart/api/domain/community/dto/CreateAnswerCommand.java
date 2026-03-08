package com.miriart.api.domain.community.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * QnA 답변 작성 커맨드. createAnswer 서비스 입력.
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class CreateAnswerCommand {

    private final Long postId;
    private final String content;
    private final String imageUrls; // optional, JSON string. null 가능
}
