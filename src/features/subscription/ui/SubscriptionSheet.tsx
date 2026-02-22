/**
 * @fileoverview 구독 시트. free/basic/premium 플랜 선택, 결제 수단 선택. useModalStore SUBSCRIPTION 모달용.
 * @참조 ModalRegistry, Home, UploadFlow (크레딧 부족 시)
 * @라우팅 전역 (모달)
 * @상태 useModalStore, useToastStore, useState (selectedPlan, paymentMethod)
 */

import React, { useState } from 'react';
import { H2, H3, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { useModalStore } from '../../../shared/model/modalStore';
import { useToastStore } from '../../../shared/model/toastStore';
import { Check, Crown, Zap, Gift, CreditCard } from 'lucide-react';
import { STRINGS } from '../../../shared/config/strings';

interface SubscriptionSheetProps {
  currentPlan?: string;
}

const plans = [
  {
    id: 'free',
    name: STRINGS.SUBSCRIPTION_FREE,
    price: '₩0',
    period: '/월',
    features: ['월 3 크레딧', '기본 분석', '아카이브 접근'],
    icon: Gift,
    badgeColor: 'border-white/20 text-text-mid',
    activeColor: 'border-white text-white',
  },
  {
    id: 'basic',
    name: STRINGS.SUBSCRIPTION_BASIC,
    price: '₩19,900',
    period: '/월',
    features: ['월 20 크레딧', '표준 분석', '아카이브 접근'],
    icon: Zap,
    badgeColor: 'border-white/10',
    activeColor: 'border-white text-white',
  },
  {
    id: 'premium',
    name: STRINGS.SUBSCRIPTION_PREMIUM,
    price: '₩49,900',
    period: '/월',
    features: ['무제한 크레딧', '상세 분석', '1:1 멘토 채팅', '합격 확률 예측'],
    icon: Crown,
    badge: STRINGS.SUBSCRIPTION_BEST_VALUE,
    badgeColor: 'border-primary-lime/50 bg-primary-lime/5',
    activeColor: 'border-primary-lime text-primary-lime',
  },
] as const;

type PlanId = 'free' | 'basic' | 'premium';
type PaymentMethod = 'card' | 'kakao' | 'naver';

/** 구독 시트. currentPlan. @참조 ModalRegistry @상태 useModalStore, useToastStore, selectedPlan, paymentMethod */
export const SubscriptionSheet: React.FC<SubscriptionSheetProps> = ({ currentPlan = 'free' }) => {
  const { closeModal } = useModalStore();
  const { show: showToast } = useToastStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('premium');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const handleSubscribe = () => {
    showToast(`${selectedPlan} 플랜으로 업그레이드되었습니다!`, 'success');
    closeModal();
  };

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
    { id: 'card', label: STRINGS.SUBSCRIPTION_PAYMENT_CARD, icon: CreditCard },
    { id: 'kakao', label: STRINGS.SUBSCRIPTION_PAYMENT_KAKAO, icon: CreditCard },
    { id: 'naver', label: STRINGS.SUBSCRIPTION_PAYMENT_NAVER, icon: CreditCard },
  ];

  return (
    <div className="p-6 space-y-5 pb-10 overflow-y-auto no-scrollbar max-h-[90vh]">
      <div className="text-center space-y-1">
        <H2>{STRINGS.SUBSCRIPTION_TITLE}</H2>
        <BodyText className="text-sm text-text-mid">
          {STRINGS.SUBSCRIPTION_CURRENT(currentPlan === 'free' ? '무료' : currentPlan === 'basic' ? '기본' : '프리미엄')}
        </BodyText>
      </div>

      {/* 플랜 선택 */}
      <div className="space-y-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrent = currentPlan === plan.id;
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              onClick={() => !isCurrent && setSelectedPlan(plan.id)}
              className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                isSelected
                  ? `${plan.activeColor} bg-white/5`
                  : isCurrent
                    ? 'border-dark-600 bg-dark-800 opacity-50 cursor-default'
                    : 'border-white/10 bg-dark-900 hover:border-white/20'
              }`}
            >
              {'badge' in plan && plan.badge && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-lime text-text-inverse text-[10px] font-bold px-3 py-0.5 rounded-full shadow-glow">
                  {plan.badge}
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-dark-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                  {STRINGS.SUBSCRIPTION_CURRENT_PLAN}
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-dark-800'}`}>
                    <Icon size={18} className={isSelected ? 'text-primary-lime' : 'text-text-mid'} />
                  </div>
                  <H3 className={isSelected ? 'text-white' : 'text-text-mid'}>{plan.name}</H3>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary-lime bg-primary-lime' : 'border-dark-600'
                }`}>
                  {isSelected && <Check size={12} className="text-text-inverse stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xl font-bold text-white">{plan.price}</span>
                <span className="text-xs text-text-mid">{plan.period}</span>
              </div>

              <div className="space-y-1.5">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-text-mid">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary-lime/10 flex items-center justify-center flex-shrink-0">
                      <Check size={8} className="text-primary-lime" />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 결제 수단 */}
      {selectedPlan !== 'free' && selectedPlan !== currentPlan && (
        <div className="space-y-2">
          <H3 className="text-white text-sm">결제 수단</H3>
          <div className="flex gap-2">
            {paymentOptions.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPaymentMethod(id)}
                className={`flex-1 py-2.5 text-xs rounded-xl border transition-colors ${
                  paymentMethod === id
                    ? 'border-primary-lime text-primary-lime bg-primary-lime/5'
                    : 'border-white/10 text-text-mid hover:border-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        fullWidth
        onClick={handleSubscribe}
        size="lg"
        disabled={currentPlan === selectedPlan}
      >
        {currentPlan === selectedPlan
          ? STRINGS.SUBSCRIPTION_CURRENT_PLAN
          : STRINGS.SUBSCRIPTION_SUBSCRIBE(
              selectedPlan === 'basic'
                ? STRINGS.SUBSCRIPTION_BASIC
                : STRINGS.SUBSCRIPTION_PREMIUM
            )}
      </Button>
    </div>
  );
};
