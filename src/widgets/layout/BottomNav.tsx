import React from 'react';
import { Home, Grid, MessageCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', path: '/app/home', icon: Home, label: 'Home' },
    { id: 'archive', path: '/app/archive', icon: Grid, label: 'Archive' },
    { id: 'chat', path: '/app/chat', icon: MessageCircle, label: 'AI Chat' },
    { id: 'profile', path: '/app/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-dark-900/90 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-lime-400' : 'text-gray-500'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};