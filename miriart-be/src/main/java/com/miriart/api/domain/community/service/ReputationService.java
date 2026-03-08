package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.entity.ReputationLedger;
import com.miriart.api.domain.community.repository.ReputationLedgerRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 평판 포인트 지급/차감 서비스. 원장 기록 + User.reputationScore 갱신.
 *
 * <p>연계: AnswerCommandService.acceptAnswer에서 채택 시 호출(동일 TX). 향후 이벤트 기반으로 분리 가능.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReputationService {

    private static final String REASON_ANSWER_ACCEPTED = "ANSWER_ACCEPTED";
    private static final String REF_TYPE_ANSWER = "ANSWER";
    private static final int POINTS_ANSWER_ACCEPTED = 10;

    private final UserRepository userRepository;
    private final ReputationLedgerRepository reputationLedgerRepository;

    /**
     * 답변 채택로 인한 평판 지급. 원장 INSERT + User.addReputation 호출.
     * acceptAnswer와 같은 트랜잭션에서 호출되면 실패 시 전체 롤백.
     */
    @Transactional
    public void addReputationForAnswerAccepted(Long userId, Long answerId) {
        User user = userRepository.findByIdOrThrow(userId);
        ReputationLedger ledger = ReputationLedger.builder()
                .user(user)
                .delta(POINTS_ANSWER_ACCEPTED)
                .reason(REASON_ANSWER_ACCEPTED)
                .refType(REF_TYPE_ANSWER)
                .refId(answerId)
                .build();
        reputationLedgerRepository.save(ledger);
        user.addReputation(POINTS_ANSWER_ACCEPTED);
        userRepository.save(user);
        log.debug("평판 지급 - userId={}, answerId={}, delta={}", userId, answerId, POINTS_ANSWER_ACCEPTED);
    }
}
