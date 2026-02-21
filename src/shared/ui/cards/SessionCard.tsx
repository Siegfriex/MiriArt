import React from 'react';
import { Session } from '../../model/types';

interface SessionCardProps {
  session: Session;
  onClick: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-dark-800 rounded-xl p-4 border border-white/5 flex gap-4 hover:bg-dark-800/80 active:scale-[0.98] transition-all cursor-pointer shadow-sm group"
    >
       {/* Thumbnail */}
       <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-900 flex-shrink-0 border border-white/5">
          <img src={session.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
             <span className="text-lime-400 font-bold text-lg drop-shadow-md">{session.grade}</span>
          </div>
       </div>

       {/* Info */}
       <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex justify-between items-start">
             <div className="text-xs text-lime-400 font-bold uppercase tracking-wide truncate">
                {session.university} • {session.major}
             </div>
             <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit'})}
             </span>
          </div>
          
          <div className="text-sm text-white font-medium truncate group-hover:text-lime-400 transition-colors">
             {session.title}
          </div>
          
          <div className="text-xs text-gray-400 truncate">
             {session.lastMessage}
          </div>
       </div>
    </div>
  );
};