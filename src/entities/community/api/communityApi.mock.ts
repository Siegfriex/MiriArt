/**
 * @fileoverview 커뮤니티 API Mock. MOCK_POSTS 등 활용. VITE_COMMUNITY_MOCK=true 시 사용.
 */

import { postsResponseSchema } from '@/shared/api/schemas/community';
import { ApiError } from '@/shared/api/miriartApi';
import type { Post } from '@/entities/community/model/post';
import type { CreatePostRequest, PostsResponse, CommunityApiSurface } from './communityApi.real';
import { MOCK_POSTS, MOCK_ANSWERS, MOCK_COMMENTS } from '@/entities/community/model/mock';

function filterAndSortPosts(params?: {
  type?: string;
  sort?: string;
  grade?: string;
  domain?: string;
}): Post[] {
  let posts = [...MOCK_POSTS];
  if (params?.type) posts = posts.filter((p) => p.type === params.type);
  if (params?.grade) posts = posts.filter((p) => p.grade === params.grade);
  if (params?.domain) posts = posts.filter((p) => p.domain === params.domain);
  if (params?.sort === 'popular') {
    posts.sort((a, b) => b.likeCount + b.answerCount - (a.likeCount + a.answerCount));
  }
  if (params?.type === 'qna') {
    posts.sort((a, b) => {
      const statusOrder = (s: string) => (s === 'OPEN' ? 0 : s === 'SOLVED' ? 1 : 2);
      const diff = statusOrder(a.status) - statusOrder(b.status);
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  return posts;
}

export const communityApiMock: CommunityApiSurface = {
  getPosts: async (params) => {
    const posts = filterAndSortPosts(params);
    const mockResponse: PostsResponse = { posts, nextCursor: null };
    const parsed = postsResponseSchema.safeParse(mockResponse);
    if (!parsed.success) throw new ApiError(500, 'Invalid posts response');
    return parsed.data as PostsResponse;
  },

  getPost: async (id: string) => {
    const post = MOCK_POSTS.find((p) => p.id === id);
    if (!post) throw new ApiError(404, 'Post not found');
    const answers = MOCK_ANSWERS.filter((a) => a.postId === id);
    const postComments = MOCK_COMMENTS.filter((c) => c.parentId === id && c.parentType === 'post');
    const answerComments = MOCK_COMMENTS.filter((c) =>
      c.parentType === 'answer' && answers.some((a) => a.id === c.parentId)
    );
    const comments = [...postComments, ...answerComments];
    return { ...post, answers, comments };
  },

  createPost: async (data: CreatePostRequest) => {
    const id = `mock-${Date.now()}`;
    const post: Post = {
      id,
      type: data.type,
      status: data.type === 'qna' ? 'OPEN' : 'OPEN',
      title: data.title,
      content: data.content,
      grade: data.gradeScope ?? '',
      domain: data.domainScope ?? '',
      tags: data.tags ?? [],
      imageUrls: data.imageUrls ?? [],
      likeCount: 0,
      answerCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      persona: { displayName: '익명', colorToken: '#C2F970' },
      reputationLevel: 1,
      isLiked: false,
    };
    if (data.type === 'qna' && data.deadlineHours) {
      const d = new Date();
      d.setHours(d.getHours() + data.deadlineHours);
      post.deadlineAt = d.toISOString();
    }
    return post;
  },

  likePost: async (targetType: string, id: string) => {
    const post = MOCK_POSTS.find((p) => p.id === id);
    if (post) {
      const newLiked = !post.isLiked;
      const newCount = newLiked ? post.likeCount + 1 : post.likeCount - 1;
      return { liked: newLiked, likeCount: Math.max(0, newCount) };
    }
    return { liked: true, likeCount: 1 };
  },

  toggleLike: async (payload) => {
    const id = String(payload.targetId);
    const post = MOCK_POSTS.find((p) => p.id === id);
    if (post) {
      const newLiked = !post.isLiked;
      const newCount = newLiked ? post.likeCount + 1 : post.likeCount - 1;
      return { liked: newLiked, likeCount: Math.max(0, newCount) };
    }
    return { liked: true, likeCount: 1 };
  },

  createAnswer: async (_postId: string, _body) => {
    return Number(Date.now());
  },

  acceptAnswer: async (_postId: string, _answerId: string) => {
    // no-op in mock
  },

  createComment: async (params) => {
    return {
      id: `c-${Date.now()}`,
      parentType: params.parentType,
      parentId: params.parentId,
      persona: { displayName: '익명', colorToken: '#888888' },
      content: params.content,
      createdAt: new Date().toISOString(),
    };
  },

  report: async (_targetType: string, _targetId: string, _reason: string) => {
    // no-op in mock
  },

  getReputation: async (_userId: string) => {
    return { score: 50, level: 3, badge: '🎨' };
  },
};
