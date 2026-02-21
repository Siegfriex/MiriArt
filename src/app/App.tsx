import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers/AppRouter';
import { ModalProvider } from './providers/ModalProvider';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col font-sans">
        <ModalProvider />
        <AppRouter />
      </div>
    </BrowserRouter>
  );
};

export default App;