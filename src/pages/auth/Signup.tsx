/**
 * @fileoverview 회원가입 페이지. 비로그인 시 Google OAuth 진입 + 이메일 폼(튜토리얼 경로). 로그인된 경우 닉네임·학년·전공 PATCH 후 앱 홈.
 * P0: 로그인 시 UserApi.updateProfile 호출, 성공 시 setProfileFromApi(needsProfile=false) 후 /app/home 이동.
 * @참조 AppRouter
 * @라우팅 /auth/signup
 * @상태 useState (formData, isSubmitting)
 */

import React, { useState } from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { TextInput } from '../../shared/ui/TextInput';
import { Select } from '../../shared/ui/Select';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';
import { API_BASE } from '../../shared/config/api';
import { FullScreenContainer } from '../../shared/ui/FullScreenContainer';
import { useUserStore } from '../../shared/model/userStore';
import { useToastStore } from '../../shared/model/toastStore';
import { UserApi, handleApiError } from '../../shared/api/miriartApi';

/** BE PATCH /api/users/me/profile 허용값. value=API 전송값, label=표시용. */
const GRADE_OPTIONS = [
  { value: '고1', label: STRINGS.GRADE_HS1 },
  { value: '고2', label: STRINGS.GRADE_HS2 },
  { value: '고3', label: STRINGS.GRADE_HS3 },
  { value: '재수', label: STRINGS.GRADE_GAP },
  { value: 'N수', label: 'N수' },
] as const;

const DOMAIN_OPTIONS = [
  { value: '기초디자인', label: '기초디자인' },
  { value: '기초소양', label: '기초소양' },
  { value: '수채화', label: '수채화' },
  { value: '소묘', label: '소묘' },
  { value: '사고의전환', label: '사고의전환' },
  { value: '만화·애니', label: '만화·애니' },
] as const;

/** 회원가입. @참조 AppRouter @상태 formData, isSubmitting */
export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setProfileFromApi } = useUserStore();
  const showToast = useToastStore((s) => s.show);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    grade: '고3',
    domain: '기초디자인',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isAuthenticated) {
      const nickname = formData.nickname.trim();
      if (nickname.length < 2) {
        showToast('닉네임은 2자 이상 입력해주세요.', 'error');
        return;
      }
      setIsSubmitting(true);
      try {
        const { needsProfile } = await UserApi.updateProfile({
          nickname,
          grade: formData.grade,
          domain: formData.domain,
        });
        setProfileFromApi({
          nickname,
          grade: formData.grade,
          domain: formData.domain,
          needsProfile: !!needsProfile,
        });
        showToast('프로필이 저장되었습니다.', 'success');
        navigate(ROUTES.APP.HOME, { replace: true });
      } catch (err) {
        const msg = handleApiError(err);
        showToast(msg, 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      navigate(ROUTES.TUTORIAL);
    }
  };

  const update = (key: string, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleGoogleSignup = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <FullScreenContainer scroll="y" className="no-scrollbar">
      <header className="h-14 flex items-center flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-text-mid hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-6 py-4 max-w-sm mx-auto w-full">
        <div>
          <H1 className="mb-2">{STRINGS.SIGNUP_TITLE}</H1>
          <BodyText className="text-text-mid">{STRINGS.SIGNUP_SUBTITLE}</BodyText>
        </div>

        {!isAuthenticated && (
          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              variant="secondary"
              type="button"
              className="rounded-2xl h-14 text-base font-bold"
              onClick={handleGoogleSignup}
            >
              Google로 시작하기
            </Button>
            <BodyText className="text-text-mid text-center text-xs">
              SNS 가입은 Google 계정만 지원합니다.
            </BodyText>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: STRINGS.LOGIN_EMAIL, key: 'email', type: 'email', placeholder: 'name@example.com' },
            { label: STRINGS.LOGIN_PASSWORD, key: 'password', type: 'password', placeholder: '???????????????' },
            { label: STRINGS.SIGNUP_NICKNAME, key: 'nickname', type: 'text', placeholder: '?????????????' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label htmlFor={key} className="text-xs text-text-mid ml-1 font-medium uppercase tracking-wider">
                {label}
              </label>
              <TextInput
                id={key}
                type={type}
                required
                value={(formData as Record<string, string>)[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="flex gap-3">
            {[
              { label: STRINGS.SIGNUP_GRADE, key: 'grade' as const, options: GRADE_OPTIONS },
              { label: STRINGS.SIGNUP_MAJOR, key: 'domain' as const, options: DOMAIN_OPTIONS },
            ].map(({ label, key, options }) => (
              <div key={key} className="flex-1 space-y-1.5">
                <label htmlFor={key} className="text-xs text-text-mid ml-1 font-medium uppercase tracking-wider">
                  {label}
                </label>
                <Select
                  id={key}
                  size="md"
                  fullWidth
                  value={formData[key]}
                  onChange={(e) => update(key, e.target.value)}
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button
              fullWidth
              type="submit"
              size="lg"
              className="rounded-2xl h-14 text-base font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : STRINGS.SIGNUP_BUTTON}
            </Button>
          </div>
        </form>

        <div className="text-center pb-6">
          <button
            onClick={() => navigate(ROUTES.AUTH.LOGIN)}
            className="text-sm text-text-mid hover:text-primary-lime transition-colors p-2"
          >
            {STRINGS.SIGNUP_TO_LOGIN}{' '}
            <span className="font-bold text-text-primary">{STRINGS.SIGNUP_LOGIN_LINK}</span>
          </button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
