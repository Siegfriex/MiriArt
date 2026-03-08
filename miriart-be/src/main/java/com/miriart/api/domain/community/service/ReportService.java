package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.entity.LikeTargetType;
import com.miriart.api.domain.community.entity.Report;
import com.miriart.api.domain.community.repository.AnswerRepository;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.community.repository.ReportRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 신고 서비스. 대상 존재 검증 → 중복 검사 → 저장.
 * LikeCommandService와 동일한 findBy + UNIQUE 위반 이중 방어 패턴.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    @Transactional
    public void reportTarget(Long userId, LikeTargetType targetType, Long targetId, String reason) {
        // 1. 대상 존재 검증
        if (targetType == LikeTargetType.POST) {
            postRepository.findById(targetId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        } else {
            answerRepository.findById(targetId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));
        }

        // 2. 중복 검사 (선검사)
        reportRepository.findByUserIdAndTargetTypeAndTargetId(userId, targetType, targetId)
                .ifPresent(r -> {
                    throw new BusinessException(ErrorCode.REPORT_ALREADY_EXISTS);
                });

        // 3. 저장 (UNIQUE 위반 레이스 방어)
        User user = userRepository.findByIdOrThrow(userId);
        try {
            Report report = Report.builder()
                    .user(user)
                    .targetType(targetType)
                    .targetId(targetId)
                    .reason(reason)
                    .build();
            reportRepository.saveAndFlush(report);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.REPORT_ALREADY_EXISTS);
        }

        log.info("신고 접수 - userId={}, targetType={}, targetId={}", userId, targetType, targetId);
    }
}
