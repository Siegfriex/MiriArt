/**
 * @fileoverview Q&A 스레드 상세 페이지. useQuery + CommentSection, AnswerThread, AiSummaryCard.
 * @참조 AppRouter, communityQueries
 * @라우팅 /qna/:id
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { postDetailOptions } from '@/entities/community/api/communityQueries';
import { PersonaAvatar } from '@/shared/ui/PersonaAvatar';
import { TagChip } from '@/shared/ui/TagChip';
import { DeadlineTimer } from '@/shared/ui/DeadlineTimer';
import { Button } from '@/shared/ui/Button';
import { TextInput } from '@/shared/ui/TextInput';
import { LikeButton } from '@/shared/ui/LikeButton';
import { useLikeToggle } from '@/features/community/useLikeToggle';
import { CommentSection } from '@/widgets/community/CommentSection';
import { AnswerThread } from '@/widgets/community/AnswerThread';
import { AiSummaryCard } from '@/widgets/community/AiSummaryCard';
import { AiSkeleton } from '@/shared/ui/ai';
import { AiErrorState } from '@/shared/ui/ai';
import { STRINGS } from '@/shared/config/strings';
import { FullScreenContainer } from '@/shared/ui/FullScreenContainer';

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return STRINGS.TIME_JUST_NOW;
  if (diff < 3600) return STRINGS.TIME_MINUTES(Math.floor(diff / 60));
  if (diff < 86400) return STRINGS.TIME_HOURS(Math.floor(diff / 3600));
  return STRINGS.TIME_DAYS(Math.floor(diff / 86400));
}

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  OPEN: { text: STRINGS.QNA_STATUS_OPEN, cls: 'bg-semantic-error/10 text-semantic-error' },
  SOLVED: { text: STRINGS.QNA_STATUS_SOLVED, cls: 'bg-primary-lime/10 text-primary-lime' },
  EXPIRED: { text: STRINGS.QNA_STATUS_EXPIRED, cls: 'bg-white/5 text-text-low' },
  CLOSED: { text: STRINGS.QNA_STATUS_CLOSED, cls: 'bg-white/5 text-text-low' },
};

/** Q&A 스레드 상세 페이지. */
export const QnaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isPending, error, refetch } = useQuery(postDetailOptions(id ?? ''));
  const [answerText, setAnswerText] = useState('');
  const [aiSummaryStatus, setAiSummaryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const likeToggle = useLikeToggle('post', post?.id ?? '', {
    initialLiked: post?.isLiked ?? false,
    initialCount: post?.likeCount ?? 0,
  });

  if (id == null) {
    return (
      <div className="fixed inset-0 bg-surface flex items-center justify-center z-priority">
        <div className="text-text-mid text-sm">{STRINGS.QNA_DETAIL_NOT_FOUND}</div>
      </div>
    );
  }

  if (isPending) {
    return (
      <FullScreenContainer scroll="none">
        <header className="h-14 flex items-center px-page-x border-b border-border-default" />
        <div className="p-page-x py-4">
          <AiSkeleton lines={5} />
        </div>
      </FullScreenContainer>
    );
  }

  if (error || !post) {
    return (
      <FullScreenContainer scroll="none">
        <AiErrorState
          title={STRINGS.QNA_DETAIL_NOT_FOUND}
          onRetry={() => refetch()}
          variant="fullscreen"
        />
      </FullScreenContainer>
    );
  }

  const statusInfo = STATUS_LABEL[post.status] ?? STATUS_LABEL.OPEN;
  const answers = post.answers ?? [];
  const postComments = (post.comments ?? []).filter(
    (c) => c.parentType === 'post' && c.parentId === post.id
  );

  return (
    <FullScreenContainer scroll="none" className="pb-20">
      <header className="h-14 flex items-center justify-between px-page-x border-b border-border-default flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-text-mid hover:text-text-primary transition-colors">
            <ArrowLeft size={22} />
          </button>
          <span className="text-sm font-medium text-text-primary">{STRINGS.QNA_DETAIL_HEADER}</span>
        </div>
        <span className={`text-tiny px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>
          {statusInfo.text}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-page-x space-y-4">
          <div className="flex items-start justify-between">
            <PersonaAvatar
              displayName={post.persona.displayName}
              colorToken={post.persona.colorToken}
              grade={post.grade}
              domain={post.domain}
              reputationLevel={post.reputationLevel}
            />
            <span className="text-xs text-text-low mt-1">{relativeTime(post.createdAt)}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-base font-bold text-text-primary leading-snug">
              <span className="text-primary-lime mr-1">[Q]</span>
              {post.title}
            </h1>
            <p className="text-sm text-text-mid leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.imageUrls?.length > 0 && post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="첨부 이미지" className="w-full rounded-xl border border-border-default" />
          ))}

          <div className="flex flex-wrap items-center gap-2">
            {post.tags?.map((tag) => <TagChip key={tag} label={tag} />)}
            {post.status === 'OPEN' && post.deadlineAt && (
              <DeadlineTimer deadlineAt={post.deadlineAt} />
            )}
          </div>

          <div className="flex items-center gap-4 pt-2 border-t border-border-default">
            <LikeButton
              count={likeToggle.count}
              isLiked={likeToggle.isLiked}
              onToggle={likeToggle.toggle}
              size="sm"
            />
            <span className="text-sm text-text-mid">
              📝 {STRINGS.QNA_ANSWERS_COUNT(answers.length)}
            </span>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-text-primary transition-colors ml-auto">
              <Bookmark size={16} />
            </button>
          </div>

          <div className="pt-2 pb-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                const el = document.querySelector<HTMLElement>('[data-answer-input]');
                el?.scrollIntoView({ behavior: 'smooth' });
                const input = el?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
                if (input) requestAnimationFrame(() => input.focus());
              }}
            >
              {STRINGS.QNA_ANSWER_CTA}
            </Button>
          </div>

          <CommentSection
            comments={postComments}
            parentType="post"
            parentId={post.id}
          />

          <AnswerThread
            answers={answers}
            postId={post.id}
            acceptedAnswerId={answers.find((a) => a.isAccepted)?.id ?? null}
            postStatus={post.status}
            comments={post.comments ?? []}
          />

          <AiSummaryCard
            postId={post.id}
            status={aiSummaryStatus}
            onRetry={() => setAiSummaryStatus('loading')}
          />
        </div>
      </div>

      <div className="p-page-x border-t border-border-default flex-shrink-0" data-answer-input>
        <div className="flex gap-2">
          <TextInput
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder={STRINGS.QNA_PLACEHOLDER}
            size="md"
            className="flex-1"
          />
          <Button
            onClick={() => {
              console.log('답변 작성:', answerText);
              setAnswerText('');
            }}
            disabled={!answerText.trim()}
            size="md"
            className="shrink-0"
          >
            {STRINGS.QNA_ANSWER_BUTTON}
          </Button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
