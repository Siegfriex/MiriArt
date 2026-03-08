package com.miriart.api.domain.community.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miriart.api.domain.community.dto.CreatePostRequest;
import com.miriart.api.domain.community.dto.PostDetailResponse;
import com.miriart.api.domain.community.entity.Persona;
import com.miriart.api.domain.community.entity.Post;
import com.miriart.api.domain.community.entity.PostType;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.domain.user.entity.User;
import com.miriart.api.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 게시글 작성 커맨드 서비스.
 */
@Service
@RequiredArgsConstructor
public class PostCommandService {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final PostRepository postRepository;
    private final PersonaService personaService;
    private final PostQueryService postQueryService;
    private final UserRepository userRepository;

    @Transactional
    public PostDetailResponse createPost(Long userId, CreatePostRequest req) {
        User user = userRepository.findByIdOrThrow(userId);
        PostType postType = PostType.valueOf(req.type().toUpperCase());

        Persona persona = personaService.getOrCreatePersona(userId, "community");

        LocalDateTime deadlineAt = null;
        if (postType == PostType.QNA && req.deadlineHours() != null) {
            deadlineAt = LocalDateTime.now().plusHours(req.deadlineHours());
        }

        Post post = Post.builder()
                .user(user)
                .persona(persona)
                .type(postType)
                .title(req.title())
                .content(req.content())
                .gradeScope(req.gradeScope())
                .domainScope(req.domainScope())
                .tags(toJson(req.tags()))
                .imageUrls(toJson(req.imageUrls()))
                .deadlineAt(deadlineAt)
                .build();
        post = postRepository.save(post);

        return postQueryService.getPostDetail(post.getId(), userId);
    }

    private String toJson(List<String> list) {
        if (list == null || list.isEmpty()) return null;
        try {
            return MAPPER.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
