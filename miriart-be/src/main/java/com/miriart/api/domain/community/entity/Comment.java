package com.miriart.api.domain.community.entity;

import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 댓글 엔티티. comments 테이블 매핑. parentType+parentId로 게시글 또는 답변에 소속.
 *
 * <p>연계: {@link CommentParentType} POST/ANSWER, {@link CommentRepository#findByParentTypeAndParentIdOrderByCreatedAtAsc}. Phase C1 구현 예정.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "comments",
        indexes = {
                @Index(name = "idx_parent", columnList = "parent_type, parent_id, created_at")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "parent_type", nullable = false, length = 10)
    private CommentParentType parentType;

    @Column(name = "parent_id", nullable = false)
    private Long parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @Column(nullable = false, length = 500)
    private String content;

    @Builder
    public Comment(CommentParentType parentType, Long parentId,
                   User user, Persona persona, String content) {
        this.parentType = parentType;
        this.parentId = parentId;
        this.user = user;
        this.persona = persona;
        this.content = content;
    }
}
