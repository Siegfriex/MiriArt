import React, { useState } from 'react';
import { H1 } from '../../../shared/ui/Typography';
import { Session } from '../../../shared/model/types';
import { MOCK_SESSIONS } from '../../../entities/session/model';
import { FAB } from '../../../shared/ui/FAB';
import { SearchBar } from '../../../shared/ui/SearchBar';
import { FilterChip } from '../../../shared/ui/FilterChip';
import { SessionCard } from '../../../shared/ui/cards/SessionCard';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { EmptyState } from '../../../widgets/common/EmptyState';
import { MessageSquareDashed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../shared/model/modalStore';

export const AIChatList: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'A Grade', 'B Grade', 'Hongik', 'Kookmin'];
  const hasSessions = MOCK_SESSIONS.length > 0;

  const handleNewChat = () => {
      openModal('UPLOAD_FLOW', {
          onComplete: () => navigate('/chat/new-session')
      });
  };

  return (
    <PageContainer>
      <header className="flex justify-between items-center">
        <H1 className="text-white">AI Chat</H1>
        <div className="text-xs text-gray-400">
           12 Credits
        </div>
      </header>

      {/* Generic Search Bar */}
      <SearchBar placeholder="Search sessions, universities..." />

      {/* Generic Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
         {filters.map((filter) => (
            <FilterChip 
              key={filter}
              label={filter}
              selected={selectedFilter === filter}
              onClick={() => setSelectedFilter(filter)}
            />
         ))}
      </div>

      {/* Session List using SessionCard */}
      <div className="flex-1 flex flex-col gap-4">
         {hasSessions ? (
             MOCK_SESSIONS.map((session) => (
                <SessionCard 
                  key={session.id}
                  session={session}
                  onClick={() => navigate(`/chat/${session.id}`)}
                />
             ))
         ) : (
             <EmptyState 
                title="No Chat Sessions" 
                description="Start a new analysis to chat with your AI Mentor."
                actionLabel="Start New Chat"
                onAction={handleNewChat}
                icon={MessageSquareDashed}
             />
         )}
      </div>

      {/* Generic FAB */}
      <FAB onClick={handleNewChat} />
    </PageContainer>
  );
};