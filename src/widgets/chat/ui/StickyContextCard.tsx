/**
 * @fileoverview 스티키 컨텍스트 카드. 채팅방 상단 고정. grade, score, fixScope, isCollapsed. RadarChart 포함.
 * @참조 chat-room Page
 * @라우팅 /chat/:sessionId
 * @상태 (부모에서 grade, score, fixScope, isCollapsed 전달)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grade, FixScope } from '../../../shared/model/types';
import { Radar, Zap } from 'lucide-react';
import { STRINGS } from '../../../shared/config/strings';

interface StickyContextCardProps {
  grade: Grade;
  score: number;
  fixScope: FixScope;
  isCollapsed: boolean;
}

const springConfig = { stiffness: 300, damping: 30 };

/** 스티키 컨텍스트 카드. grade, score, fixScope, isCollapsed. @참조 ChatRoom Page */
export const StickyContextCard: React.FC<StickyContextCardProps> = ({
  grade,
  score,
  fixScope,
  isCollapsed,
}) => {
  const isRebuild = fixScope === 'StructureRebuild';

  return (
    <motion.div
      className="absolute top-14 left-0 w-full z-sticky px-page-x"
      layout
      transition={springConfig}
    >
      <motion.div
        className="glass rounded-xl overflow-hidden border border-white/10 shadow-soft"
        animate={{
          backgroundColor: isCollapsed ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between items-center p-2.5 h-[48px]"
            >
              <div className="flex gap-3 items-center">
                <div className="bg-primary-lime text-text-inverse font-extrabold rounded-md w-7 h-7 flex items-center justify-center text-xs shadow-glow">
                  {grade}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-mid leading-none">점수</span>
                  <span className="text-sm font-bold text-white leading-none">{score}</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${
                  isRebuild
                    ? 'border-semantic-error/30 text-semantic-error bg-semantic-error/10'
                    : 'border-primary-lime/30 text-primary-lime bg-primary-lime/10'
                }`}
              >
                <Zap size={10} fill="currentColor" />
                {isRebuild ? '재설계' : '조정'}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-lime text-text-inverse w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-glow">
                    {grade}
                  </div>
                  <div>
                    <div className="text-xs text-text-mid font-medium">총점</div>
                    <div className="text-2xl font-bold text-white tracking-tight">
                      {score}
                      <span className="text-sm text-text-low font-normal">/100</span>
                    </div>
                  </div>
                </div>

                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                  <Radar size={20} className="text-text-mid" />
                </div>
              </div>

              <div
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 border ${
                  isRebuild
                    ? 'bg-semantic-error/10 border-semantic-error/20 text-semantic-error'
                    : 'bg-primary-lime/10 border-primary-lime/20 text-primary-lime'
                }`}
              >
                <Zap size={14} fill="currentColor" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isRebuild
                    ? STRINGS.RESULT_FIXSCOPE_REBUILD
                    : STRINGS.RESULT_FIXSCOPE_TUNING}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
