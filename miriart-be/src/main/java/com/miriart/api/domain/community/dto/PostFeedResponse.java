package com.miriart.api.domain.community.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.community.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.util.Collections;
import java.util.List;

/**
 * 피드 목록 응답 DTO. FE postSchema (community.ts:13-31) 전체 17필드 매핑.
 */
@Getter
@Builder
public class PostFeedResponse {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final int CONTENT_TRUNCATE_LENGTH = 200;

    private String id;
    private String type;
    private String status;
    private String title;
    private String content;
    private String grade;
    private String domain;
    private List<String> tags;
    private List<String> imageUrls;
    private int likeCount;
    private int answerCount;
    private int commentCount;
    private String createdAt;
    private PersonaResponse persona;
    private int reputationLevel;
    private String deadlineAt;
    private Boolean isLiked;

    public static PostFeedResponse from(Post post, Boolean isLiked) {
        return PostFeedResponse.builder()
                .id(String.valueOf(post.getId()))
                .type(post.getType().name().toLowerCase())
                .status(post.getStatus().name())
                .title(post.getTitle())
                .content(truncate(post.getContent(), CONTENT_TRUNCATE_LENGTH))
                .grade(nullToEmpty(post.getGradeScope()))
                .domain(nullToEmpty(post.getDomainScope()))
                .tags(parseJsonArray(post.getTags()))
                .imageUrls(parseJsonArray(post.getImageUrls()))
                .likeCount(post.getLikeCount())
                .answerCount(post.getAnswerCount())
                .commentCount(post.getCommentCount())
                .createdAt(post.getCreatedAt().toString())
                .persona(PersonaResponse.from(post.getPersona()))
                .reputationLevel(post.getUser().getReputationLevel())
                .deadlineAt(post.getDeadlineAt() != null ? post.getDeadlineAt().toString() : null)
                .isLiked(isLiked)
                .build();
    }

    static String truncate(String text, int maxLen) {
        if (text == null) return "";
        return text.length() <= maxLen ? text : text.substring(0, maxLen) + "...";
    }

    static String nullToEmpty(String s) {
        return s != null ? s : "";
    }

    static List<String> parseJsonArray(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return MAPPER.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}
