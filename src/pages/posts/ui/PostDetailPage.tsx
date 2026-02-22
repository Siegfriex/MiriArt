/**
 * @fileoverview 자유글 상세 페이지.
 * @참조 AppRouter
 * @라우팅 /posts/:id
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Flag } from 'lucide-react';
import { MOCK_POSTS, MOCK_COMMENTS } from '../../../entities/community/model/mock';
import { PersonaAvatar } from '../../../shared/ui/PersonaAvatar';
import { TagChip } from '../../../shared/ui/TagChip';
import { useLikeToggle } from '../../../features/community/useLikeToggle';

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/** 자유글 상세 페이지. */
export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = MOCK_POSTS.find((p) => p.id === id);
  const comments = MOCK_COMMENTS.filter((c) => c.parentType === 'post' && c.parentId === id);
  const [commentText, setCommentText] = useState('');
  const { isLiked, count: likeCount, toggle } = useLikeToggle(
    post?.isLiked ?? false,
    post?.likeCount ?? 0
  );

  if (!post) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center">
        <div className="text-text-mid text-sm">게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="h-14 flex items-center gap-3 px-4 border-b border-white/5 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 text-text-mid hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <span className="text-sm font-medium text-white">자유게시판</span>
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 space-y-4">
          {/* 작성자 */}
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

          {/* 제목 + 본문 */}
          <div className="space-y-2">
            <h1 className="text-base font-bold text-white leading-snug">{post.title}</h1>
            <p className="text-sm text-text-mid leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* 이미지 */}
          {post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="첨부 이미지" className="w-full rounded-xl border border-white/5" />
          ))}

          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => <TagChip key={tag} label={tag} />)}
            </div>
          )}

          {/* 반응 */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/5">
            <button
              onClick={toggle}
              className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? 'text-semantic-error' : 'text-text-mid hover:text-semantic-error'}`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              {likeCount}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-text-mid">
              <MessageCircle size={16} />
              {comments.length}
            </span>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-white transition-colors ml-auto">
              <Bookmark size={16} />
            </button>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-semantic-error transition-colors">
              <Flag size={16} />
            </button>
          </div>

          {/* 댓글 영역 */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-white">댓글 {comments.length}</h2>
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-dark-900 mt-0.5"
                  style={{ backgroundColor: c.persona.colorToken }}
                >
                  {c.persona.displayName.charAt(c.persona.displayName.length - 1)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-white">{c.persona.displayName}</span>
                    <span className="text-[10px] text-text-low">{relativeTime(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-text-mid leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 bg-dark-800 text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary-lime placeholder-text-low"
          />
          <button
            onClick={() => { console.log('댓글 작성:', commentText); setCommentText(''); }}
            disabled={!commentText.trim()}
            className="px-4 py-3 bg-primary-lime text-dark-900 text-sm font-semibold rounded-xl disabled:opacity-40 hover:bg-primary-lime/90 transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};
