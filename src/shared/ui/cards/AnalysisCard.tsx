import React from 'react';
import { Artwork } from '../../../entities/artwork/model';
import { Grade } from '../../model/types';
import { ChevronRight } from 'lucide-react';

interface AnalysisCardProps {
  artwork: Artwork;
  variant?: 'list' | 'grid';
  onClick: () => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ artwork, variant = 'grid', onClick }) => {
  if (variant === 'grid') {
    return (
      <div 
        onClick={onClick}
        className="group relative aspect-[4/5] bg-dark-800 rounded-xl overflow-hidden border border-white/5 cursor-pointer hover:border-lime-400/30 transition-colors"
      >
          <img 
             src={artwork.imageUrl} 
             alt="Artwork"
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
          />
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10">
             <span className={`font-bold text-sm ${
                artwork.grade === Grade.A ? 'text-lime-400' : 'text-white'
             }`}>
                {artwork.grade}
             </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
             <div className="text-xs text-white font-medium truncate">{artwork.major}</div>
             <div className="text-[10px] text-gray-400 truncate">
                {new Date(artwork.timestamp).toLocaleDateString()}
             </div>
          </div>
      </div>
    );
  }

  // List Variant
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl bg-dark-800 border border-white/5 hover:border-lime-400/30 transition-all cursor-pointer group active:scale-[0.99]"
    >
       <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
          <img src={artwork.imageUrl} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
             <span className={`font-bold ${artwork.grade === Grade.A ? 'text-lime-400' : 'text-white'}`}>
                {artwork.grade}
             </span>
          </div>
       </div>

       <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <span className="text-xs text-gray-400">{new Date(artwork.timestamp).toLocaleDateString()}</span>
             <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{artwork.university}</span>
          </div>
          <div className="text-sm text-white font-medium truncate mt-0.5">{artwork.major} Analysis</div>
          <div className="text-xs text-gray-500 truncate mt-0.5">Checked composition and density.</div>
       </div>

       <ChevronRight size={16} className="text-gray-600 group-hover:text-white" />
    </div>
  );
};