/**
 * @fileoverview Q&A 답변 스레드 위젯. 답변 목록 + 답변별 댓글. 답변 입력 폼은 포함하지 않음.
 */

import React from 'react';
import type { Answer } from '@/entities/community/model/answer';
import type { Comment } from '@/entities/community/model/comment';
import { PersonaAvatar } from '@/shared/ui/PersonaAvatar';
import { ReputationBadge } from '@/widgets/community/ReputationBadge';
import { LikeButton } from '@/shared/ui/LikeButton';
import { CommentSection } from '@/widgets/community/CommentSection';
import { useLikeToggle } from '@/features/community/useLikeToggle';
import { useAcceptAnswer } from '@/features/community/useAcceptAnswer';

export interface AnswerThreadProps {
  answers: Answer[];
  postId: string;
  postAuthorId?: string;
  currentUserId?: string;
  acceptedAnswerId?: string | null;
  postStatus?: string;
  comments?: Comment[];
  onAccept?: (answerId: string) => void;
  onLike?: (answerId: string) => void;
  onCommentSubmit?: (answerId: string, content: string) => void | Promise<void>;
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

interface AnswerCardProps {
  answer: Answer;
  postId: string;
  isAccepted: boolean;
  canAccept: boolean;
  comments: Comment[];
  onAccept: (answerId: string) => void;
  acceptMutation: ReturnType<typeof useAcceptAnswer>;
  onCommentSubmit?: (answerId: string, content: string) => void | Promise<void>;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  postId,
  isAccepted,
  canAccept,
  comments,
  onAccept,
  acceptMutation,
  onCommentSubmit,
}) => {
  const likeToggle = useLikeToggle('answer', answer.id, {
    postIdForInvalidation: postId,
    initialLiked: false,
    initialCount: answer.likeCount ?? 0,
  });
  return (
    <article
      className={`rounded-medium border p-4 space-y-3 ${
        isAccepted ? 'border-primary-lime bg-primary-lime/5' : 'border-border-default bg-surface-alt'
      }`}
    >
      <div className="flex items-start gap-2">
        <PersonaAvatar
          displayName={answer.persona.displayName}
          colorToken={answer.persona.colorToken}
          size="xs"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-caption font-medium text-text-primary">
              {answer.persona.displayName}
            </span>
            <ReputationBadge level={answer.reputationLevel} size="sm" />
            <span className="text-micro text-text-mid">
              {relativeTime(answer.createdAt)}
            </span>
            {isAccepted && (
              <span className="text-micro font-medium text-primary-lime">채택됨</span>
            )}
          </div>
          <p className="text-caption text-text-primary whitespace-pre-wrap break-words mt-1">
            {answer.content}
          </p>
          {answer.imageUrls?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {answer.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="max-w-full h-auto max-h-40 rounded-small object-cover"
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-2">
            <LikeButton
              count={likeToggle.count}
              isLiked={likeToggle.isLiked}
              onToggle={likeToggle.toggle}
              size="sm"
            />
            {canAccept && !isAccepted && (
              <button
                type="button"
                onClick={() => {
                  onAccept(answer.id);
                  acceptMutation.mutate(answer.id);
                }}
                disabled={acceptMutation.isPending}
                className="text-caption text-primary-lime hover:underline disabled:opacity-50"
              >
                채택하기
              </button>
            )}
          </div>
        </div>
      </div>
      <CommentSection
        comments={comments}
        parentType="answer"
        parentId={answer.id}
        onSubmit={
          onCommentSubmit
            ? (content) => onCommentSubmit(answer.id, content)
            : undefined
        }
      />
    </article>
  );
};

export const AnswerThread: React.FC<AnswerThreadProps> = ({
  answers,
  postId,
  acceptedAnswerId,
  postStatus,
  comments = [],
  onAccept,
  onCommentSubmit,
}) => {
  const acceptMutation = useAcceptAnswer(postId);
  const canAccept = postStatus === 'OPEN' && onAccept != null;

  return (
    <div className="space-y-4">
      {answers.map((answer) => (
        <AnswerCard
          key={answer.id}
          answer={answer}
          postId={postId}
          isAccepted={acceptedAnswerId === answer.id}
          canAccept={!!canAccept}
          comments={comments.filter(
            (c) => c.parentType === 'answer' && c.parentId === answer.id
          )}
          onAccept={onAccept ?? (() => {})}
          acceptMutation={acceptMutation}
          onCommentSubmit={onCommentSubmit}
        />
      ))}
    </div>
  );
};
