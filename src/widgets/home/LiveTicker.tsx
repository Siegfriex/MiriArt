/**
 * @fileoverview 라이브 티커. STRINGS.TICKER_ITEMS 무한 스크롤 애니메이션.
 * @참조 Home Page
 * @라우팅 /app/home
 * @상태 (직접 사용 안 함)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { STRINGS } from '../../shared/config/strings';

/** 라이브 티커. @참조 Home Page */
export const LiveTicker: React.FC = () => {
  const doubled = [...STRINGS.TICKER_ITEMS, ...STRINGS.TICKER_ITEMS];

  return (
    <div className="w-full overflow-x-hidden overflow-y-visible bg-primary-lime/5 border-y border-primary-lime/10 py-2 flex-shrink-0">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, '-50%'] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      >
        {doubled.map((text, i) => (
          <span
            key={i}
            className="text-xs font-medium text-primary-lime/80 inline-flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-lime animate-pulse flex-shrink-0" />
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
