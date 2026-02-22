/**
 * @fileoverview 사이드 GNB. partial/full 모드, 세션 목록, 필터, 새 채팅. BottomNav 채팅 탭 클릭 시 열림.
 * @참조 App.tsx (전역 마운트), BottomNav
 * @라우팅 /app/* (전역)
 * @상태 useSideGNBStore, useNavStore, useModalStore, useState (gradeFilter, schoolFilter)
 */

import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { H2 } from '../../shared/ui/Typography';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { FilterChip } from '../../shared/ui/FilterChip';
import { SessionListPanel } from '../../widgets/chat/SessionListPanel';
import { useSideGNBStore } from '../../shared/model/sideGNBStore';
import { useNavStore } from '../../shared/model/navStore';
import { useModalStore } from '../../shared/model/modalStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes';
import { MOCK_SESSIONS } from '../../entities/session/model';

const springConfig = { stiffness: 300, damping: 30 };

const GRADE_FILTERS = ['전체', 'A', 'B', 'C', 'D'];
const SCHOOL_FILTERS = ['홍익대', '국민대', '이화여대', '서울대'];

/** 사이드 GNB. @참조 App, BottomNav @상태 useSideGNBStore, useNavStore, useModalStore */
export const SideGNB: React.FC = () => {
  const { mode, close, setMode } = useSideGNBStore();
  const { show: showNav, hide: hideNav } = useNavStore();
  const { openModal } = useModalStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [gradeFilter, setGradeFilter] = React.useState('전체');
  const [schoolFilter, setSchoolFilter] = React.useState<string | null>(null);

  // 라우트 변경 시 SideGNB 자동 닫기 (상태 누수 방지)
  React.useEffect(() => {
    if (mode !== 'closed') {
      close();
    }
  }, [location.pathname]);

  const isOpen = mode !== 'closed';
  const isFullWidth = mode === 'full';

  const handleClose = () => {
    close();
    showNav();
  };

  const handleSetFull = () => {
    setMode('full');
    showNav();
  };

  const handleSetPartial = () => {
    setMode('partial');
    hideNav(); // Partial = 채팅 맥락 보존, BottomNav 숨김
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    if (!isFullWidth) {
      if (offset.x > 50 || velocity.x > 200) handleSetFull();
      else if (offset.x < -50 || velocity.x < -200) handleClose();
    } else {
      if (offset.x < -50 || velocity.x < -200) handleSetPartial();
    }
  };

  const handleNewChat = () => {
    handleClose();
    openModal('UPLOAD_FLOW', {
      onComplete: () => navigate(ROUTES.CHAT_ROOM('new-session')),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — 부분 오픈일 때만 클릭으로 닫기 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-overlay bg-black/50 backdrop-blur-sm"
            onClick={!isFullWidth ? handleClose : undefined}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%', width: isFullWidth ? '100%' : '80%' }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', ...springConfig }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="fixed top-0 left-0 h-full z-modal glass-panel border-r border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <H2>세션 목록</H2>
                <span className="text-[10px] bg-primary-lime/20 text-primary-lime px-1.5 py-0.5 rounded font-bold">
                  {isFullWidth ? '전체' : '빠른보기'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={isFullWidth ? handleSetPartial : handleSetFull}
                  className="p-2 text-text-mid hover:text-white bg-white/5 rounded-full transition-colors"
                >
                  {isFullWidth ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
                <button onClick={handleClose} className="p-2 text-text-mid hover:text-white rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            {isFullWidth ? (
              // State 2: Full — SessionListPanel 공유
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-hidden"
              >
                <SessionListPanel compact />
              </motion.div>
            ) : (
              // State 1: Partial — 최근 기록 + 퀵필터
              <motion.div
                key="partial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
              >
                {/* 등급별 퀵필터 */}
                <div>
                  <span className="text-[10px] text-text-mid font-bold uppercase tracking-wide block mb-2">
                    등급별
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {GRADE_FILTERS.map((g) => (
                      <FilterChip
                        key={g}
                        label={g}
                        selected={gradeFilter === g}
                        onClick={() => setGradeFilter(g)}
                      />
                    ))}
                  </div>
                </div>

                {/* 학교별 퀵필터 */}
                <div>
                  <span className="text-[10px] text-text-mid font-bold uppercase tracking-wide block mb-2">
                    학교별
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {SCHOOL_FILTERS.map((s) => (
                      <FilterChip
                        key={s}
                        label={s}
                        selected={schoolFilter === s}
                        onClick={() => setSchoolFilter(schoolFilter === s ? null : s)}
                      />
                    ))}
                  </div>
                </div>

                {/* 최근 기록 */}
                <div>
                  <span className="text-[10px] text-text-mid font-bold uppercase tracking-wide block mb-2">
                    최근 세션
                  </span>
                  {MOCK_SESSIONS.slice(0, 5).map((session) => {
                    const diff = Date.now() - session.timestamp;
                    const hours = Math.floor(diff / 3600000);
                    const timeLabel = hours < 1 ? '방금 전' : hours < 24 ? `${hours}시간 전` : `${Math.floor(hours / 24)}일 전`;
                    return (
                      <div
                        key={session.id}
                        onClick={() => { close(); navigate(ROUTES.CHAT_ROOM(session.id)); }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-transparent hover:border-primary-lime/30 transition-colors mb-2"
                      >
                        <div className="w-12 h-12 rounded-lg bg-dark-700 flex-shrink-0 overflow-hidden relative">
                          <img
                            src={session.thumbnailUrl}
                            className="w-full h-full object-cover opacity-80"
                            alt="세션 썸네일"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="text-xs font-bold text-primary-lime">{session.grade}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate font-medium">{session.title}</div>
                          <div className="text-xs text-text-mid truncate flex items-center gap-1">
                            <span>{session.university}</span>
                            <span className="w-1 h-1 bg-dark-600 rounded-full" />
                            <span>{timeLabel}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Footer — Partial 모드에서만 표시 */}
            {!isFullWidth && (
              <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md flex-shrink-0">
                <button
                  onClick={handleNewChat}
                  className="w-full py-3.5 rounded-xl bg-primary-lime text-text-inverse font-bold flex items-center justify-center gap-2 shadow-glow hover:brightness-110 transition-all active:scale-95"
                >
                  <Plus size={20} />
                  새 세션
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
