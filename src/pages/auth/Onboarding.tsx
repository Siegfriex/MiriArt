/**
 * @fileoverview 온보딩 페이지. 3개 슬라이드, 마지막에 Signup으로 이동.
 * @참조 AppRouter
 * @라우팅 /onboarding
 * @상태 useState (current)
 */

import React, { useState } from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';
import { useUserStore } from '../../shared/model/userStore';
import { FullScreenContainer } from '../../shared/ui/FullScreenContainer';

const SLIDES = [
  {
    title: STRINGS.ONBOARDING_SLIDE1_TITLE,
    desc: STRINGS.ONBOARDING_SLIDE1_DESC,
    image: 'https://picsum.photos/400/400?random=101',
  },
  {
    title: STRINGS.ONBOARDING_SLIDE2_TITLE,
    desc: STRINGS.ONBOARDING_SLIDE2_DESC,
    image: 'https://picsum.photos/400/400?random=102',
  },
  {
    title: STRINGS.ONBOARDING_SLIDE3_TITLE,
    desc: STRINGS.ONBOARDING_SLIDE3_DESC,
    image: 'https://picsum.photos/400/400?random=103',
  },
];

/** 온보딩. @참조 AppRouter @상태 current */
export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      // 마지막 슬라이드 '시작하기': OAuth 로그인된 사용자는 앱 홈으로, 비로그인은 회원가입으로
      if (isAuthenticated) {
        navigate(ROUTES.APP.HOME);
      } else {
        navigate(ROUTES.AUTH.SIGNUP);
      }
    }
  };

  /** 건너뛰기: 이미 로그인된 경우 앱 홈으로, 비로그인 시 로그인 페이지로 */
  const handleSkip = () => {
    if (isAuthenticated) {
      navigate(ROUTES.APP.HOME);
    } else {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <FullScreenContainer scroll="none">
      <div className="flex justify-end h-12 items-center">
        <button
          onClick={handleSkip}
          className="text-text-mid text-sm font-medium hover:text-text-primary transition-colors"
        >
          {STRINGS.SKIP}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10 text-center mt-4">
        <div className="relative w-72 h-80 rounded-[32px] overflow-hidden border border-border-default shadow-elevated">
          <img
            src={SLIDES[current].image}
            className="w-full h-full object-cover opacity-80"
            alt={`?????? ${current + 1}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
            <div className="w-full h-1 bg-primary-lime/50 rounded-full mb-2" />
          </div>
        </div>

        <div className="space-y-4 max-w-xs animate-fade-in" key={current}>
          <H1 className="text-text-primary leading-tight">{SLIDES[current].title}</H1>
          <BodyText className="text-text-mid">{SLIDES[current].desc}</BodyText>
        </div>
      </div>

      <div className="py-8 space-y-8">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-primary-lime' : 'w-1.5 bg-surface-tertiary'
              }`}
            />
          ))}
        </div>

        <Button
          fullWidth
          onClick={handleNext}
          size="lg"
          className="text-base font-bold h-14 rounded-2xl"
        >
          {current === SLIDES.length - 1 ? STRINGS.ONBOARDING_GET_STARTED : STRINGS.NEXT}
        </Button>
      </div>
    </FullScreenContainer>
  );
};
