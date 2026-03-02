/**
 * @fileoverview 글쓰기 Bottom Sheet. FAB에서 열림.
 * [✏️ 자유글 쓰기] [❓ 질문하기] 두 버튼 → WritePostPage 이동.
 * @참조 Home Page, modalStore (WRITE_POST_SHEET)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, HelpCircle, UploadCloud, X } from 'lucide-react';
import { useModalStore } from '../../shared/model/modalStore';
import { ROUTES } from '../../shared/config/routes';
import { STRINGS } from '../../shared/config/strings';
import { Button } from '../../shared/ui/Button';

/** 글쓰기 Bottom Sheet. */
export const WritePostSheet: React.FC = () => {
  const { closeModal, openModal } = useModalStore();
  const navigate = useNavigate();

  const handleFreePost = () => {
    closeModal();
    navigate(`${ROUTES.WRITE}?type=free`);
  };

  const handleQnaPost = () => {
    closeModal();
    navigate(`${ROUTES.WRITE}?type=qna`);
  };

  const handleUpload = () => {
    closeModal();
    openModal('UPLOAD_FLOW');
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center bg-black/40" onClick={closeModal}>
      <div
        className="bg-surface-alt w-full rounded-t-3xl p-6 space-y-3 border-t border-border-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-dark-600 rounded-full mx-auto mb-4" />

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-4 px-4 py-4 rounded-large bg-primary-lime/10 border-primary-lime/20 hover:bg-primary-lime/15"
          onClick={handleUpload}
        >
          <div className="w-10 h-10 rounded-full bg-primary-lime/20 flex items-center justify-center flex-shrink-0">
            <UploadCloud size={20} className="text-primary-lime" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-text-primary">{STRINGS.WRITE_SHEET_UPLOAD_TITLE}</div>
            <div className="text-xs text-text-mid">{STRINGS.WRITE_SHEET_UPLOAD_DESC}</div>
          </div>
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center gap-4 px-4 py-4 rounded-large"
          onClick={handleFreePost}
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
            <Pencil size={20} className="text-text-mid" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-text-primary">{STRINGS.WRITE_SHEET_FREE_TITLE}</div>
            <div className="text-xs text-text-mid">{STRINGS.WRITE_SHEET_FREE_DESC}</div>
          </div>
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center gap-4 px-4 py-4 rounded-large"
          onClick={handleQnaPost}
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
            <HelpCircle size={20} className="text-text-mid" />
          </div>
          <div className="text-left flex-1">
            <div className="text-sm font-semibold text-text-primary">{STRINGS.WRITE_SHEET_QNA_TITLE}</div>
            <div className="text-xs text-text-mid">{STRINGS.WRITE_SHEET_QNA_DESC}</div>
          </div>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-center gap-2 py-3"
          onClick={closeModal}
        >
          <X size={16} />
          {STRINGS.CANCEL}
        </Button>
        <div className="h-2" />
      </div>
    </div>
  );
};
