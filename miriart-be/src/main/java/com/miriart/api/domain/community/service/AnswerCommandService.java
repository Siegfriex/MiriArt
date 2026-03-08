package com.miriart.api.domain.community.service;

import com.miriart.api.domain.community.dto.CreateAnswerCommand;
import com.miriart.api.domain.community.entity.Answer;
import com.miriart.api.domain.community.entity.Persona;
import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostStatus;
import com.miriart.api.domain.community.entity.PostType;
import com.miriart.api.domain.community.repository.AnswerRepository;
import com.miriart.api.domain.community.repository.PersonaRepository;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * 답변 작성·채택 커맨드 서비스. createAnswer, acceptAnswer.
 *
 * <p>트랜잭션: 각 public 메서드에 @Transactional. 채택 시 평판은 동일 TX에서 ReputationService 호출.</p>
 *
 * @author MiriArt Team
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AnswerCommandService {

    private final PostRepository postRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final PersonaRepository personaRepository;
    private final ReputationService reputationService;

    /**
     * QnA 답변 작성. Post 검증(QNA·OPEN·마감 전) → Answer 저장 → post.answerCount 증가.
     */
    @Transactional
    public Long createAnswer(Long userId, CreateAnswerCommand cmd) {
        User user = userRepository.findByIdOrThrow(userId);
        Post post = postRepository.findById(cmd.getPostId())
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));

        if (post.getType() != PostType.QNA) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        if (post.getStatus() != PostStatus.OPEN) {
            throw new BusinessException(ErrorCode.ANSWER_ALREADY_ACCEPTED); // 또는 별도 코드
        }
        if (post.getDeadlineAt() != null && post.getDeadlineAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.POST_DEADLINE_PASSED);
        }

        Optional<Persona> persona = personaRepository.findByUserIdAndBoardScope(userId, "community");
        Answer answer = Answer.builder()
                .post(post)
                .user(user)
                .persona(persona.orElse(null))
                .content(cmd.getContent())
                .imageUrls(cmd.getImageUrls())
                .build();
        answer = answerRepository.save(answer);
        post.incrementAnswerCount();
        postRepository.save(post);
        log.debug("답변 작성 - answerId={}, postId={}, userId={}", answer.getId(), post.getId(), userId);
        return answer.getId();
    }

    /**
     * 답변 채택. 질문 작성자만 가능. 이미 채택된 경우·마감 시 실패.
     * 성공 시 ReputationService.addReputationForAnswerAccepted 호출(동일 TX).
     */
    @Transactional
    public void acceptAnswer(Long actorUserId, Long postId, Long answerId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        Answer answer = answerRepository.findByIdAndPostId(answerId, postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ENTITY_NOT_FOUND));

        if (post.getType() != PostType.QNA) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        if (post.getAcceptedAnswerId() != null) {
            throw new BusinessException(ErrorCode.ANSWER_ALREADY_ACCEPTED);
        }
        if (!post.getUser().getId().equals(actorUserId)) {
            throw new BusinessException(ErrorCode.ACCEPT_FORBIDDEN);
        }
        if (post.getDeadlineAt() != null && post.getDeadlineAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.POST_DEADLINE_PASSED);
        }

        post.accept(answerId);
        answer.accept();
        postRepository.save(post);
        answerRepository.save(answer);

        reputationService.addReputationForAnswerAccepted(answer.getUser().getId(), answerId);
        log.info("답변 채택 - postId={}, answerId={}, actorUserId={}", postId, answerId, actorUserId);
    }
}
