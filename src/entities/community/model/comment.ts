/**
 * @fileoverview 커뮤니티 Comment 도메인 타입. Zod SSOT — types.ts에서 추출한 타입 재export.
 * @참조 PostDetailPage, QnaDetailPage
 */

export type { Comment } from './types';

export type CommentParentType = 'post' | 'answer';
