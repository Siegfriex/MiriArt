import React from 'react';
import { ArrowLeft, Share2, MoreHorizontal, MessageCircle, ChevronDown } from 'lucide-react';
import { H1, H2 } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { AnalysisResult, Grade } from '../../../shared/model/types';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtworkById } from '../../../entities/artwork/model';
import { useModalStore } from '../../../shared/model/modalStore';
import { Tooltip } from '../../../shared/ui/Tooltip';

export const ResultDetail: React.FC = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const artwork = artworkId ? getArtworkById(artworkId) : null;

  // Mock full result data merging simple artwork data
  const result: AnalysisResult = artwork ? {
      ...artwork,
      totalScore: 88,
      radarData: { density: 90, form: 85, completion: 80, relevance: 95, thinking: 88 },
      fixScope: 'DetailTuning',
      comment: 'Excellent structure.'
  } : { // Fallback Mock
      id: 'mock',
      imageUrl: 'https://picsum.photos/400/500',
      grade: Grade.A,
      totalScore: 88,
      university: 'Hongik Univ.',
      major: 'Visual Design',
      radarData: { density: 90, form: 85, completion: 80, relevance: 95, thinking: 88 },
      fixScope: 'DetailTuning',
      comment: 'Excellent structure.',
      timestamp: Date.now()
  };

  const handleDelete = () => {
      openModal('CONFIRM', {
          title: 'Delete Result?',
          message: 'This action cannot be undone. Credits will not be refunded.',
          confirmLabel: 'Delete',
          isDestructive: true,
          onConfirm: () => {
              console.log('Deleted');
              navigate('/app/archive');
          }
      });
  };

  return (
    <div className="fixed inset-0 z-[50] bg-dark-900 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-10 flex justify-between items-center px-4 h-14 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
            <Share2 size={20} />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Artwork Viewer */}
      <div className="relative w-full aspect-[3/4] bg-dark-800">
        <img src={result.imageUrl} alt="Analysis" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-dark-900 to-transparent pt-24">
           <div className="flex items-end justify-between">
              <div>
                 <div className="text-lime-400 font-bold text-sm mb-1">{result.university}</div>
                 <H1 className="text-white">{result.totalScore}<span className="text-xl font-normal text-gray-400">/100</span></H1>
              </div>
              <div className="bg-lime-400 text-dark-900 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-[0_0_20px_rgba(194,249,112,0.3)]">
                 {result.grade}
              </div>
           </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* fixScope Banner */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
           <div className={`w-2 h-12 rounded-full ${result.fixScope === 'StructureRebuild' ? 'bg-red-500' : 'bg-lime-400'}`} />
           <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">fixScope Analysis</div>
              <div className="text-white font-medium text-lg">
                 {result.fixScope === 'StructureRebuild' ? 'Structure Rebuild Required' : 'Detail Tuning Recommended'}
              </div>
           </div>
        </div>

        {/* Radar Chart (Simulated with Bars for simplicity) */}
        <section>
          <Tooltip content="Tap for details" placement="top">
              <H2 className="text-white mb-4 inline-block cursor-help">5-Point Analysis</H2>
          </Tooltip>
          <div className="space-y-3 bg-dark-800 p-5 rounded-2xl border border-white/5">
             {Object.entries(result.radarData).map(([key, value]) => (
               <div key={key} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-gray-400 capitalize">{key}</span>
                  <div className="flex-1 h-2 bg-dark-900 rounded-full overflow-hidden">
                     <div className="h-full bg-lime-400 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                  <span className="w-8 text-sm text-white font-bold text-right">{value}</span>
               </div>
             ))}
          </div>
        </section>

        {/* Comparison Accordion */}
        <section className="space-y-2">
           <div className="flex justify-between items-center mb-2">
              <H2 className="text-white">Acceptance Comparison</H2>
              <span className="text-xs text-gray-500">Based on 2024 Data</span>
           </div>
           
           <div className="bg-dark-800 rounded-xl p-4 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-gray-700" />
                 <div>
                    <div className="text-sm text-white font-medium">Top Tier (Top 10%)</div>
                    <div className="text-xs text-lime-400">Similarity 82%</div>
                 </div>
              </div>
              <ChevronDown className="text-gray-500 group-hover:text-white" size={20} />
           </div>
           
           <div className="bg-dark-800 rounded-xl p-4 border border-white/5 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-gray-700" />
                 <div>
                    <div className="text-sm text-white font-medium">Average (Mid 50%)</div>
                    <div className="text-xs text-gray-400">Similarity 45%</div>
                 </div>
              </div>
              <ChevronDown className="text-gray-500 group-hover:text-white" size={20} />
           </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-20 flex gap-3">
         <Button variant="secondary" className="flex-1" onClick={() => navigate(-1)}>Back</Button>
         <Button className="flex-[2] flex gap-2" onClick={() => navigate(`/chat/session-${result.id}`)}>
            <MessageCircle size={18} />
            Ask AI Mentor
         </Button>
      </div>
    </div>
  );
};