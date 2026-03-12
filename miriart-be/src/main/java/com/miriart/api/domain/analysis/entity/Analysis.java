package com.miriart.api.domain.analysis.entity;

import com.miriart.api.domain.user.entity.User;
import com.miriart.api.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 작품 분석 결과 엔티티. analyses 테이블 매핑.
 *
 * <p>연계: {@link AnalysisService}가 PENDING으로 저장 후 FastAPI 응답으로 complete/fail 호출.
 * {@link AnalysisRepository}로 사용자별 조회·페이지 조회. scores·universityPredictions는 JSON 문자열 저장.</p>
 *
 * <h3>Status별 필드 null 규칙</h3>
 * <table>
 *   <tr><th>status</th><th>grade</th><th>totalScore</th><th>fixScope</th><th>scores/universityPredictions</th></tr>
 *   <tr><td>PENDING</td><td>null</td><td>null</td><td>null</td><td>null</td></tr>
 *   <tr><td>COMPLETED</td><td>non-null</td><td>non-null</td><td>non-null</td><td>JSON string</td></tr>
 *   <tr><td>FAILED</td><td>null</td><td>null</td><td>null</td><td>null</td></tr>
 * </table>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "analyses",
        indexes = {
                @Index(name = "idx_user_created", columnList = "user_id, created_at DESC"),
                @Index(name = "idx_user_grade", columnList = "user_id, grade"),
                @Index(name = "idx_status", columnList = "status")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Analysis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "gcs_url", nullable = false, columnDefinition = "TEXT")
    private String gcsUrl;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "analysis_type", nullable = false, length = 50)
    private String analysisType;

    @Column(name = "problem_text", length = 500)
    private String problemText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AnalysisStatus status = AnalysisStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(length = 2)
    private AnalysisGrade grade;

    @Column(name = "total_score", columnDefinition = "DECIMAL(5,2)")
    private Double totalScore;

    @Column(columnDefinition = "JSON")
    private String scores;

    @Enumerated(EnumType.STRING)
    @Column(name = "fix_scope", length = 20)
    private FixScope fixScope;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "university_predictions", columnDefinition = "JSON")
    private String universityPredictions;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Builder
    public Analysis(User user, String gcsUrl, String imageUrl,
                    String analysisType, String problemText) {
        this.user = user;
        this.gcsUrl = gcsUrl;
        this.imageUrl = imageUrl;
        this.analysisType = analysisType;
        this.problemText = problemText;
        this.status = AnalysisStatus.PENDING;
    }

    /**
     * AI 분석 완료 처리
     */
    public void complete(AnalysisGrade grade, Double totalScore, String scores,
                         FixScope fixScope, String comment, String universityPredictions) {
        this.status = AnalysisStatus.COMPLETED;
        this.grade = grade;
        this.totalScore = totalScore;
        this.scores = scores;
        this.fixScope = fixScope;
        this.comment = comment;
        this.universityPredictions = universityPredictions;
        this.completedAt = LocalDateTime.now();
    }

    /**
     * AI 분석 실패 처리
     */
    public void fail() {
        this.status = AnalysisStatus.FAILED;
    }
}
