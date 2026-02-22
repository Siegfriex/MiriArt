package com.miriart.api.domain.community.entity;

import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 커뮤니티 게시글 엔티티 (ERD_v2 posts 테이블)
 * Phase C1 구현 예정 — 현재 Entity + Repository 뼈대만
 */
@Getter
@Entity
@Table(name = "posts",
        indexes = {
                @Index(name = "idx_type_status", columnList = "type, status"),
                @Index(name = "idx_scope_created", columnList = "grade_scope, domain_scope, created_at"),
                @Index(name = "idx_popularity", columnList = "like_count, answer_count, created_at")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    private PostType type = PostType.FREE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private PostStatus status = PostStatus.OPEN;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "grade_scope", length = 10)
    private String gradeScope;

    @Column(name = "domain_scope", length = 30)
    private String domainScope;

    @Column(columnDefinition = "JSON")
    private String tags;

    @Column(name = "image_urls", columnDefinition = "JSON")
    private String imageUrls;

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0;

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0;

    @Column(name = "answer_count", nullable = false)
    private int answerCount = 0;

    @Column(name = "accepted_answer_id")
    private Long acceptedAnswerId;

    @Column(name = "deadline_at")
    private LocalDateTime deadlineAt;

    @Builder
    public Post(User user, Persona persona, PostType type, String title, String content,
                String gradeScope, String domainScope, String tags, String imageUrls,
                LocalDateTime deadlineAt) {
        this.user = user;
        this.persona = persona;
        this.type = type;
        this.title = title;
        this.content = content;
        this.gradeScope = gradeScope;
        this.domainScope = domainScope;
        this.tags = tags;
        this.imageUrls = imageUrls;
        this.deadlineAt = deadlineAt;
    }

    /**
     * Q&A 채택 완료 처리
     */
    public void accept(Long answerId) {
        this.status = PostStatus.SOLVED;
        this.acceptedAnswerId = answerId;
    }

    /**
     * 마감 처리 (미채택)
     */
    public void expire() {
        this.status = PostStatus.EXPIRED;
    }
}
