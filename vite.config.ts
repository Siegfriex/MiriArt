import path from 'path';
import os from 'os';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 프로젝트 내 dist/dist-build 잠금(EPERM) 시: 시스템 임시 폴더에 빌드 (항상 쓰기 가능)
const outDir = path.join(os.tmpdir(), 'miriart-build');

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
