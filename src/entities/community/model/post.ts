/**
 * @fileoverview 커뮤니티 Post 도메인 타입. Zod SSOT — types.ts에서 추출한 타입 재export.
 * @참조 communityApi, usePostsFeed, PostCard, PostDetailPage, QnaDetailPage
 */

export type { Post, Persona } from './types';

export type PostType = 'free' | 'qna';
export type PostStatus = 'OPEN' | 'SOLVED' | 'EXPIRED' | 'CLOSED';
