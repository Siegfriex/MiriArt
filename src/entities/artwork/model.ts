/**
 * @fileoverview 작품(Artwork) 엔티티. id, imageUrl, university, major, grade, score, timestamp, aiSummary.
 * @참조 AnalysisCard, ArtworkGrid, Archive, Home, result-detail Page
 * @라우팅 /app/archive, /app/home, /result/:artworkId
 * @상태 (직접 사용 안 함 - Mock/API 데이터)
 */

import { Grade } from '../../shared/model/types';

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

// Mock 데이터 헬퍼 — __mocks__에서 re-export (하위 호환)
export {
  MOCK_ARTWORKS,
  getRecentArtworks,
  getAllArtworks,
  getArtworkById,
} from '../../__mocks__/artworks';
