/**
 * @fileoverview MiriArt 커뮤니티 API 클라이언트
 * Phase C1 구현 시 MOCK → 실제 apiFetch 호출로 교체.
 * @참조 miriartApi (apiFetch, getAuthHeaders), usePostsFeed
 */

import { apiFetch, getAuthHeaders } from '../../../shared/api/miriartApi';
import { Post } from '../model/post';
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
    void apiFetch; void getAuthHeaders; // Phase C1 전환 시 이 두 줄 제거하고 아래 주석 해제
    // return apiFetch<PostsResponse>('/api/posts?' + new URLSearchParams(params as Record<string, string>), { headers: getAuthHeaders() });

    // Phase C1 전: Mock 필터링
    let posts = [...MOCK_POSTS];
    if (params?.type) posts = posts.filter((p) => p.type === params.type);
    if (params?.grade) posts = posts.filter((p) => p.grade === params.grade);
    if (params?.domain) posts = posts.filter((p) => p.domain === params.domain);
    if (params?.sort === 'popular') {
      posts.sort((a, b) => (b.likeCount + b.answerCount) - (a.likeCount + a.answerCount));
    }
    return Promise.resolve({ posts, nextCursor: null });
  },

  getPost: async (_id: string): Promise<Post> =>
    Promise.reject(new Error('Phase C1 미구현')),

  createPost: async (_data: CreatePostRequest): Promise<Post> =>
    Promise.reject(new Error('Phase C1 미구현')),

  likePost: async (_targetType: string, _id: string) =>
    Promise.reject(new Error('Phase C1 미구현')),
};
