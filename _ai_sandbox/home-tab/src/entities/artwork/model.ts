/**
 * @fileoverview 작품(Artwork) 엔티티. id, imageUrl, university, major, grade, score, timestamp, aiSummary.
 * @참조 Home Page (최근 분석 캐러셀)
 * @상태 (직접 사용 안 함 - Mock/API 데이터)
 */

import { Grade } from '../../shared/model/types';

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

// Mock 데이터 (샌드박스용 인라인 — 순환 참조 방지)
const AI_SUMMARIES = [
  '구도 균형이 뛰어나고 밀도가 고르게 분포되어 있습니다.',
  '색채 대비가 강렬하며 화면 전체에 긴장감이 살아있습니다.',
  '사고력과 정합성 측면에서 높은 완성도를 보입니다.',
];

const SCHOOLS = [
  { university: '홍익대학교', majors: ['시각디자인', '기초디자인'], grades: [Grade.A, Grade.B, Grade.A] as Grade[] },
  { university: '국민대학교', majors: ['시각디자인', '기초디자인'], grades: [Grade.A, Grade.B, Grade.B] as Grade[] },
  { university: '이화여자대학교', majors: ['조형예술학부', '디자인학부'], grades: [Grade.B, Grade.A, Grade.B] as Grade[] },
  { university: '서울대학교', majors: ['서양화', '조소'], grades: [Grade.A, Grade.A, Grade.B] as Grade[] },
  { university: '건국대학교', majors: ['시각·영상디자인', '기초디자인'], grades: [Grade.B, Grade.C, Grade.B] as Grade[] },
];

export const MOCK_ARTWORKS: Artwork[] = SCHOOLS.flatMap((school, schoolIdx) =>
  Array.from({ length: 7 }, (_, i) => ({
    id: `art-${schoolIdx * 7 + i}`,
    imageUrl: `https://picsum.photos/300/400?random=${schoolIdx * 7 + i + 10}`,
    university: school.university,
    major: school.majors[i % school.majors.length],
    grade: school.grades[i],
    score: 60 + Math.floor(Math.random() * 35),
    timestamp: Date.now() - (schoolIdx * 7 + i) * 86400000,
    aiSummary: AI_SUMMARIES[(schoolIdx * 7 + i) % AI_SUMMARIES.length],
  }))
);

export const getRecentArtworks = (limit = 5): Artwork[] => MOCK_ARTWORKS.slice(0, limit);
export const getAllArtworks = (): Artwork[] => MOCK_ARTWORKS;
export const getArtworkById = (id: string): Artwork | undefined => MOCK_ARTWORKS.find((art) => art.id === id);
