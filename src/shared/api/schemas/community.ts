/**
 * @fileoverview Community API Zod 스키마. Post/PostsResponse/CreatePostRequest. Mock·BE 응답 검증용.
 */

import { z } from 'zod';

const personaSchema = z.object({
  displayName: z.string(),
  colorToken: z.string(),
});
export { personaSchema };

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

/** Answer (Q&A 답변). BE 상세 응답용 */
export const answerSchema = z.object({
  id: z.string(),
  postId: z.string(),
  persona: personaSchema,
  reputationLevel: z.number(),
  content: z.string(),
  imageUrls: z.array(z.string()),
  likeCount: z.number(),
  isAccepted: z.boolean(),
  commentCount: z.number(),
  createdAt: z.string(),
});
export type AnswerApi = z.infer<typeof answerSchema>;

/** Comment. 게시글/답변 하위 댓글 */
export const commentSchema = z.object({
  id: z.string(),
  parentType: z.enum(['post', 'answer']),
  parentId: z.string(),
  persona: personaSchema,
  content: z.string(),
  createdAt: z.string(),
});
export type CommentApi = z.infer<typeof commentSchema>;

/** 단일 Post 상세(답변·댓글 포함). BE 확장 시 사용 */
export const postDetailSchema = postSchema.extend({
  answers: z.array(answerSchema).optional(),
  comments: z.array(commentSchema).optional(),
});
export type PostDetailApi = z.infer<typeof postDetailSchema>;

/** 단일 Post 상세 응답(답변·댓글 포함). BE 확장 시 스키마만 수정 */
export const postDetailResponseSchema = postDetailSchema;
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

// BE 계약: POST /api/likes/toggle — targetType 'POST'|'ANSWER', targetId number. FE 어댑터에서 Number(id) 변환.
export const toggleLikeRequestSchema = z.object({
  targetType: z.enum(['POST', 'ANSWER']),
  targetId: z.number(),
});
export const toggleLikeResponseSchema = z.object({
  liked: z.boolean(),
  likeCount: z.number(),
});

// BE 계약: content 필수, imageUrls 선택. personaId는 FE 옵션, BE 전송 시 제외 또는 서버에서 무시.
export const createAnswerRequestSchema = z.object({
  content: z.string().min(1),
  imageUrls: z.array(z.string()).optional(),
  personaId: z.string().optional(),
});

// BE 계약: POST /api/comments — parentType 'post'|'answer', parentId number(BE), content. FE는 parentId string으로 다루고 Real에서 Number 변환.
export const createCommentRequestSchema = z.object({
  parentType: z.enum(['post', 'answer']),
  parentId: z.string(),
  content: z.string().min(1),
});
export type CreateCommentRequestApi = z.infer<typeof createCommentRequestSchema>;

export type ToggleLikeRequestApi = z.infer<typeof toggleLikeRequestSchema>;
export type ToggleLikeResponseApi = z.infer<typeof toggleLikeResponseSchema>;
export type CreateAnswerRequestApi = z.infer<typeof createAnswerRequestSchema>;
