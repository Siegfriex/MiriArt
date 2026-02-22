import React, { useMemo } from 'react';
import { Artwork } from '../../../entities/artwork/model';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/config/routes';
import { Tooltip } from '../../../shared/ui/Tooltip';

interface ArtworkGridProps {
  artworks: Artwork[];
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks }) => {
  const navigate = useNavigate();

  // 학교별 groupBy, 각 그룹 내부는 최신순(좌→우)
  const grouped = useMemo(() => {
    const map: Record<string, Artwork[]> = {};
    for (const art of artworks) {
      (map[art.university] ||= []).push(art);
    }
    return Object.entries(map).map(([uni, arts]) => ({
      university: uni,
      artworks: [...arts].sort((a, b) => b.timestamp - a.timestamp),
    }));
  }, [artworks]);

  return (
    <div className="space-y-6">
      {grouped.map(({ university, artworks: arts }) => (
        <div key={university}>
          <div className="text-[10px] font-bold text-text-mid uppercase tracking-wide mb-2 px-0.5">
            {university}
          </div>
          {/* 5컬럼 그리드 */}
          <div className="grid grid-cols-5 gap-1.5">
            {arts.map((art) => (
              <Tooltip key={art.id} content={art.aiSummary ?? art.major}>
                <div
                  onClick={() => navigate(ROUTES.RESULT(art.id))}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden bg-dark-800 border border-white/5 cursor-pointer hover:border-primary-lime/40 transition-colors group"
                >
                  <img
                    src={art.imageUrl}
                    alt="작품"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  {/* 등급 오버레이 */}
                  <div className="absolute bottom-0 left-0 w-full flex items-center justify-center py-1 bg-black/50">
                    <span className="text-[9px] font-extrabold text-primary-lime">{art.grade}</span>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
