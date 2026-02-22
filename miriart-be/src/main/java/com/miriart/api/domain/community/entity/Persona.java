package com.miriart.api.domain.community.entity;

import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 가명(페르소나) 엔티티. personas 테이블. (user_id, board_scope) 유일 — 동일 스코프면 같은 가명 반환.
 *
 * <p>연계: {@link PersonaRepository#findByUserIdAndBoardScope}. Post·Answer·Comment에서 persona_id로 표시명 사용. Phase C1 구현 예정.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "personas",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_user_scope", columnNames = {"user_id", "board_scope"})
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Persona extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "board_scope", nullable = false, length = 100)
    private String boardScope;

    @Column(name = "display_name", nullable = false, length = 50)
    private String displayName;

    @Column(name = "color_token", length = 7)
    private String colorToken;

    @Builder
    public Persona(User user, String boardScope, String displayName, String colorToken) {
        this.user = user;
        this.boardScope = boardScope;
        this.displayName = displayName;
        this.colorToken = colorToken;
    }
}
