/**
 * @fileoverview 피드 카드 1장. 자유글/Q&A 타입 분기.
 * PersonaAvatar + 제목 + 본문 미리보기 + 이미지 + 태그 + 통계.
 * @참조 HomeFeed
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';
import { Post } from '../../entities/community/model/post';
import { ROUTES } from '../../shared/config/routes';
import { PersonaAvatar } from '../../shared/ui/PersonaAvatar';
import { TagChip } from '../../shared/ui/TagChip';
import { DeadlineTimer } from '../../shared/ui/DeadlineTimer';
import { useLikeToggle } from '../../features/community/useLikeToggle';
import { STRINGS } from '../../shared/config/strings';

interface PostCardProps {
  post: Post;
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return STRINGS.TIME_JUST_NOW;
  if (diff < 3600) return STRINGS.TIME_MINUTES(Math.floor(diff / 60));
  if (diff < 86400) return STRINGS.TIME_HOURS(Math.floor(diff / 3600));
  return STRINGS.TIME_DAYS(Math.floor(diff / 86400));
}

/** 피드 카드. PostDetail 또는 QnaDetail로 이동. */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { isLiked, count: likeCount, toggle } = useLikeToggle('post', post.id, {
    initialLiked: post.isLiked ?? false,
    initialCount: post.likeCount ?? 0,
  });

  const handleClick = () => {
    if (post.type === 'qna') {
      navigate(ROUTES.QNA_DETAIL(post.id));
    } else {
      navigate(ROUTES.POST_DETAIL(post.id));
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <article
      onClick={handleClick}
      className="bg-surface-alt rounded-xl border border-border-default p-4 space-y-3 cursor-pointer hover:border-border-subtle transition-colors active:bg-surface-tertiary"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <PersonaAvatar
          displayName={post.persona.displayName}
          colorToken={post.persona.colorToken}
          grade={post.grade}
          domain={post.domain}
          reputationLevel={post.reputationLevel}
          size="sm"
        />
        <span className="text-caption text-text-low flex-shrink-0 mt-0.5">
          {relativeTime(post.createdAt)}
        </span>
      </div>

      {/* 제목 */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
          {post.type === 'qna' && (
            <span className="text-primary-lime mr-1">[Q]</span>
          )}
          {post.title}
        </h3>
        <p className="text-xs text-text-mid mt-1 line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* 이미지 썸네일 */}
      {post.imageUrls.length > 0 && (
        <div className="w-full h-32 rounded-lg overflow-hidden border border-border-default">
          <img
            src={post.imageUrls[0]}
            alt="첨부 이미지"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 태그 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      )}

      {/* 하단 통계 */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-4 text-xs text-text-mid">
          <span className="flex items-center gap-1">
            <MessageCircle size={13} />
            {post.type === 'qna' ? post.answerCount : post.commentCount}
          </span>
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-semantic-error' : 'text-text-mid hover:text-semantic-error'}`}
          >
            <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
            {likeCount}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Q&A 상태 뱃지 */}
          {post.type === 'qna' && post.status === 'SOLVED' && (
            <span className="text-micro bg-primary-lime/10 text-primary-lime px-2 py-0.5 rounded-full font-medium">
              {STRINGS.QNA_ACCEPTED_BADGE}
            </span>
          )}
          {post.type === 'qna' && post.status === 'EXPIRED' && (
            <span className="text-micro bg-white/5 text-text-low px-2 py-0.5 rounded-full">
              {STRINGS.QNA_STATUS_EXPIRED}
            </span>
          )}
          {post.type === 'qna' && post.status === 'OPEN' && post.deadlineAt && (
            <DeadlineTimer deadlineAt={post.deadlineAt} />
          )}
        </div>
      </div>
    </article>
  );
};
