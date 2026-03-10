/**
 * @fileoverview 작품(Artwork) 엔티티 타입. AnalysisResult → Artwork 변환 유틸.
 * @참조 AnalysisCard, ArtworkGrid, Archive, Home, result-detail Page
 */

import { Grade } from '../../shared/model/types';
import type { AnalysisResult } from '../../shared/model/types';

/** 작품 한 건. id, 이미지, 대학, 전공, 성적, 점수, 타임스탬프, AI 요약 */
export interface Artwork {
  id: string;
  imageUrl: string;
  university: string;
  major: string;
  grade: Grade;
  score?: number;
  timestamp: number;
  aiSummary?: string;
}

/** AnalysisResult → Artwork 변환 */
export function toArtwork(a: AnalysisResult): Artwork {
  return {
    id: a.id,
    imageUrl: a.imageUrl,
    university: a.university,
    major: a.major,
    grade: a.grade,
    score: a.totalScore,
    timestamp: a.timestamp,
    aiSummary: a.comment,
  };
}
