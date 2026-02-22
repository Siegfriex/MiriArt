package com.miriart.api.domain.community.entity;

import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Q&A 답변 엔티티. answers 테이블 매핑. Post 1:N, 채택 시 is_accepted true.
 *
 * <p>연계: {@link AnswerRepository}로 게시글별 답변 목록·채택 여부 조회. Post 채택 시 {@link #accept} 호출. Phase C1 구현 예정.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "answers",
        indexes = {
                @Index(name = "idx_post_created", columnList = "post_id, created_at"),
                @Index(name = "idx_post_accepted", columnList = "post_id, is_accepted")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Answer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "image_urls", columnDefinition = "JSON")
    private String imageUrls;

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0;

    @Column(name = "is_accepted", nullable = false)
    private boolean accepted = false;

    @Builder
    public Answer(Post post, User user, Persona persona, String content, String imageUrls) {
        this.post = post;
        this.user = user;
        this.persona = persona;
        this.content = content;
        this.imageUrls = imageUrls;
    }

    public void accept() {
        this.accepted = true;
    }
}
