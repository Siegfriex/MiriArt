/**
 * @fileoverview 커뮤니티 API 실구현. apiFetch 기반. BE 연동 시 사용.
 */

import { apiFetch, getAuthHeaders, ApiError } from '@/shared/api/miriartApi';
import {
  postsResponseSchema,
  postDetailResponseSchema,
  createPostRequestSchema,
} from '@/shared/api/schemas/community';
import type { Post, PostDetail, CreatePostRequest, PostsResponse } from '@/entities/community/model/types';

export type { CreatePostRequest, PostsResponse };

export interface CommunityApiSurface {
  getPosts: (params?: {
    type?: string;
    sort?: string;
    grade?: string;
    domain?: string;
    cursor?: string;
    size?: number;
  }) => Promise<PostsResponse>;
  getPost: (id: string) => Promise<PostDetail>;
  createPost: (data: CreatePostRequest) => Promise<Post>;
  likePost: (targetType: string, id: string) => Promise<{ liked: boolean; likeCount: number }>;
  acceptAnswer: (postId: string, answerId: string) => Promise<void>;
  report: (targetType: string, targetId: string, reason: string) => Promise<void>;
  getReputation: (userId: string) => Promise<{ score: number; level: number; badge: string }>;
}

export const communityApiReal: CommunityApiSurface = {
  getPosts: async (params = {}) => {
    const qs = new URLSearchParams();
    if (params.type) qs.set('type', params.type);
    if (params.sort) qs.set('sort', params.sort);
    if (params.grade) qs.set('grade', params.grade);
    if (params.domain) qs.set('domain', params.domain);
    if (params.cursor) qs.set('cursor', params.cursor);
    if (params.size != null) qs.set('size', String(params.size));
    const path = `/api/posts${qs.toString() ? `?${qs}` : ''}`;
    const raw = await apiFetch<unknown>(path, { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = postsResponseSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(500, 'Invalid posts response');
    const data = parsed.data as PostsResponse;
    return { ...data, hasNext: !!data.nextCursor };
  },

  getPost: async (id: string) => {
    const raw = await apiFetch<unknown>(`/api/posts/${id}`, { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = postDetailResponseSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(500, 'Invalid post detail response');
    return parsed.data as PostDetail;
  },

  createPost: async (data: CreatePostRequest) => {
    const body = createPostRequestSchema.parse(data);
    const raw = await apiFetch<unknown>('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(body),
    });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = postDetailResponseSchema.safeParse(payload);
    if (!parsed.success) throw new ApiError(500, 'Invalid post response');
    return parsed.data as PostDetail;
  },

  likePost: async (targetType: string, id: string) => {
    const raw = await apiFetch<unknown>(`/api/${targetType}/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const payload = (raw as { data?: unknown }).data ?? raw;
    if (payload && typeof payload === 'object' && 'liked' in payload && 'likeCount' in payload) {
      return payload as { liked: boolean; likeCount: number };
    }
    return { liked: true, likeCount: 0 };
  },

  acceptAnswer: async (postId: string, answerId: string) => {
    await apiFetch(`/api/posts/${postId}/accept/${answerId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  report: async (targetType: string, targetId: string, reason: string) => {
    await apiFetch(`/api/${targetType}/${targetId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ reason }),
    });
  },

  getReputation: async (userId: string) => {
    const raw = await apiFetch<unknown>(`/api/users/${userId}/reputation`, {
      headers: getAuthHeaders(),
    });
    const payload = (raw as { data?: unknown }).data ?? raw;
    if (payload && typeof payload === 'object' && 'level' in payload) {
      return payload as { score: number; level: number; badge: string };
    }
    return { score: 0, level: 1, badge: '🌱' };
  },
};
