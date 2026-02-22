/**
 * @fileoverview 회원가입 페이지. 이메일, 비밀번호, 닉네임, 학년, 전공. 제출 시 Tutorial로 이동.
 * @참조 AppRouter
 * @라우팅 /auth/signup
 * @상태 useState (formData)
 */

import React, { useState } from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';

/** 회원가입. @참조 AppRouter @상태 formData */
export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    grade: STRINGS.GRADE_HS3,
    domain: STRINGS.MAJOR_VISUAL,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.TUTORIAL);
  };

  const update = (key: string, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col px-5 py-6 overflow-y-auto no-scrollbar z-priority">
      <header className="h-14 flex items-center flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-text-mid hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-6 py-4 max-w-sm mx-auto w-full">
        <div>
          <H1 className="text-white mb-2">{STRINGS.SIGNUP_TITLE}</H1>
          <BodyText className="text-text-mid">{STRINGS.SIGNUP_SUBTITLE}</BodyText>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: STRINGS.LOGIN_EMAIL, key: 'email', type: 'email', placeholder: 'name@example.com' },
            { label: STRINGS.LOGIN_PASSWORD, key: 'password', type: 'password', placeholder: '???????????????' },
            { label: STRINGS.SIGNUP_NICKNAME, key: 'nickname', type: 'text', placeholder: '?????????????' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs text-text-mid ml-1 font-medium uppercase tracking-wider">
                {label}
              </label>
              <input
                type={type}
                className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime border border-white/5 placeholder-text-low"
                required
                value={(formData as Record<string, string>)[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="flex gap-3">
            {[
              {
                label: STRINGS.SIGNUP_GRADE,
                key: 'grade',
                options: [STRINGS.GRADE_HS1, STRINGS.GRADE_HS2, STRINGS.GRADE_HS3, STRINGS.GRADE_GAP],
              },
              {
                label: STRINGS.SIGNUP_MAJOR,
                key: 'domain',
                options: [STRINGS.MAJOR_VISUAL, STRINGS.MAJOR_INDUSTRIAL, STRINGS.MAJOR_FINE, STRINGS.MAJOR_CRAFT],
              },
            ].map(({ label, key, options }) => (
              <div key={key} className="flex-1 space-y-1.5">
                <label className="text-xs text-text-mid ml-1 font-medium uppercase tracking-wider">
                  {label}
                </label>
                <select
                  className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime border border-white/5 appearance-none text-sm"
                  value={(formData as Record<string, string>)[key]}
                  onChange={(e) => update(key, e.target.value)}
                >
                  {options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button fullWidth type="submit" size="lg" className="rounded-2xl h-14 text-base font-bold">
              {STRINGS.SIGNUP_BUTTON}
            </Button>
          </div>
        </form>

        <div className="text-center pb-6">
          <button
            onClick={() => navigate(ROUTES.AUTH.LOGIN)}
            className="text-sm text-text-mid hover:text-primary-lime transition-colors p-2"
          >
            {STRINGS.SIGNUP_TO_LOGIN}{' '}
            <span className="font-bold text-white">{STRINGS.SIGNUP_LOGIN_LINK}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
