/**
 * API 베이스 URL. Vite 빌드 시점에 VITE_API_BASE_URL이 박힘.
 * - 개발: 미설정 시 http://localhost:8080
 * - 프로덕션: 미설정 시 localhost로 fallback 하지 않음 (Vercel에서 반드시 설정)
 *   → Vercel: Project → Settings → Environment Variables
 *     VITE_API_BASE_URL = https://<Cloud Run URL> (Production 체크)
 */
export const API_BASE = ((): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (url && typeof url === 'string') return url.trim();
  if (import.meta.env.DEV) return 'http://localhost:8080';
  if (import.meta.env.PROD) console.error('VITE_API_BASE_URL is not set. Set it in Vercel Environment Variables for production.');
  return ''; // 프로덕션 미설정 시 same-origin (Vercel에 VITE_API_BASE_URL 설정 후 재배포 필요)
})();
