/**
 * @fileoverview 비교 아코디언. tiers(TOP/HIGH/MID/LOW/CRITICAL) 펼침/접힘, hasAcceptedArtwork.
 * @참조 result-detail Page
 * @라우팅 /result/:artworkId
 * @상태 useState (isOpen per tier)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock } from 'lucide-react';
import { ComparisonTier } from '../../shared/model/types';
import { H2, H3, BodyText } from '../../shared/ui/Typography';
import { STRINGS } from '../../shared/config/strings';

interface ComparisonAccordionProps {
  tiers: ComparisonTier[];
  hasAcceptedArtwork?: boolean;
}

const TIER_STYLES: Record<ComparisonTier['level'], {
  bg: string;
  bar: string;
  badge: string;
  badgeText: string;
}> = {
  TOP:      { bg: 'bg-primary-lime/10 border-primary-lime/20', bar: 'bg-primary-lime',    badge: 'bg-primary-lime/20 text-primary-lime',        badgeText: 'TOP' },
  HIGH:     { bg: 'bg-primary-lime/5 border-primary-lime/10',  bar: 'bg-primary-lime/60', badge: 'bg-primary-lime/10 text-primary-lime/80',      badgeText: 'HIGH' },
  MID:      { bg: 'bg-black/5 border-border-default',            bar: 'bg-black/20',       badge: 'bg-black/10 text-text-mid',                    badgeText: 'MID' },
  LOW:      { bg: 'bg-orange-500/5 border-orange-500/20',      bar: 'bg-orange-500',      badge: 'bg-orange-500/20 text-orange-400',            badgeText: 'LOW' },
  CRITICAL: { bg: 'bg-red-500/5 border-red-500/20',            bar: 'bg-red-500',         badge: 'bg-red-500/20 text-red-400',                  badgeText: 'CRITICAL' },
};

const TIER_LABELS: Record<ComparisonTier['level'], string> = {
  TOP: STRINGS.RESULT_COMPARISON_TIER_TOP,
  HIGH: STRINGS.RESULT_COMPARISON_TIER_HIGH,
  MID: STRINGS.RESULT_COMPARISON_TIER_MID,
  LOW: STRINGS.RESULT_COMPARISON_TIER_LOW,
  CRITICAL: STRINGS.RESULT_COMPARISON_TIER_CRITICAL,
};

const TierSection: React.FC<{ tier: ComparisonTier }> = ({ tier }) => {
  const [isOpen, setIsOpen] = useState(tier.level === 'TOP' || tier.level === 'HIGH');
  const style = TIER_STYLES[tier.level];

  return (
    <div className={`rounded-xl border overflow-hidden ${style.bg}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-8 rounded-full ${style.bar}`} />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                {style.badgeText}
              </span>
              <span className="text-xs text-text-mid">{tier.threshold}</span>
            </div>
            <div className="text-sm text-text-primary font-medium mt-0.5">{TIER_LABELS[tier.level]}</div>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="text-text-mid" size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border-default">
              {tier.items.map((item, idx) => (
                <div key={idx} className="pt-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary">{item.university}</div>
                    <div className="text-[11px] text-text-mid">{item.major}</div>
                    <BodyText className="text-xs text-text-mid mt-1 line-clamp-2">{item.description}</BodyText>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="text-lg font-bold text-primary-lime">{item.probability}%</div>
                    <div className="text-[10px] text-text-mid">유사 합격 {item.similarAcceptedCount}명</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** 비교 아코디언. tiers, hasAcceptedArtwork. @참조 ResultDetail Page */
export const ComparisonAccordion: React.FC<ComparisonAccordionProps> = ({
  tiers,
  hasAcceptedArtwork = false,
}) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <H2>{STRINGS.RESULT_COMPARISON_TITLE}</H2>
        <span className="text-[10px] text-text-mid">{STRINGS.RESULT_YEAR_LABEL}</span>
      </div>

      <div className="relative">
        <div className={`space-y-2 ${!hasAcceptedArtwork ? 'blur-sm pointer-events-none select-none' : ''}`}>
          {tiers.map((tier) => (
            <TierSection key={tier.level} tier={tier} />
          ))}
        </div>

        {/* 합격작 미업로드 시 잠금 오버레이 */}
        {!hasAcceptedArtwork && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-surface-alt rounded-full flex items-center justify-center mb-3 border border-border-default">
              <Lock size={20} className="text-text-mid" />
            </div>
            <H3 className="text-center text-sm">{STRINGS.RESULT_COMPARISON_LOCKED}</H3>
          </div>
        )}
      </div>
    </section>
  );
};
