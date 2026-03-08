/**
 * @fileoverview 커뮤니티 엔티티 타입. Zod SSOT — 수동 타입 정의 없이 z.infer만 사용.
 */

import { z } from 'zod';
import {
  postSchema,
  postsResponseSchema,
  createPostRequestSchema,
  personaSchema,
  answerSchema,
  commentSchema,
  postDetailSchema,
  toggleLikeRequestSchema,
  toggleLikeResponseSchema,
  createAnswerRequestSchema,
} from '@/shared/api/schemas/community';

export type Post = z.infer<typeof postSchema>;
export type PostDetail = z.infer<typeof postDetailSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;
export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
export type Persona = z.infer<typeof personaSchema>;
export type Answer = z.infer<typeof answerSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type ToggleLikeRequest = z.infer<typeof toggleLikeRequestSchema>;
export type ToggleLikeResponse = z.infer<typeof toggleLikeResponseSchema>;
export type CreateAnswerRequest = z.infer<typeof createAnswerRequestSchema>;
