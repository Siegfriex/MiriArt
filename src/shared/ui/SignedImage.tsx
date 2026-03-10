/**
 * @fileoverview 분석 이미지 Signed URL 표시. analysisId로 GET /api/images/{id}/url 호출 후 img 렌더링.
 * onError 시 한 번 재요청, 실패 시 placeholder 표시.
 * @참조 ImageApi.getSignedUrl, result-detail, home, archive, ArtworkGrid, AnalysisCarousel, AnalysisCard
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ImageApi, handleApiError } from '../api/miriartApi';
import { useToastStore } from '../model/toastStore';

const PLACEHOLDER_TEXT = '이미지를 불러올 수 없습니다.';

export interface SignedImageProps {
  /** 분석 id (GET /api/images/{analysisId}/url에 사용) */
  analysisId: string;
  alt?: string;
  className?: string;
  /** 로딩/에러 시 표시할 placeholder 클래스 (기본: 배경 + 텍스트) */
  placeholderClassName?: string;
}

/**
 * Signed URL로 이미지 표시. 로딩 중·에러 시 placeholder.
 * onError 시 1회 재요청 후 실패하면 placeholder. placeholder에서 "다시 시도"로 재시도 가능.
 */
export const SignedImage: React.FC<SignedImageProps> = ({
  analysisId,
  alt = '작품',
  className = '',
  placeholderClassName = 'bg-surface-alt flex items-center justify-center text-text-mid text-xs',
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [retried, setRetried] = useState(false);

  const fetchUrl = useCallback(async (id: string) => {
    try {
      const data = await ImageApi.getSignedUrl(id);
      setUrl(data.url);
      setShowPlaceholder(false);
    } catch (err) {
      useToastStore.getState().show(handleApiError(err), 'error');
      setShowPlaceholder(true);
      setUrl(null);
    }
  }, []);

  useEffect(() => {
    if (!analysisId) {
      setUrl(null);
      setShowPlaceholder(true);
      setRetried(false);
      return;
    }
    setShowPlaceholder(false);
    setRetried(false);
    setUrl(null);
    fetchUrl(analysisId);
  }, [analysisId, fetchUrl]);

  const handleImageError = useCallback(() => {
    if (!analysisId) return;
    if (retried) {
      setShowPlaceholder(true);
      setUrl(null);
      return;
    }
    setRetried(true);
    setUrl(null);
    fetchUrl(analysisId);
  }, [analysisId, retried, fetchUrl]);

  const handleRetryClick = useCallback(() => {
    if (!analysisId) return;
    setShowPlaceholder(false);
    setRetried(false);
    setUrl(null);
    fetchUrl(analysisId);
  }, [analysisId, fetchUrl]);

  if (showPlaceholder) {
    return (
      <div
        className={`w-full h-full min-h-[80px] flex flex-col items-center justify-center ${placeholderClassName}`}
        role="img"
        aria-label={alt}
      >
        <span>{PLACEHOLDER_TEXT}</span>
        {analysisId && (
          <button
            type="button"
            onClick={handleRetryClick}
            className="mt-2 text-xs text-primary-lime underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary-lime/50 rounded"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (!url) {
    return (
      <div className={`w-full h-full min-h-[80px] animate-pulse bg-surface-alt ${className}`} aria-hidden />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};
