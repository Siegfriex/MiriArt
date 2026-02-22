/**
 * @fileoverview Q&A 스레드 상세 페이지.
 * @참조 AppRouter
 * @라우팅 /qna/:id
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Sparkles } from 'lucide-react';
import { MOCK_POSTS, MOCK_ANSWERS } from '../../../entities/community/model/mock';
import { PersonaAvatar } from '../../../shared/ui/PersonaAvatar';
import { TagChip } from '../../../shared/ui/TagChip';
import { DeadlineTimer } from '../../../shared/ui/DeadlineTimer';
import { useLikeToggle } from '../../../features/community/useLikeToggle';

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  OPEN:    { text: '미해결 🔴', cls: 'bg-semantic-error/10 text-semantic-error' },
  SOLVED:  { text: '해결됨 ✅', cls: 'bg-primary-lime/10 text-primary-lime' },
  EXPIRED: { text: '마감됨', cls: 'bg-white/5 text-text-low' },
  CLOSED:  { text: '닫힘', cls: 'bg-white/5 text-text-low' },
};

/** Q&A 스레드 상세 페이지. */
export const QnaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = MOCK_POSTS.find((p) => p.id === id);
  const answers = MOCK_ANSWERS.filter((a) => a.postId === id);
  const [answerText, setAnswerText] = useState('');
  const { isLiked, count: likeCount, toggle } = useLikeToggle(
    post?.isLiked ?? false,
    post?.likeCount ?? 0
  );

  if (!post) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center">
        <div className="text-text-mid text-sm">Q&A를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const statusInfo = STATUS_LABEL[post.status] ?? STATUS_LABEL.OPEN;

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-text-mid hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <span className="text-sm font-medium text-white">Q&A</span>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>
          {statusInfo.text}
        </span>
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 space-y-4">
          {/* 질문 헤더 */}
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
            <h1 className="text-base font-bold text-white leading-snug">
              <span className="text-primary-lime mr-1">[Q]</span>
              {post.title}
            </h1>
            <p className="text-sm text-text-mid leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* 이미지 */}
          {post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="첨부 이미지" className="w-full rounded-xl border border-white/5" />
          ))}

          {/* 태그 + 마감 */}
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => <TagChip key={tag} label={tag} />)}
            {post.status === 'OPEN' && post.deadlineAt && (
              <DeadlineTimer deadlineAt={post.deadlineAt} />
            )}
          </div>

          {/* 반응 */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/5">
            <button
              onClick={toggle}
              className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? 'text-semantic-error' : 'text-text-mid hover:text-semantic-error'}`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              {likeCount}
            </button>
            <span className="text-sm text-text-mid">📝 답변 {answers.length}개</span>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-white transition-colors ml-auto">
              <Bookmark size={16} />
            </button>
          </div>

          {/* 답변 목록 */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white pt-2">답변 {answers.length}개</h2>
            {answers.map((answer) => (
              <div
                key={answer.id}
                className={`rounded-xl border p-4 space-y-3 ${
                  answer.isAccepted
                    ? 'border-primary-lime/30 bg-primary-lime/5'
                    : 'border-white/5 bg-dark-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <PersonaAvatar
                    displayName={answer.persona.displayName}
                    colorToken={answer.persona.colorToken}
                    reputationLevel={answer.reputationLevel}
                    size="sm"
                  />
                  <div className="flex items-center gap-2">
                    {answer.isAccepted && (
                      <span className="text-[10px] bg-primary-lime/10 text-primary-lime px-2 py-0.5 rounded-full font-semibold">
                        ✅ 채택됨
                      </span>
                    )}
                    <span className="text-[11px] text-text-low">{relativeTime(answer.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-text-mid leading-relaxed">{answer.content}</p>
                <div className="flex items-center gap-3 text-xs text-text-mid">
                  <span className="flex items-center gap-1">
                    <Heart size={12} />
                    {answer.likeCount}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI 요약 카드 (Phase C4 자리) */}
          <div className="rounded-xl border border-white/5 bg-dark-800 p-4 flex items-center gap-3 opacity-50">
            <Sparkles size={18} className="text-primary-lime flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-white">AI가 답변 요약/보충</div>
              <div className="text-xs text-text-mid">Phase C4에서 구현 예정</div>
            </div>
          </div>
        </div>
      </div>

      {/* 답변 입력 */}
      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="답변을 입력하세요..."
            className="flex-1 bg-dark-800 text-white text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary-lime placeholder-text-low"
          />
          <button
            onClick={() => { console.log('답변 작성:', answerText); setAnswerText(''); }}
            disabled={!answerText.trim()}
            className="px-4 py-3 bg-primary-lime text-dark-900 text-sm font-semibold rounded-xl disabled:opacity-40 hover:bg-primary-lime/90 transition-colors"
          >
            답변
          </button>
        </div>
      </div>
    </div>
  );
};
