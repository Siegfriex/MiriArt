package com.miriart.api.domain.community.dto;

import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostStatus;
import com.miriart.api.domain.community.entity.PostType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * GET /api/posts 목록 응답 DTO. 게시글 목록용 (엔티티 노출·LAZY 미접근).
 *
 * <p>연계: PostController에서 PostRepository.findAll(Pageable) 결과를 from(Post)로 변환해 반환.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Builder
public class PostListResponse {

    private Long id;
    private String title;
    private PostType type;
    private PostStatus status;
    private int viewCount;
    private int likeCount;
    private int answerCount;
    private LocalDateTime createdAt;

    public static PostListResponse from(Post post) {
        return PostListResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .type(post.getType())
                .status(post.getStatus())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .answerCount(post.getAnswerCount())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
