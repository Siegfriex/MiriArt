package com.miriart.api.domain.community.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.miriart.api.domain.community.entity.Answer;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

import static com.miriart.api.domain.community.dto.PostFeedResponse.parseJsonArray;

/**
 * 답변 응답 DTO. FE answerSchema (community.ts:60-71) 매핑.
 */
@Getter
@Builder
public class AnswerResponse {

    private String id;
    private String postId;
    private PersonaResponse persona;
    private int reputationLevel;
    private String content;
    private List<String> imageUrls;
    private int likeCount;
    @JsonProperty("isAccepted")
    private boolean accepted;
    private int commentCount;
    private String createdAt;

    public static AnswerResponse from(Answer a, int commentCount) {
        return AnswerResponse.builder()
                .id(String.valueOf(a.getId()))
                .postId(String.valueOf(a.getPost().getId()))
                .persona(PersonaResponse.from(a.getPersona()))
                .reputationLevel(a.getUser().getReputationLevel())
                .content(a.getContent())
                .imageUrls(parseJsonArray(a.getImageUrls()))
                .likeCount(a.getLikeCount())
                .accepted(a.isAccepted())
                .commentCount(commentCount)
                .createdAt(a.getCreatedAt().toString())
                .build();
    }
}
