/**
 * @fileoverview 커뮤니티 Post 도메인 타입.
 * @참조 communityApi, usePostsFeed, PostCard, PostDetailPage, QnaDetailPage
 */

export type PostType = 'free' | 'qna';
export type PostStatus = 'OPEN' | 'SOLVED' | 'EXPIRED' | 'CLOSED';

export interface Persona {
  displayName: string;
  colorToken: string;
}

export interface Post {
  id: string;
  type: PostType;
  status: PostStatus;
  title: string;
  content: string;
  grade: string;
  domain: string;
  tags: string[];
  imageUrls: string[];
  likeCount: number;
  answerCount: number;
  commentCount: number;
  deadlineAt?: string;
  createdAt: string;
  persona: Persona;
  reputationLevel: number;
  isLiked?: boolean;
}
