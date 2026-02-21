import React, { useRef, useEffect, useState } from 'react';
import { Message, Sender, MessageType, AIModelType, Grade } from '../../../shared/model/types';
import { GeminiService } from '../../../shared/api/gemini';
import { MessageBubble } from '../../../features/chat/MessageBubble';
import { ChatInput } from '../../../features/chat/ChatInput';
import { StickyContextCard } from '../../../widgets/chat/StickyContextCard';
import { SideGNB } from '../../../widgets/layout/SideGNB';
import { H2 } from '../../../shared/ui/Typography';
import { Menu } from 'lucide-react';
import { ArtifactViewer, ArtifactData } from '../../../widgets/artifact/ui/ArtifactViewer';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../shared/model/modalStore';

export const ChatRoom: React.FC = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: Sender.AI,
      type: MessageType.TEXT,
      content: "Hello! I'm your AI Mentor. Upload an artwork for analysis or ask me anything about your admission portfolio.",
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSideGNBOpen, setIsSideGNBOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null);
  const [isContextCollapsed, setIsContextCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const shouldCollapse = scrollTop > 50;
    if (shouldCollapse !== isContextCollapsed) {
        setIsContextCollapsed(shouldCollapse);
    }
  };

  const handleSend = async (text: string, modelType: AIModelType, image?: File) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      type: image ? MessageType.IMAGE : MessageType.TEXT,
      content: image ? URL.createObjectURL(image) : text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Mock Response for now, real implementation calls GeminiService
      setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: Sender.AI,
            type: MessageType.TEXT,
            content: "I've analyzed your input. The composition seems balanced, but consider adding more contrast.",
            timestamp: Date.now(),
          }]);
          setIsLoading(false);
      }, 1000);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
      setIsSideGNBOpen(false);
      openModal('UPLOAD_FLOW', {
          onComplete: () => {
              navigate('/chat/new-session'); // Reset chat
          }
      });
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      <SideGNB 
        isOpen={isSideGNBOpen} 
        onClose={() => setIsSideGNBOpen(false)}
        onNewChat={handleNewChat}
      />

      {/* Artifact Overlay */}
      {activeArtifact && (
        <ArtifactViewer 
          artifact={activeArtifact} 
          onClose={() => setActiveArtifact(null)} 
        />
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20 bg-dark-900/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
            <button onClick={() => setIsSideGNBOpen(true)} className="text-white p-1 hover:bg-white/10 rounded-full transition-colors">
               <Menu size={24} />
            </button>
            <H2 className="text-white text-base">{sessionId === 'new-session' ? 'New Analysis' : 'Hongik Univ. Design'}</H2>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={() => navigate('/app/chat')} className="text-xs bg-white/10 px-3 py-1 rounded-full text-white">Exit</button>
        </div>
      </div>

      {/* Sticky Context Card */}
      <StickyContextCard 
         grade={Grade.A} 
         score={88} 
         fixScope="DetailTuning" 
         isCollapsed={isContextCollapsed}
      />

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto pt-[180px] pb-4 px-4 no-scrollbar scroll-smooth" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-center gap-2 text-gray-500 text-xs ml-4 mb-4">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-200" />
                AI is thinking...
            </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};