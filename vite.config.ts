import path from 'path';
import os from 'os';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vercel/CI에서는 dist 사용. 로컬에서 dist 잠금(EPERM) 시에만 임시 폴더 사용
const outDir =
  process.env.VERCEL === '1' || process.env.CI ? 'dist' : path.join(os.tmpdir(), 'miriart-build');

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir,
        emptyOutDir: true,
      },
      plugins: [tailwindcss(), react()],
      // GEMINI_API_KEY는 이제 BE에서 관리. FE에 불필요.
      define: {},
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
