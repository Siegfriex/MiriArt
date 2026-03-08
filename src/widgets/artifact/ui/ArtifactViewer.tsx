/**
 * @fileoverview 아티팩트 뷰어. checklist | gallery 타입, ChecklistView 또는 GalleryView 렌더.
 * @참조 result-detail Page (아티팩트 모달)
 * @라우팅 /result/:artworkId
 * @상태 (부모에서 artifact, onClose 전달)
 */

import React from 'react';
import { GlassCard } from '../../../shared/ui/GlassCard';
import { H2 } from '../../../shared/ui/Typography';
import { X, CheckSquare, Grid } from 'lucide-react';
import { ChecklistView, ChecklistItem } from './ChecklistView';
import { GalleryView, GalleryImage } from './GalleryView';

/** 아티팩트 데이터: type, title, items 또는 images */
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

/** 아티팩트 뷰어. artifact, onClose. @참조 ResultDetail Page */
export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({ artifact, onClose }) => {
  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <GlassCard variant="panel" className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative border border-border-default shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-default bg-black/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-primary-lime/10 text-primary-lime">
               {artifact.type === 'checklist' ? <CheckSquare size={20} /> : <Grid size={20} />}
             </div>
             <div>
               <div className="text-micro text-text-mid font-bold uppercase tracking-wider">
                 {artifact.type === 'checklist' ? '체크리스트' : '갤러리'} Artifact
               </div>
               <H2 className="text-lg">{artifact.title}</H2>
             </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-mid hover:text-text-primary rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {artifact.type === 'checklist' && artifact.items && <ChecklistView items={artifact.items} />}
          {artifact.type === 'gallery' && artifact.images && <GalleryView images={artifact.images} />}
        </div>

      </GlassCard>
    </div>
  );
};
