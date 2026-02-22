/**
 * @fileoverview 로그인 페이지. 이메일, 비밀번호 입력, 제출 시 Home으로 이동.
 * @참조 AppRouter
 * @라우팅 /auth/login
 * @상태 useState (email, password)
 */

import React, { useState } from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';

/** 로그인. @참조 AppRouter @상태 email, password */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.APP.HOME);
  };

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col px-5 py-6 z-priority">
      <header className="h-14 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-text-mid hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8 max-w-sm mx-auto w-full">
        <div>
          <H1 className="text-white mb-2">{STRINGS.LOGIN_TITLE}</H1>
          <BodyText className="text-text-mid">{STRINGS.LOGIN_SUBTITLE}</BodyText>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs text-text-mid ml-1 font-medium uppercase tracking-wider">
              {STRINGS.LOGIN_EMAIL}
            </label>
            <input
              type="email"
              className="w-full bg-dark-800 text-white rounded-xl px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime border border-white/5 transition-all placeholder-text-low"
              placeholder="hello@miriart.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-mid ml-1 font-medium uppercase tracking-wider">
              {STRINGS.LOGIN_PASSWORD}
            </label>
            <input
              type="password"
              className="w-full bg-dark-800 text-white rounded-xl px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime border border-white/5 transition-all placeholder-text-low"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-6">
            <Button fullWidth type="submit" size="lg" className="rounded-2xl h-14 text-base font-bold">
              {STRINGS.LOGIN_BUTTON}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
            className="text-sm text-text-mid hover:text-primary-lime transition-colors p-2"
          >
            {STRINGS.LOGIN_TO_SIGNUP}{' '}
            <span className="font-bold text-white">{STRINGS.LOGIN_SIGNUP_LINK}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
