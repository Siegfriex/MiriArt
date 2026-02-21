import React from 'react';
import { GlassCard } from '../../../shared/ui/GlassCard';
import { H2 } from '../../../shared/ui/Typography';
import { X, CheckSquare, Grid } from 'lucide-react';
import { ChecklistView, ChecklistItem } from './ChecklistView';
import { GalleryView, GalleryImage } from './GalleryView';

export interface ArtifactData {
  type: 'checklist' | 'gallery';
  title: string;
  items?: ChecklistItem[]; 
  images?: GalleryImage[];
}

interface ArtifactViewerProps {
  artifact: ArtifactData;
  onClose: () => void;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({ artifact, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard variant="panel" className="w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden relative border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-lime-400/10 text-lime-400">
               {artifact.type === 'checklist' ? <CheckSquare size={20} /> : <Grid size={20} />}
             </div>
             <div>
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{artifact.type} Artifact</div>
               <H2 className="text-lg">{artifact.title}</H2>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {artifact.type === 'checklist' && artifact.items && <ChecklistView items={artifact.items} />}
          {artifact.type === 'gallery' && artifact.images && <GalleryView images={artifact.images} />}
        </div>

      </GlassCard>
    </div>
  );
};