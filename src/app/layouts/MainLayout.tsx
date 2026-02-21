import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../../widgets/layout/BottomNav';

export const MainLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
};