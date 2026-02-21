import React from 'react';
import { Artwork } from '../../entities/artwork/model';
import { AnalysisCard } from '../../shared/ui/cards/AnalysisCard';

interface ArtworkGridProps {
  artworks: Artwork[];
  onSelect: (id: string) => void;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
       {artworks.map((art, i) => (
          <AnalysisCard 
            key={i} 
            artwork={art} 
            variant="grid" 
            onClick={() => onSelect(art.id)} 
          />
       ))}
    </div>
  );
};