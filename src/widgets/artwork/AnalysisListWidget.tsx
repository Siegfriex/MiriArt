import React from 'react';
import { Artwork } from '../../entities/artwork/model';
import { AnalysisCard } from '../../shared/ui/cards/AnalysisCard';

interface AnalysisListWidgetProps {
  artworks: Artwork[];
  onSelect: (id: string) => void;
}

export const AnalysisListWidget: React.FC<AnalysisListWidgetProps> = ({ artworks, onSelect }) => {
  return (
    <div className="flex flex-col gap-3">
       {artworks.map((art) => (
          <AnalysisCard 
            key={art.id} 
            artwork={art} 
            variant="list" 
            onClick={() => onSelect(art.id)} 
          />
       ))}
    </div>
  );
};