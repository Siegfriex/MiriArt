/**
 * @fileoverview 글쓰기 Bottom Sheet. FAB에서 열림.
 * [✏️ 자유글 쓰기] [❓ 질문하기] 두 버튼 → WritePostPage 이동.
 * @참조 Home Page, modalStore (WRITE_POST_SHEET)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, HelpCircle, UploadCloud, X } from 'lucide-react';
import { useModalStore } from '../../shared/model/modalStore';

/** 글쓰기 Bottom Sheet. */
export const WritePostSheet: React.FC = () => {
  const { closeModal, openModal } = useModalStore();
  const navigate = useNavigate();

  const handleFreePost = () => {
    closeModal();
    navigate('/write?type=free');
  };

  const handleQnaPost = () => {
    closeModal();
    navigate('/write?type=qna');
  };

  const handleUpload = () => {
    closeModal();
    openModal('UPLOAD_FLOW');
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center bg-black/40" onClick={closeModal}>
      <div
        className="bg-dark-800 w-full rounded-t-3xl p-6 space-y-3 border-t border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-dark-600 rounded-full mx-auto mb-4" />

        <button
          onClick={handleUpload}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-primary-lime/10 border border-primary-lime/20 hover:bg-primary-lime/15 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary-lime/20 flex items-center justify-center flex-shrink-0">
            <UploadCloud size={20} className="text-primary-lime" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">작품 분석</div>
            <div className="text-xs text-text-mid">AI가 8초 만에 5축 채점</div>
          </div>
        </button>

        <button
          onClick={handleFreePost}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-dark-700 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
            <Pencil size={20} className="text-text-mid" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">자유글 쓰기</div>
            <div className="text-xs text-text-mid">작품 공유, 팁 나누기</div>
          </div>
        </button>

        <button
          onClick={handleQnaPost}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-dark-700 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
            <HelpCircle size={20} className="text-text-mid" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">질문하기</div>
            <div className="text-xs text-text-mid">커뮤니티에 Q&A 올리기</div>
          </div>
        </button>

        <button
          onClick={closeModal}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-text-mid hover:text-white transition-colors"
        >
          <X size={16} />
          취소
        </button>
        <div className="h-2" />
      </div>
    </div>
  );
};
