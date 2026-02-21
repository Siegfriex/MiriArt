// Entities Layer: Artwork Model
import { Grade } from '../../shared/model/types';

export interface Artwork {
  id: string;
  imageUrl: string;
  university: string;
  major: string;
  grade: Grade;
  score?: number;
  timestamp: number;
}

// Mock Data Service
export const MOCK_ARTWORKS: Artwork[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `art-${i}`,
  imageUrl: `https://picsum.photos/300/400?random=${i + 100}`,
  university: i % 2 === 0 ? 'Hongik Univ.' : 'Kookmin Univ.',
  major: i % 3 === 0 ? 'Visual Design' : 'Basic Design',
  grade: i % 4 === 0 ? Grade.A : i % 4 === 1 ? Grade.B : Grade.C,
  timestamp: Date.now() - (i * 86400000),
}));

export const getRecentArtworks = (limit: number = 5) => MOCK_ARTWORKS.slice(0, limit);
export const getAllArtworks = () => MOCK_ARTWORKS;
export const getArtworkById = (id: string): Artwork | undefined => MOCK_ARTWORKS.find(art => art.id === id);