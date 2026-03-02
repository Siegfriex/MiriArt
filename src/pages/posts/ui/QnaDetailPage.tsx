/**
 * @fileoverview Q&A 스레드 상세 페이지.
 * @참조 AppRouter
 * @라우팅 /qna/:id
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Sparkles, MessageCircle } from 'lucide-react';
import { MOCK_POSTS, MOCK_ANSWERS } from '../../../entities/community/model/mock';
import { PersonaAvatar } from '../../../shared/ui/PersonaAvatar';
import { TagChip } from '../../../shared/ui/TagChip';
import { DeadlineTimer } from '../../../shared/ui/DeadlineTimer';
import { Button } from '../../../shared/ui/Button';
import { TextInput } from '../../../shared/ui/TextInput';
import { useLikeToggle } from '../../../features/community/useLikeToggle';
import { STRINGS } from '../../../shared/config/strings';
import { FullScreenContainer } from '../../../shared/ui/FullScreenContainer';

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
  const post = MOCK_POSTS.find((p) => p.id === id);
  const answers = MOCK_ANSWERS.filter((a) => a.postId === id);
  const [answerText, setAnswerText] = useState('');
  const { isLiked, count: likeCount, toggle } = useLikeToggle(
    post?.isLiked ?? false,
    post?.likeCount ?? 0
  );

  if (!post) {
    return (
      <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-priority">
        <div className="text-text-mid text-sm">{STRINGS.QNA_DETAIL_NOT_FOUND}</div>
      </div>
    );
  }

  const statusInfo = STATUS_LABEL[post.status] ?? STATUS_LABEL.OPEN;

  return (
    <FullScreenContainer scroll="none" className="pb-20">
      {/* 헤더 */}
      <header className="h-14 flex items-center justify-between px-page-x border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 text-text-mid hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <span className="text-sm font-medium text-white">{STRINGS.QNA_DETAIL_HEADER}</span>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>
          {statusInfo.text}
        </span>
      </header>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-page-x space-y-4">
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
            <span className="text-sm text-text-mid">
              📝 {STRINGS.QNA_ANSWERS_COUNT(answers.length)}
            </span>
            <button className="flex items-center gap-1.5 text-sm text-text-mid hover:text-white transition-colors ml-auto">
              <Bookmark size={16} />
            </button>
          </div>

          {/* 답변 작성하기 CTA (설계서: 본문 아래 버튼) */}
          <div className="pt-2 pb-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                const el = document.querySelector<HTMLElement>('[data-answer-input]');
                el?.scrollIntoView({ behavior: 'smooth' });
                const input = el?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
                if (input) {
                  requestAnimationFrame(() => input.focus());
                }
              }}
            >
              {STRINGS.QNA_ANSWER_CTA}
            </Button>
          </div>

          {/* 답변 목록 */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-white pt-2">
              {STRINGS.QNA_ANSWERS_COUNT(answers.length)}
            </h2>
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
                      <span className="text-micro bg-primary-lime/10 text-primary-lime px-2 py-0.5 rounded-full font-semibold">
                        {STRINGS.QNA_ACCEPTED_BADGE}
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
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    {STRINGS.QNA_COMMENTS(answer.commentCount ?? 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AI 요약 카드 (Phase C4 자리) */}
          <div className="rounded-medium border border-white/5 bg-dark-800 p-4 flex items-center gap-3 opacity-50">
            <Sparkles size={18} className="text-primary-lime flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-white">{STRINGS.QNA_AI_SUMMARY_TITLE}</div>
              <div className="text-xs text-text-mid">{STRINGS.QNA_AI_SUMMARY_PLACEHOLDER}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 답변 입력 */}
      <div className="p-page-x border-t border-white/5 flex-shrink-0" data-answer-input>
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
