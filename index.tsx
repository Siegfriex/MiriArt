import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './src/app/App';
import { useUserStore } from './src/shared/model/userStore';
import { IS_DEV_SKIP_AUTH } from './src/shared/config/dev';
import { ApiError } from './src/shared/api/miriartApi';
import { injectRootVars } from './src/shared/ui/tokens/rootVars';
import './src/app/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return false;
        return failureCount < 1;
      },
    },
    mutations: { retry: 0 },
  },
});

injectRootVars();

// 개발 시 로그인 우회: 로그인된 상태로 시작
if (IS_DEV_SKIP_AUTH) {
  useUserStore.getState().setAuth('dev-user');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);