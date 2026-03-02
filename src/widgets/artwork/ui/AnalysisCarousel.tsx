import React from 'react';
import { motion } from 'framer-motion';
import { Artwork } from '../../../entities/artwork/model';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';

interface AnalysisCarouselProps {
  artworks: Artwork[];
}

export const AnalysisCarousel: React.FC<AnalysisCarouselProps> = ({ artworks }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
      {artworks.map((art) => (
        <motion.div
          key={art.id}
          onClick={() => navigate(ROUTES.RESULT(art.id))}
          whileTap={{ scale: 0.97 }}
          className="min-w-[200px] flex flex-col gap-2 snap-start cursor-pointer group"
        >
          {/* 이미지 */}
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-surface-alt border border-border-default group-hover:border-primary-lime/30 transition-colors">
            <img
              src={art.imageUrl}
              alt="작품"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            {/* 등급 배지 */}
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-border-default">
              <span className="font-bold text-sm text-primary-lime">{art.grade}</span>
            </div>
          </div>

          {/* 정보 */}
          <div className="px-1">
            <div className="text-xs font-medium text-text-primary truncate">{art.university}</div>
            <div className="text-[11px] text-text-mid truncate">{art.major}</div>
            {art.aiSummary && (
              <div className="text-[10px] text-text-mid mt-1 line-clamp-2 leading-relaxed">
                {art.aiSummary}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
