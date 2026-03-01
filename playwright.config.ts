/**
 * Playwright 설정 — UI 회귀/스냅샷 테스트용.
 * 사용 전: npm install -D @playwright/test && npx playwright install
 * 실행: npx playwright test tests/ui-regression.spec.ts
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'tests/**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'dot' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // PLAYWRIGHT_BASE_URL이 있으면 이미 서버가 떠 있다고 보고 webServer 미기동. 없으면 npm run dev 기동.
  // Vite 기본 포트는 vite.config.ts server.port(3000)와 맞춤. 다른 포트 사용 시 PLAYWRIGHT_BASE_URL로 지정.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
