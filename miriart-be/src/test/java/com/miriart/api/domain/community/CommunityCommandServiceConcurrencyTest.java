package com.miriart.api.domain.community;

import com.miriart.api.domain.community.entity.Answer;
import com.miriart.api.domain.community.entity.LikeTargetType;
import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostType;
import com.miriart.api.domain.community.repository.AnswerRepository;
import com.miriart.api.domain.community.repository.LikeRepository;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.community.service.AnswerCommandService;
import com.miriart.api.domain.community.service.LikeCommandService;
import com.miriart.api.domain.user.entity.LoginProvider;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import com.miriart.api.global.exception.BusinessException;
import com.miriart.api.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 커뮤니티 쓰기 서비스 동시성 검증 골격.
 * - toggleLike: 동시에 여러 스레드가 같은 게시글에 좋아요 시 likeCount와 likes row 수 일치.
 * - acceptAnswer: 동시에 두 사용자가 같은 답변 채택 시도 시 하나만 성공.
 */
@SpringBootTest
@ActiveProfiles("dev")
class CommunityCommandServiceConcurrencyTest {

    @Autowired
    LikeCommandService likeCommandService;
    @Autowired
    AnswerCommandService answerCommandService;
    @Autowired
    PostRepository postRepository;
    @Autowired
    AnswerRepository answerRepository;
    @Autowired
    LikeRepository likeRepository;
    @Autowired
    UserRepository userRepository;

    private User author;
    private ExecutorService executor;

    @BeforeEach
    void setUp() {
        author = userRepository.save(
                User.builder()
                        .provider(LoginProvider.KAKAO)
                        .providerUserId("concurrent-" + UUID.randomUUID())
                        .email("concurrent@example.com")
                        .build()
        );
        executor = Executors.newFixedThreadPool(10);
    }

    @Test
    @DisplayName("동시에 여러 스레드가 같은 게시글에 toggleLike 호출 시 likeCount와 likes row 수 일치")
    void toggleLike_concurrent_samePost_likeCountMatchesRowCount() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author)
                .type(PostType.FREE)
                .title("좋아요 동시성 테스트")
                .content("본문")
                .build());
        Long postId = post.getId();
        int userCount = 10;
        java.util.List<Long> userIds = new java.util.ArrayList<>();
        for (int i = 0; i < userCount; i++) {
            User u = userRepository.save(User.builder()
                    .provider(LoginProvider.GOOGLE)
                    .providerUserId("like-user-" + UUID.randomUUID())
                    .email("like" + i + "@example.com")
                    .build());
            userIds.add(u.getId());
        }
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(userCount);

        for (int i = 0; i < userCount; i++) {
            final Long uid = userIds.get(i);
            executor.submit(() -> {
                try {
                    start.await();
                    likeCommandService.toggleLike(uid, LikeTargetType.POST, postId);
                } catch (Exception e) {
                    // CM006 등 예외 가능
                } finally {
                    done.countDown();
                }
            });
        }
        start.countDown();
        assertThat(done.await(10, TimeUnit.SECONDS)).isTrue();
        executor.shutdown();

        Post updated = postRepository.findById(postId).orElseThrow();
        long likeRows = likeRepository.countByTargetTypeAndTargetId(LikeTargetType.POST, postId);
        assertThat(updated.getLikeCount()).isEqualTo(likeRows);
    }

    @Test
    @DisplayName("동시에 두 스레드가 같은 답변 채택 시도 시 하나만 성공")
    void acceptAnswer_concurrent_onlyOneSucceeds() throws Exception {
        Post post = postRepository.save(Post.builder()
                .user(author)
                .type(PostType.QNA)
                .title("QnA 채택 동시성")
                .content("본문")
                .build());
        Answer answer = answerRepository.save(Answer.builder()
                .post(post)
                .user(author)
                .content("답변")
                .build());
        Long postId = post.getId();
        Long answerId = answer.getId();
        Long authorId = author.getId();
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch done = new CountDownLatch(2);
        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < 2; i++) {
            executor.submit(() -> {
                try {
                    start.await();
                    answerCommandService.acceptAnswer(authorId, postId, answerId);
                    successCount.incrementAndGet();
                } catch (BusinessException e) {
                    if (e.getErrorCode() == ErrorCode.ANSWER_ALREADY_ACCEPTED) {
                        // 기대되는 실패
                    } else {
                        throw e;
                    }
                } catch (Exception e) {
                    // rethrow or count
                } finally {
                    done.countDown();
                }
            });
        }
        start.countDown();
        assertThat(done.await(5, TimeUnit.SECONDS)).isTrue();
        executor.shutdown();

        assertThat(successCount.get()).isEqualTo(1);
        Post updated = postRepository.findById(postId).orElseThrow();
        assertThat(updated.getAcceptedAnswerId()).isEqualTo(answerId);
    }
}
