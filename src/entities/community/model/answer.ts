/**
 * @fileoverview 커뮤니티 Answer 도메인 타입. Q&A 전용.
 * @참조 QnaDetailPage, communityApi
 */

import { Persona } from './post';

export interface Answer {
  id: string;
  postId: string;
  persona: Persona;
  reputationLevel: number;
  content: string;
  imageUrls: string[];
  likeCount: number;
  isAccepted: boolean;
  commentCount: number;
  createdAt: string;
}
