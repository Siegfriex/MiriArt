import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';

// Auth Pages
import { Splash } from '../../pages/auth/Splash';
import { Onboarding } from '../../pages/auth/Onboarding';
import { Login } from '../../pages/auth/Login';
import { Signup } from '../../pages/auth/Signup';
import { FirstUploadTutorial } from '../../pages/auth/FirstUploadTutorial';

// App Pages
import { Home } from '../../pages/home/ui/Page';
import { Archive } from '../../pages/archive/ui/Page';
import { AIChatList } from '../../pages/chat-list/ui/Page';
import { Profile } from '../../pages/profile/ui/Page';
import { ChatRoom } from '../../pages/chat-room/ui/Page';
import { ResultDetail } from '../../pages/result-detail/ui/Page';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Splash onFinish={() => {}} />} /> 
      {/* Splash handles its own navigation via useEffect inside component */}

      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/tutorial" element={<FirstUploadTutorial />} />

      {/* Main App Layout */}
      <Route path="/app" element={<MainLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="archive" element={<Archive />} />
        <Route path="chat" element={<AIChatList />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Full Screen Pages (Level 2/3) */}
      <Route path="/chat/:sessionId" element={<ChatRoom />} />
      <Route path="/result/:artworkId" element={<ResultDetail />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};