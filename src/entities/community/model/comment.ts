/**
 * @fileoverview 커뮤니티 Comment 도메인 타입. 게시글/답변 하위 댓글.
 * @참조 PostDetailPage, QnaDetailPage
 */

import { Persona } from './post';

export type CommentParentType = 'post' | 'answer';

export interface Comment {
  id: string;
  parentType: CommentParentType;
  parentId: string;
  persona: Persona;
  content: string;
  createdAt: string;
}
