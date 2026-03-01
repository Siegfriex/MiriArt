package com.miriart.api.domain.community.controller;

import com.miriart.api.domain.community.dto.PostListResponse;
import com.miriart.api.domain.community.repository.PostRepository;
import com.miriart.api.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 커뮤니티 게시글 공개 API. GET /api/posts 목록 조회 (공개, 인증 불필요).
 *
 * <p>연계: SecurityConfig GET /api/posts/** permitAll. PostRepository.findAll(Pageable) 사용.</p>
 *
 * @author MiriArt Team
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepository;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Page<PostListResponse>>> getPosts(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PostListResponse> page = postRepository.findAll(pageable).map(PostListResponse::from);
        return ResponseEntity.ok(ApiResponse.success(page));
    }
}
