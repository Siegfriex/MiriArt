package com.miriart.api.domain.analysis.entity;

import com.miriart.api.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 분석 사용량 로그 엔티티. analysis_usage_logs 테이블. 플랜 기반 월별 크레딧 카운트용.
 *
 * <p>연계: {@link AnalysisService#startAnalysis}에서 분석 완료 시 create(user, analysisId)로 저장.
 * {@link AnalysisUsageLogRepository#countByUserIdAndBillingYearMonth}로 해당 월 사용 횟수 조회 → 플랜 한도 체크.</p>
 *
 * @author MiriArt Team
 */
@Getter
@Entity
@Table(name = "analysis_usage_logs",
        indexes = {
                @Index(name = "idx_user_month", columnList = "user_id, billing_year_month")
        })
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisUsageLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "analysis_id")
    private Long analysisId;

    @Column(name = "billing_year_month", nullable = false, length = 7)
    private String billingYearMonth;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public AnalysisUsageLog(User user, Long analysisId, String billingYearMonth) {
        this.user = user;
        this.analysisId = analysisId;
        this.billingYearMonth = billingYearMonth;
    }

    public static AnalysisUsageLog create(User user, Long analysisId) {
        String billingYearMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        return AnalysisUsageLog.builder()
                .user(user)
                .analysisId(analysisId)
                .billingYearMonth(billingYearMonth)
                .build();
    }
}
