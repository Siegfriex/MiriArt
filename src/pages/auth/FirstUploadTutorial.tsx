/**
 * @fileoverview 첫 업로드 튜토리얼. 지금 업로드 클릭 시 Home 이동 후 UPLOAD_FLOW 모달 열림.
 * @참조 AppRouter
 * @라우팅 /tutorial
 * @상태 useModalStore
 */

import React from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../shared/model/modalStore';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';
import { FullScreenContainer } from '../../shared/ui/FullScreenContainer';

/** 첫 업로드 튜토리얼. @참조 AppRouter @상태 useModalStore */
export const FirstUploadTutorial: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const handleStart = () => {
    navigate(ROUTES.APP.HOME);
    setTimeout(() => {
      openModal('UPLOAD_FLOW');
    }, 500);
  };

  return (
    <FullScreenContainer scroll="none" className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-base flex flex-col items-center max-w-xs">
        <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-glow animate-pulse">
          <UploadCloud className="text-primary-lime" size={48} />
        </div>

        <H1 className="text-white mb-4 leading-tight">{STRINGS.TUTORIAL_TITLE}</H1>

        <BodyText className="text-text-mid mb-10">{STRINGS.TUTORIAL_DESC}</BodyText>

        <Button
          size="lg"
          onClick={handleStart}
          className="w-full rounded-2xl h-14 text-base font-bold shadow-glow"
        >
          {STRINGS.TUTORIAL_BUTTON}
        </Button>
      </div>
    </FullScreenContainer>
  );
};
