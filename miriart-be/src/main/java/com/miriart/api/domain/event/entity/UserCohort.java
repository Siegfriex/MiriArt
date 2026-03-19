package com.miriart.api.domain.event.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 유저별 코호트 집계. 배치 스케줄러가 user_events 기반으로 채움.
 */
@Entity
@Table(name = "user_cohorts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(length = 30)
    private String firstTopic;

    @Column(length = 1)
    private String firstAnalysisGrade;

    private LocalDate firstVisitDate;
    private LocalDate firstChatDate;
    private LocalDate firstUploadDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public UserCohort(Long userId) {
        this.userId = userId;
    }

    public void updateFirstVisitDate(LocalDate date) {
        if (this.firstVisitDate == null || date.isBefore(this.firstVisitDate)) {
            this.firstVisitDate = date;
        }
    }

    public void updateFirstChatDate(LocalDate date) {
        if (this.firstChatDate == null || date.isBefore(this.firstChatDate)) {
            this.firstChatDate = date;
        }
    }

    public void updateFirstUploadDate(LocalDate date) {
        if (this.firstUploadDate == null || date.isBefore(this.firstUploadDate)) {
            this.firstUploadDate = date;
        }
    }

    public void updateFirstTopic(String topic) {
        if (this.firstTopic == null) {
            this.firstTopic = topic;
        }
    }

    public void updateFirstAnalysisGrade(String grade) {
        if (this.firstAnalysisGrade == null) {
            this.firstAnalysisGrade = grade;
        }
    }
}
