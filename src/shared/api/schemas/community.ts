/**
 * @fileoverview Community API Zod 스키마. Post/PostsResponse/CreatePostRequest. Mock·BE 응답 검증용.
 */

import { z } from 'zod';

const personaSchema = z.object({
  displayName: z.string(),
  colorToken: z.string(),
});

export const postSchema = z.object({
  id: z.string(),
  type: z.enum(['free', 'qna']),
  status: z.string(),
  title: z.string(),
  content: z.string(),
  grade: z.string(),
  domain: z.string(),
  tags: z.array(z.string()),
  imageUrls: z.array(z.string()),
  likeCount: z.number(),
  answerCount: z.number(),
  commentCount: z.number(),
  createdAt: z.string(),
  persona: personaSchema,
  reputationLevel: z.number(),
  deadlineAt: z.string().optional(),
  isLiked: z.boolean().optional(),
});
export type PostApi = z.infer<typeof postSchema>;

/** 단일 Post 상세 응답. 현재는 Post와 동일 shape. BE에서 확장 시 스키마만 수정 */
export const postDetailResponseSchema = postSchema;
export type PostDetailResponseApi = z.infer<typeof postDetailResponseSchema>;

export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
  nextCursor: z.string().nullable(),
});
export type PostsResponseApi = z.infer<typeof postsResponseSchema>;

// CreatePostRequest: 필수 type, title, content / optional imageUrls, tags, gradeScope, domainScope, isAnonymous, deadlineHours
// createPost에 적용은 BE 연동 시점에 진행 (communityApi.createPost 내부에서 parse 후 apiFetch)
export const createPostRequestSchema = z.object({
  type: z.enum(['free', 'qna']),
  title: z.string(),
  content: z.string(),
  imageUrls: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  gradeScope: z.string().optional(),
  domainScope: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  deadlineHours: z.union([z.literal(24), z.literal(48), z.literal(72)]).optional(),
});
export type CreatePostRequestApi = z.infer<typeof createPostRequestSchema>;
