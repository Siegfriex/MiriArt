import React, { useState } from 'react';
import { H1 } from '../../../shared/ui/Typography';
import { Grid as GridIcon, List, Filter } from 'lucide-react';
import { ArtworkGrid } from '../../../widgets/artwork/ArtworkGrid';
import { AnalysisListWidget } from '../../../widgets/artwork/AnalysisListWidget';
import { MOCK_ARTWORKS } from '../../../entities/artwork/model';
import { FAB } from '../../../shared/ui/FAB';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { EmptyState } from '../../../widgets/common/EmptyState';
import { useModalStore } from '../../../shared/model/modalStore';
import { useNavigate } from 'react-router-dom';

export const Archive: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const hasArtworks = MOCK_ARTWORKS.length > 0;

  const handleUpload = () => {
      openModal('UPLOAD_FLOW', {
          onComplete: () => navigate('/result/art-new')
      });
  };

  return (
    <PageContainer>
      <header className="flex justify-between items-center">
        <H1 className="text-white">Archive</H1>
        <button className="text-gray-400 p-2 rounded-full hover:bg-white/5"><Filter size={20} /></button>
      </header>

      {/* Controls */}
      <div className="flex justify-between items-center">
         <div className="text-sm text-gray-400">
            Total <span className="text-white font-bold">{MOCK_ARTWORKS.length}</span> Artworks
         </div>
         <div className="flex bg-dark-800 rounded-lg p-1 border border-white/5">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
             >
               <GridIcon size={16} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
             >
               <List size={16} />
             </button>
         </div>
      </div>

      {/* View Content */}
      <div className="min-h-[300px]">
        {hasArtworks ? (
            viewMode === 'grid' ? (
              <ArtworkGrid 
                artworks={MOCK_ARTWORKS} 
                onSelect={(id) => navigate(`/result/${id}`)} 
              />
            ) : (
              <AnalysisListWidget 
                artworks={MOCK_ARTWORKS}
                onSelect={(id) => navigate(`/result/${id}`)}
              />
            )
        ) : (
            <EmptyState 
                title="No Artworks Yet" 
                description="Upload your first artwork to get AI feedback."
                actionLabel="Upload Now"
                onAction={handleUpload}
            />
        )}
      </div>

      {/* Generic FAB */}
      <FAB onClick={handleUpload} />
    </PageContainer>
  );
};