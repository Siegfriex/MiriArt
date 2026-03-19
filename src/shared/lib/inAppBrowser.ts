/**
 * 인앱 브라우저 감지 및 외부 브라우저 유도.
 * KakaoTalk, Naver, Line, Instagram, Facebook 인앱 WebView에서
 * Google OAuth가 정상 동작하지 않는 문제 대응.
 */

/** KakaoTalk 인앱 브라우저 여부 */
export function isKakaoInApp(): boolean {
  return /KAKAOTALK/i.test(navigator.userAgent);
}

/** 주요 인앱 브라우저(KakaoTalk, Naver, Line, Instagram, Facebook) 여부 */
export function isInAppBrowser(): boolean {
  return /KAKAOTALK|NAVER\(inapp|Line\/|Instagram|FBAN|FBAV/i.test(navigator.userAgent);
}

/** Android 여부 */
export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

/** iOS 여부 */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Android: intent:// 스킴으로 Chrome 실행.
 * iOS: intent 미지원 → false 반환 (호출부에서 수동 안내 UI 표시).
 */
export function openInExternalBrowser(url: string): boolean {
  if (isAndroid()) {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    window.location.href =
      `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
    return true;
  }
  // iOS는 intent 미지원 — 호출부에서 Safari 안내 UI 표시
  return false;
}
