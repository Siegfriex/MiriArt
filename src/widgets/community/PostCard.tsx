/**
 * @fileoverview 피드 카드 1장. 자유글/Q&A 타입 분기.
 * PersonaAvatar + 제목 + 본문 미리보기 + 이미지 + 태그 + 통계.
 * @참조 HomeFeed
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart } from 'lucide-react';
import { Post } from '../../entities/community/model/post';
import { PersonaAvatar } from '../../shared/ui/PersonaAvatar';
import { TagChip } from '../../shared/ui/TagChip';
import { DeadlineTimer } from '../../shared/ui/DeadlineTimer';
import { useLikeToggle } from '../../features/community/useLikeToggle';

interface PostCardProps {
  post: Post;
}

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/** 피드 카드. PostDetail 또는 QnaDetail로 이동. */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { isLiked, count: likeCount, toggle } = useLikeToggle(
    post.isLiked ?? false,
    post.likeCount
  );

  const handleClick = () => {
    navigate(post.type === 'qna' ? `/qna/${post.id}` : `/posts/${post.id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <article
      onClick={handleClick}
      className="bg-dark-800 rounded-xl border border-white/5 p-4 space-y-3 cursor-pointer hover:border-white/10 transition-colors active:bg-dark-700"
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
        <span className="text-[11px] text-text-low flex-shrink-0 mt-0.5">
          {relativeTime(post.createdAt)}
        </span>
      </div>

      {/* 제목 */}
      <div>
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
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
        <div className="w-full h-32 rounded-lg overflow-hidden border border-white/5">
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
            <span className="text-[10px] bg-primary-lime/10 text-primary-lime px-2 py-0.5 rounded-full font-medium">
              ✅ 채택됨
            </span>
          )}
          {post.type === 'qna' && post.status === 'EXPIRED' && (
            <span className="text-[10px] bg-white/5 text-text-low px-2 py-0.5 rounded-full">
              마감
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
