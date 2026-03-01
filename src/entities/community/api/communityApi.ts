/**
 * @fileoverview MiriArt 커뮤니티 API 클라이언트
 * Phase C1 구현 시 MOCK → 실제 apiFetch 호출로 교체.
 * @참조 miriartApi (apiFetch, getAuthHeaders), usePostsFeed
 */

import { apiFetch, getAuthHeaders, ApiError } from '../../../shared/api/miriartApi';
import { postsResponseSchema, postDetailResponseSchema, createPostRequestSchema } from '../../../shared/api/schemas/community';
import type { Post } from '../model/post';
import { MOCK_POSTS } from '../model/mock';

export type { Post };

export interface CreatePostRequest {
  type: 'free' | 'qna';
  title: string;
  content: string;
  imageUrls?: string[];
  tags?: string[];
  gradeScope?: string;
  domainScope?: string;
  isAnonymous?: boolean;
  deadlineHours?: 24 | 48 | 72;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
}

// Phase C1에서 실제 API 호출로 교체
export const CommunityApi = {
  getPosts: async (params?: {
    type?: string;
    sort?: string;
    grade?: string;
    domain?: string;
    cursor?: string;
  }): Promise<PostsResponse> => {
    // Phase C1 전: Mock 필터링. Mock 결과도 스키마로 검증해 일관성 보장.
    let posts = [...MOCK_POSTS];
    if (params?.type) posts = posts.filter((p) => p.type === params.type);
    if (params?.grade) posts = posts.filter((p) => p.grade === params.grade);
    if (params?.domain) posts = posts.filter((p) => p.domain === params.domain);
    if (params?.sort === 'popular') {
      posts.sort((a, b) => (b.likeCount + b.answerCount) - (a.likeCount + a.answerCount));
    }
    // 질문 Q&A 탭: 미해결(OPEN) 우선, 그 다음 최신순 (설계서 v1.0 §1.2)
    if (params?.type === 'qna') {
      posts.sort((a, b) => {
        const statusOrder = (s: string) => (s === 'OPEN' ? 0 : s === 'SOLVED' ? 1 : 2);
        const diff = statusOrder(a.status) - statusOrder(b.status);
        if (diff !== 0) return diff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    const mockResponse = { posts, nextCursor: null };
    const parsed = postsResponseSchema.safeParse(mockResponse);
    if (!parsed.success) {
      throw new ApiError(500, 'Invalid posts response');
    }
    return parsed.data as PostsResponse;
  },

  // Phase C1 실제 API 전환 시 예시:
  // const raw = await apiFetch<unknown>('/api/community/posts?' + new URLSearchParams(params as Record<string, string>).toString(), { headers: getAuthHeaders() });
  // const parsed = postsResponseSchema.safeParse(raw);
  // if (!parsed.success) throw new ApiError(500, 'Invalid posts response');
  // return parsed.data as PostsResponse;

  /** 단일 Post 상세. BE 연동 시: apiFetch<unknown> → postDetailResponseSchema.safeParse → 실패 시 ApiError(500, 'Invalid post detail response') */
  getPost: async (id: string): Promise<Post> => {
    // TODO(Phase C1): const raw = await apiFetch<unknown>(`/api/community/posts/${id}`, { headers: getAuthHeaders() });
    // TODO(Phase C1): const parsed = postDetailResponseSchema.safeParse(raw);
    // TODO(Phase C1): if (!parsed.success) throw new ApiError(500, 'Invalid post detail response');
    // TODO(Phase C1): return parsed.data as Post;
    return Promise.reject(new Error('Phase C1 미구현'));
  },

  /** 글 작성. BE 연동 시: createPostRequestSchema.parse(body) → apiFetch POST → 응답 스키마 검증 후 Post 반환 */
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    // TODO(Phase C1): const body = createPostRequestSchema.parse(data);
    // TODO(Phase C1): const raw = await apiFetch<unknown>('/api/community/posts', { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify(body) });
    // TODO(Phase C1): const parsed = postDetailResponseSchema.safeParse(raw); if (!parsed.success) throw new ApiError(500, 'Invalid post response'); return parsed.data as Post;
    return Promise.reject(new Error('Phase C1 미구현'));
  },

  likePost: async (_targetType: string, _id: string) =>
    Promise.reject(new Error('Phase C1 미구현')),
};
