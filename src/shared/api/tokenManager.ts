/**
 * @fileoverview accessToken localStorage 읽기/쓰기 전용. userStore·miriartApi에서 공유.
 * 순환 의존성 방지를 위해 miriartApi와 분리.
 */

export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
  clearAccessToken: () => localStorage.removeItem('accessToken'),
};
