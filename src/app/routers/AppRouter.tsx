/**
 * @fileoverview 앱 라우터. Splash, Onboarding, Auth, Tutorial, App(Home/Archive/Chat/Profile), ChatRoom, ResultDetail.
 * @참조 App.tsx
 * @라우팅 /, /onboarding, /auth/*, /tutorial, /app/*, /chat/:id, /result/:id
 * @상태 (직접 사용 안 함)
 */

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

/** 앱 라우터. @참조 App */
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />

      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/tutorial" element={<FirstUploadTutorial />} />

      {/* Main App Layout */}
      <Route path="/app" element={<MainLayout />}>
        <Route index element={<Navigate to="home" replace />} />
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