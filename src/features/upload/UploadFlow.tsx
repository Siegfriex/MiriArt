/**
 * @fileoverview 작품 업로드 플로우. 4단계: 선택→설정→분석→결과. ApiService.analyze 호출, 결과 페이지로 이동.
 * @참조 ModalRegistry (UPLOAD_FLOW), Home, Archive, FirstUploadTutorial
 * @라우팅 /app/home, /app/archive, /tutorial (모달로 열림)
 * @상태 useModalStore, useToastStore, useState (step, selectedImage, progress, errorType 등)
 */

import React, { useState, useEffect, useRef } from 'react';
import { H2, H3, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { TextInput } from '../../shared/ui/TextInput';
import { X, Image as ImageIcon, ArrowLeft, Camera } from 'lucide-react';
import { useModalStore } from '../../shared/model/modalStore';
import { useToastStore } from '../../shared/model/toastStore';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';
import { AnalysisApi, ApiError, UserApi, type PlanInfo } from '../../shared/api/miriartApi';
import { AiLoadingState, AiErrorState } from '@/shared/ui/ai';

const MAX_FILE_SIZE_MB = 10;
const ANALYSIS_DURATION_SEC = 8;

interface UploadFlowProps {
  onComplete?: (image: File) => void;
}

type Step = 1 | 2 | 3 | 4 | 'error';
type ErrorType = 'credits' | 'file_size' | 'timeout';

/** 업로드 플로우. onComplete(image). @참조 ModalRegistry @상태 useModalStore, useToastStore, step, selectedImage 등 */
export const UploadFlow: React.FC<UploadFlowProps> = ({ onComplete }) => {
  const { closeModal, openModal } = useModalStore();
  const { show: showToast } = useToastStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [type, setType] = useState<'basic' | 'major'>('basic');
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const remaining = plan?.remaining ?? 0;

  const loadPlan = () => {
    setPlanLoading(true);
    setPlanError(false);
    UserApi.getPlan()
      .then((p) => {
        setPlan(p);
        setPlanError(false);
      })
      .catch(() => {
        setPlan(null);
        setPlanError(true);
      })
      .finally(() => setPlanLoading(false));
  };

  useEffect(() => {
    loadPlan();
  }, []);

  // blob URL 메모리 누수 방지
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showToast(STRINGS.UPLOAD_ERROR_FILE_SIZE, 'error');
      return;
    }
    setSelectedImage(file);
    setStep(2);
  };

  const handleAnalysisStart = async () => {
    if (remaining <= 0) {
      closeModal();
      openModal('SUBSCRIPTION', { currentPlan: plan?.plan?.toLowerCase() ?? 'free' });
      return;
    }

    if (!selectedImage) return;

    setStep(4);
    setProgress(0);
    setElapsed(0);

    // Progress bar 애니메이션 (API 응답 전까지 표시)
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        // API 응답 전까지 최대 90%까지만 진행
        setProgress(Math.min((next / ANALYSIS_DURATION_SEC) * 90, 90));
        return next;
      });
    }, 100);

    try {
      const result = await AnalysisApi.analyze(selectedImage, {
        type,
        problemText: text || undefined,
      });

      // 분석 완료 — Progress 100%로 점프
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);

      onComplete?.(selectedImage);

      // 짧은 딜레이 후 결과 페이지로 이동
      setTimeout(() => {
        closeModal();
        navigate(ROUTES.RESULT(result.id));
      }, 400);
    } catch (error) {
      if (timerRef.current) clearInterval(timerRef.current);

      if (error instanceof ApiError && error.status === 402) {
        setErrorType('credits');
      } else if (error instanceof ApiError && error.status === 408) {
        setErrorType('timeout');
      } else {
        setErrorType('timeout');
      }
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep(3);
    setErrorType(null);
  };

  // ─── Step 1: Image Picker ──────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="absolute inset-0 bg-surface flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-border-default flex-shrink-0">
          <button onClick={closeModal} className="p-1">
            <X className="text-text-primary" size={24} />
          </button>
          <span className="text-text-primary font-medium">{STRINGS.UPLOAD_TITLE}</span>
          <div className="w-6" />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="text-center space-y-2">
            <H2>{STRINGS.UPLOAD_STEP1_TITLE}</H2>
            <BodyText>{STRINGS.UPLOAD_STEP1_DESC}</BodyText>
          </div>

          <label className="w-full max-w-xs aspect-[3/4] rounded-2xl border-2 border-dashed border-border-subtle flex flex-col items-center justify-center cursor-pointer hover:border-primary-lime/50 hover:bg-black/5 transition-colors">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="w-16 h-16 rounded-full bg-primary-lime/10 flex items-center justify-center mb-4">
              <ImageIcon className="text-primary-lime" size={32} />
            </div>
            <span className="text-primary-lime font-medium">{STRINGS.UPLOAD_STEP1_GALLERY}</span>
          </label>

          {/* 카메라 옵션 */}
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-alt border border-border-default cursor-pointer hover:bg-surface-tertiary transition-colors">
            <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
            <Camera size={18} className="text-text-mid" />
            <span className="text-sm text-text-mid">카메라로 촬영</span>
          </label>
        </div>
      </div>
    );
  }

  // ─── Step 2: Optional Info ────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="absolute inset-0 bg-surface flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-border-default flex-shrink-0">
          <button onClick={() => setStep(1)} className="p-1">
            <ArrowLeft className="text-text-primary" size={24} />
          </button>
          <span className="text-text-primary font-medium">{STRINGS.UPLOAD_STEP2_TITLE}</span>
          <div className="w-6" />
        </header>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
          {previewUrl && (
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-border-default mx-auto">
              <img
                src={previewUrl}
                className="w-full h-full object-cover"
                alt="선택한 작품"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-mid block mb-2">유형 선택</label>
              <div className="flex bg-surface-alt p-1 rounded-xl">
                <button
                  onClick={() => setType('basic')}
                  className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                    type === 'basic' ? 'bg-primary-lime text-text-inverse font-bold' : 'text-text-mid'
                  }`}
                >
                  {STRINGS.UPLOAD_STEP2_TYPE_COMPOSITION}
                </button>
                <button
                  onClick={() => setType('major')}
                  className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                    type === 'major' ? 'bg-primary-lime text-text-inverse font-bold' : 'text-text-mid'
                  }`}
                >
                  {STRINGS.UPLOAD_STEP2_TYPE_BASIC}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="upload-context" className="text-xs text-text-mid block mb-2">{STRINGS.UPLOAD_STEP2_CONTEXT_LABEL}</label>
              <TextInput
                id="upload-context"
                multiline
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={STRINGS.UPLOAD_STEP2_CONTEXT_PLACEHOLDER}
                maxLength={500}
              />
              <div className="text-right text-tiny text-text-mid mt-1">{text.length}/500</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-border-default flex-shrink-0">
          <Button className="w-full" onClick={() => setStep(3)}>
            {STRINGS.NEXT}
          </Button>
        </div>
      </div>
    );
  }

  // ─── Step 3: Credit Confirm ────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="bg-surface-alt w-full rounded-t-3xl p-6 space-y-6 border-t border-border-default">
          <div className="w-12 h-1.5 bg-dark-600 rounded-full mx-auto" />
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary-lime/20 flex items-center justify-center mb-2">
              <AlertCircle className="text-primary-lime" size={24} />
            </div>
            <H2>{STRINGS.UPLOAD_STEP3_TITLE}</H2>
            <BodyText className="text-sm">
              {planLoading
                ? '잔여 횟수 확인 중...'
                : planError
                  ? '잔여 횟수 정보를 불러오지 못했습니다.'
                  : remaining <= 0
                    ? '이번 달 분석 횟수를 모두 사용하셨어요. 플랜을 업그레이드해 주세요.'
                    : STRINGS.UPLOAD_STEP3_DESC(remaining)}
            </BodyText>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={closeModal}>
              {STRINGS.CANCEL}
            </Button>
            {planError ? (
              <Button className="flex-1" onClick={loadPlan}>
                다시 시도
              </Button>
            ) : (
              <Button
                className="flex-1"
                onClick={handleAnalysisStart}
                disabled={planLoading || remaining <= 0}
              >
                {STRINGS.CONFIRM}
              </Button>
            )}
          </div>
          <div className="h-2" />
        </div>
      </div>
    );
  }

  // ─── Step 4: Analysis Loading ─────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="absolute inset-0 bg-surface">
        <AiLoadingState
          title={STRINGS.UPLOAD_STEP4_TITLE}
          description={STRINGS.UPLOAD_STEP4_DESC}
          progress={progress}
          estimatedTime={`${Math.max(0, ANALYSIS_DURATION_SEC - Math.floor(elapsed))}초 남음`}
          variant="fullscreen"
        />
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────
  if (step === 'error') {
    const errorTitle =
      errorType === 'credits'
        ? STRINGS.UPLOAD_ERROR_CREDITS
        : errorType === 'file_size'
          ? STRINGS.UPLOAD_ERROR_FILE_SIZE
          : STRINGS.UPLOAD_ERROR_TIMEOUT;

    const errorDesc =
      errorType === 'credits'
        ? '플랜을 업그레이드하여 더 많은 크레딧을 충전하세요.'
        : errorType === 'file_size'
          ? '10MB 이하의 이미지를 선택해주세요.'
          : '잠시 후 다시 시도해주세요.';

    return (
      <div className="absolute inset-0 bg-surface">
        <AiErrorState
          title={errorTitle}
          description={errorDesc}
          variant="fullscreen"
          onRetry={errorType !== 'credits' ? handleRetry : undefined}
          secondaryAction={
            errorType === 'credits'
              ? {
                  label: '플랜 업그레이드',
                  onClick: () => {
                    closeModal();
                    openModal('SUBSCRIPTION', { currentPlan: 'free' });
                  },
                }
              : undefined
          }
        />
        <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4">
          <Button variant="secondary" onClick={closeModal}>
            {STRINGS.CANCEL}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
