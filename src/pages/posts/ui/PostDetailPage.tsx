/**
 * @fileoverview 자유글 상세 페이지. useQuery + CommentSection, LikeButton.
 * @참조 AppRouter, communityQueries
 * @라우팅 /posts/:id
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Bookmark, Flag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { postDetailOptions } from '@/entities/community/api/communityQueries';
import { PersonaAvatar } from '@/shared/ui/PersonaAvatar';
import { TagChip } from '@/shared/ui/TagChip';
import { Button } from '@/shared/ui/Button';
import { TextInput } from '@/shared/ui/TextInput';
import { useLikeToggle } from '@/features/community/useLikeToggle';
import { LikeButton } from '@/shared/ui/LikeButton';
import { CommentSection } from '@/widgets/community/CommentSection';
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

/** 자유글 상세 페이지. */
export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isPending, error, refetch } = useQuery(postDetailOptions(id ?? ''));
  const likeToggle = useLikeToggle('post', post?.id ?? '', {
    initialLiked: post?.isLiked ?? false,
    initialCount: post?.likeCount ?? 0,
  });
  const [commentText, setCommentText] = useState('');

  if (id == null) {
    return (
      <div className="fixed inset-0 bg-surface flex items-center justify-center z-priority">
        <div className="text-text-mid text-sm">{STRINGS.POST_DETAIL_NOT_FOUND}</div>
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
          title={STRINGS.POST_DETAIL_NOT_FOUND}
          onRetry={() => refetch()}
          variant="fullscreen"
        />
      </FullScreenContainer>
    );
  }

  const comments = (post.comments ?? []).filter(
    (c) => c.parentType === 'post' && c.parentId === post.id
  );

  return (
    <FullScreenContainer scroll="none">
      <header className="h-14 flex items-center gap-3 px-page-x border-b border-border-default flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 text-text-mid hover:text-text-primary transition-colors">
          <ArrowLeft size={22} />
        </button>
        <span className="text-sm font-medium text-text-primary">{STRINGS.POST_DETAIL_HEADER}</span>
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
            <h1 className="text-base font-bold text-text-primary leading-snug">{post.title}</h1>
            <p className="text-sm text-text-mid leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.imageUrls?.length > 0 && post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="첨부 이미지" className="w-full rounded-xl border border-border-default" />
          ))}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => <TagChip key={tag} label={tag} />)}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-border-default">
            <LikeButton
              count={likeToggle.count}
              isLiked={likeToggle.isLiked}
              onToggle={likeToggle.toggle}
              size="sm"
            />
            <span className="flex items-center gap-1.5 text-sm text-text-mid">
              <MessageCircle size={16} />
              {comments.length}
            </span>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-text-primary transition-colors ml-auto">
              <Bookmark size={16} />
            </button>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-semantic-error transition-colors">
              <Flag size={16} />
            </button>
          </div>

          <CommentSection
            comments={comments}
            parentType="post"
            parentId={post.id}
          />
        </div>
      </div>

      <div className="p-page-x border-t border-border-default flex-shrink-0">
        <div className="flex gap-2">
          <TextInput
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={STRINGS.POST_DETAIL_PLACEHOLDER}
            size="md"
            className="flex-1"
          />
          <Button
            onClick={() => {
              console.log('댓글 작성:', commentText);
              setCommentText('');
            }}
            disabled={!commentText.trim()}
            size="md"
            className="shrink-0"
          >
            {STRINGS.POST_DETAIL_SEND}
          </Button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
