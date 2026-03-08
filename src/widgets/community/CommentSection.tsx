/**
 * @fileoverview 댓글 섹션 위젯. 접기/펼치기, 댓글 목록, draft 입력 + 등록. PersonaAvatar xs.
 */

import React, { useState } from 'react';
import type { Comment } from '@/entities/community/model/comment';
import type { CommentParentType } from '@/entities/community/model/comment';
import { PersonaAvatar } from '@/shared/ui/PersonaAvatar';
import { Button } from '@/shared/ui/Button';
import { TextInput } from '@/shared/ui/TextInput';

export interface CommentSectionProps {
  comments: Comment[];
  parentType: CommentParentType;
  parentId: string;
  maxVisible?: number;
  onSubmit?: (content: string) => void | Promise<void>;
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  parentType,
  parentId,
  maxVisible,
  onSubmit,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const showCount = maxVisible != null ? Math.min(maxVisible, comments.length) : comments.length;
  const hasMore = maxVisible != null && comments.length > maxVisible;
  const visibleComments = expanded ? comments : comments.slice(0, showCount);

  const handleSubmit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setDraft('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-caption text-text-mid hover:text-text-primary"
        >
          댓글 {comments.length}개 {expanded ? '접기' : '펼치기'}
        </button>
      </div>
      <ul className="space-y-2">
        {visibleComments.map((c) => (
          <li key={c.id} className="flex gap-2">
            <PersonaAvatar
              displayName={c.persona.displayName}
              colorToken={c.persona.colorToken}
              size="xs"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-micro text-text-mid">
                <span className="font-medium text-text-primary">{c.persona.displayName}</span>
                <span>{relativeTime(c.createdAt)}</span>
              </div>
              <p className="text-caption text-text-primary break-words">{c.content}</p>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-caption text-primary-lime hover:underline"
        >
          댓글 더보기
        </button>
      )}
      {onSubmit && (
        <div className="flex gap-2 pt-2">
          <TextInput
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="댓글 입력..."
            size="sm"
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!draft.trim() || submitting}
          >
            등록
          </Button>
        </div>
      )}
    </div>
  );
};
