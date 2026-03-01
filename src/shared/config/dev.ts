/**
 * 개발 전용 플래그. Vite dev 서버(npm run dev)에서 로그인/온보딩 우회.
 * 로그인 플로우 테스트 시 .env에 VITE_DEV_SKIP_AUTH=false 설정.
 */

export const IS_DEV_SKIP_AUTH =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SKIP_AUTH !== 'false';
