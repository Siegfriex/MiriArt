package com.miriart.api.domain.community.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.miriart.api.domain.community.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

import static com.miriart.api.domain.community.dto.PostFeedResponse.*;

/**
 * 게시글 상세 응답 DTO. FE postDetailSchema (community.ts:86-89) 매핑.
 * PostFeedResponse 17필드 + answers + comments.
 * NON_NULL: null 필드(isLiked, deadlineAt)를 JSON에서 제외 → FE Zod .optional()과 정합.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostDetailResponse {

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
    private List<AnswerResponse> answers;
    private List<CommentResponse> comments;

    public static PostDetailResponse from(Post post, Boolean isLiked,
                                          List<AnswerResponse> answers,
                                          List<CommentResponse> comments) {
        return PostDetailResponse.builder()
                .id(String.valueOf(post.getId()))
                .type(post.getType().name().toLowerCase())
                .status(post.getStatus().name())
                .title(post.getTitle())
                .content(post.getContent())
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
                .answers(answers)
                .comments(comments)
                .build();
    }
}
