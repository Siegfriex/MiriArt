import React from 'react';
import { H1, H2, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { UploadCloud, ChevronRight } from 'lucide-react';
import { MOCK_ARTWORKS } from '../../../entities/artwork/model';
import { LiveTicker } from '../../../widgets/home/LiveTicker';
import { FAB } from '../../../shared/ui/FAB';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { Section } from '../../../shared/ui/Section';
import { CreditStatusWidget } from '../../../widgets/home/CreditStatusWidget';
import { useModalStore } from '../../../shared/model/modalStore';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const handleUpload = () => {
    openModal('UPLOAD_FLOW', {
        onComplete: (file) => {
            // In a real app, we would upload, get ID, then navigate
            // Mocking ID 'new-upload'
            console.log('File uploaded:', file.name);
            navigate('/result/art-0'); // Redirect to a mock result
        }
    });
  };

  return (
    <PageContainer>
      {/* Header */}
      <header className="flex justify-between items-center mb-2">
        <H1 className="text-white">dysprime</H1>
        <div className="px-3 py-1 bg-lime-400/10 rounded-full border border-lime-400/20">
            <span className="text-xs text-lime-400 font-medium">Basic Plan</span>
        </div>
      </header>

      {/* Live Ticker Widget */}
      <LiveTicker />

      {/* Hero Upload CTA */}
      <section className="relative overflow-hidden rounded-[24px] bg-dark-800 border border-white/5 p-6 min-h-[200px] flex flex-col justify-center items-center text-center group">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent" />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-lime-400" size={32} />
            </div>
            <H2 className="mb-2 text-white">Analysis Start</H2>
            <BodyText className="mb-6">
                Upload your artwork.<br/>AI provides feedback in 8 seconds.
            </BodyText>
            <Button className="w-full max-w-[200px]" onClick={handleUpload}>Upload Artwork</Button>
        </div>
      </section>

      {/* Recent Uploads Section */}
      <Section 
        title="Recent" 
        action={
          <button onClick={() => navigate('/app/archive')} className="text-xs text-gray-500 flex items-center hover:text-white transition-colors">
             View All <ChevronRight size={14} />
          </button>
        }
      >
        {/* Horizontal Scroll List */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {MOCK_ARTWORKS.slice(0, 3).map((art) => (
                <div 
                  key={art.id} 
                  onClick={() => navigate(`/result/${art.id}`)}
                  className="min-w-[140px] flex flex-col space-y-2 group cursor-pointer"
                >
                    <div className="w-full aspect-[4/5] bg-dark-800 rounded-xl border border-white/5 overflow-hidden relative group-hover:border-lime-400/30 transition-colors">
                        <img 
                            src={art.imageUrl} 
                            alt="Artwork" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-lime-400 font-bold border border-lime-400/30">
                            {art.grade} Grade
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-white font-medium truncate">{art.university}</div>
                        <div className="text-xs text-gray-500 truncate">{art.major}</div>
                    </div>
                </div>
            ))}
        </div>
      </Section>

      {/* Credit Widget */}
      <CreditStatusWidget 
        credits={12} 
        onUpgrade={() => openModal('SUBSCRIPTION', { currentPlan: 'basic' })}
      />

      {/* Generic FAB */}
      <FAB onClick={handleUpload} />
    </PageContainer>
  );
};