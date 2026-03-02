/**
 * @fileoverview 분석 카드. artwork 표시, variant(list/grid), onClick. 아카이브·홈 최근 분석용.
 * @참조 Archive Page, Home Page
 * @라우팅 /app/archive, /app/home
 * @상태 (부모에서 artwork 전달)
 */

import React from 'react';
import { Artwork } from '../../../entities/artwork/model';
import { Grade } from '../../model/types';
import { ChevronRight } from 'lucide-react';

interface AnalysisCardProps {
  artwork: Artwork;
  variant?: 'list' | 'grid';
  onClick: () => void;
}

/** 분석 카드. artwork, variant, onClick. @참조 Archive, Home */
export const AnalysisCard: React.FC<AnalysisCardProps> = ({ artwork, variant = 'grid', onClick }) => {
  if (variant === 'grid') {
    return (
      <div
        onClick={onClick}
        className="group relative aspect-[4/5] bg-surface-alt rounded-xl overflow-hidden border border-border-default cursor-pointer hover:border-primary-lime/30 transition-colors"
      >
        <img
          src={artwork.imageUrl}
          alt="작품"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-border-default">
          <span className={`font-bold text-sm ${artwork.grade === Grade.A ? 'text-primary-lime' : 'text-text-primary'}`}>
            {artwork.grade}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-xs text-text-primary font-medium truncate">{artwork.major}</div>
          <div className="text-[10px] text-text-mid truncate">
            {new Date(artwork.timestamp).toLocaleDateString('ko-KR')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl bg-surface-alt border border-border-default hover:border-primary-lime/30 transition-all cursor-pointer group active:scale-[0.99]"
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border-default">
        <img src={artwork.imageUrl} className="w-full h-full object-cover opacity-80" alt="작품" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <span className={`font-bold ${artwork.grade === Grade.A ? 'text-primary-lime' : 'text-text-primary'}`}>
            {artwork.grade}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <span className="text-xs text-text-mid">{new Date(artwork.timestamp).toLocaleDateString('ko-KR')}</span>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-text-secondary">{artwork.university}</span>
        </div>
        <div className="text-sm text-text-primary font-medium truncate mt-0.5">{artwork.major} 분석</div>
        {artwork.aiSummary && (
          <div className="text-xs text-text-mid truncate mt-0.5">{artwork.aiSummary}</div>
        )}
      </div>

      <ChevronRight size={16} className="text-text-low group-hover:text-text-primary" />
    </div>
  );
};
