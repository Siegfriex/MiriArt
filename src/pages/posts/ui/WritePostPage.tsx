/**
 * @fileoverview 글쓰기/질문하기 Full Page. useSearchParams에서 type 파라미터 읽기.
 * @참조 AppRouter
 * @라우팅 /write?type=free|qna
 */

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { H2 } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { TagChip } from '../../../shared/ui/TagChip';
import { useCreatePost } from '../../../features/community/useCreatePost';
import { PostType } from '../../../entities/community/model/post';

const PRESET_TAGS = ['석고', '정물', '풍경', '인체', '색채', '구도', '수채화', '기초디자인'];
const DEADLINE_OPTIONS: { label: string; value: 24 | 48 | 72 }[] = [
  { label: '24시간', value: 24 },
  { label: '48시간', value: 48 },
  { label: '72시간', value: 72 },
];

/** 글쓰기/질문하기 페이지. */
export const WritePostPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = (searchParams.get('type') ?? 'free') as PostType;
  const {
    formState, setTitle, setContent, toggleTag,
    setIsAnonymous, setDeadlineHours,
    addImage, removeImage,
    isSubmitting, submit,
  } = useCreatePost(initialType);

  const isQna = formState.type === 'qna';
  const pageTitle = isQna ? '질문하기' : '자유글 쓰기';

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 text-text-mid hover:text-white transition-colors">
          <X size={22} />
        </button>
        <H2 className="text-white text-sm">{pageTitle}</H2>
        <Button
          size="sm"
          onClick={submit}
          disabled={isSubmitting || !formState.title.trim() || !formState.content.trim()}
          className="rounded-xl"
        >
          {isSubmitting ? '등록 중...' : '등록'}
        </Button>
      </header>

      {/* 폼 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        {/* 제목 */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            제목 (필수)
          </label>
          <input
            type="text"
            maxLength={100}
            value={formState.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isQna ? '궁금한 점을 간단히 적어주세요' : '제목을 입력하세요'}
            className="w-full bg-dark-800 text-white rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary-lime text-sm placeholder-text-low"
          />
          <div className="text-right text-[10px] text-text-low">{formState.title.length}/100</div>
        </div>

        {/* 본문 */}
        <div className="space-y-1.5">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            {isQna ? '질문 내용 (필수)' : '본문 (필수)'}
          </label>
          <textarea
            maxLength={2000}
            value={formState.content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isQna ? '구체적으로 설명할수록 좋은 답변을 받을 수 있어요' : '내용을 입력하세요'}
            rows={6}
            className="w-full bg-dark-800 text-white rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary-lime text-sm resize-none placeholder-text-low"
          />
          <div className="text-right text-[10px] text-text-low">{formState.content.length}/2000</div>
        </div>

        {/* 이미지 첨부 */}
        <div className="space-y-2">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            이미지 첨부 (최대 5장)
          </label>
          <div className="flex gap-2 flex-wrap">
            {formState.images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                >
                  ×
                </button>
              </div>
            ))}
            {formState.images.length < 5 && (
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary-lime/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) addImage(e.target.files[0]); }}
                />
                <ImageIcon size={24} className="text-text-low" />
              </label>
            )}
          </div>
        </div>

        {/* 태그 */}
        <div className="space-y-2">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">태그</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  formState.tags.includes(tag)
                    ? 'bg-primary-lime/10 border-primary-lime text-primary-lime'
                    : 'border-white/10 text-text-mid hover:border-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {formState.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {formState.tags.map((tag) => <TagChip key={tag} label={tag} />)}
            </div>
          )}
        </div>

        {/* Q&A 전용: 마감 시간 */}
        {isQna && (
          <div className="space-y-2">
            <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
              마감 시간
            </label>
            <div className="flex gap-2">
              {DEADLINE_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDeadlineHours(value)}
                  className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${
                    formState.deadlineHours === value
                      ? 'bg-primary-lime/10 border-primary-lime text-primary-lime'
                      : 'border-white/10 text-text-mid hover:border-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 익명 */}
        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <span className="text-sm text-white">익명으로 게시</span>
          <button
            onClick={() => setIsAnonymous(!formState.isAnonymous)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              formState.isAnonymous ? 'bg-primary-lime' : 'bg-dark-700'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              formState.isAnonymous ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* AI에게 먼저 물어보기 (Phase C4 자리) */}
        <div className="rounded-xl border border-white/5 bg-dark-800 p-4 flex items-center gap-3 opacity-50">
          <Sparkles size={20} className="text-primary-lime flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-white">AI에게 먼저 물어보기</div>
            <div className="text-xs text-text-mid">Phase C4에서 구현 예정</div>
          </div>
        </div>
      </div>
    </div>
  );
};
