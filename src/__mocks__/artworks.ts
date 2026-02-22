/**
 * 중앙 Mock 데이터 — Artwork
 * 학교별 7개씩, 5개 학교 = 35개
 * 모든 소비처는 이 파일에서 import합니다.
 */

import { Artwork } from '../entities/artwork/model';
import { Grade } from '../shared/model/types';

export const AI_SUMMARIES = [
  '구도 균형이 뛰어나고 밀도가 고르게 분포되어 있습니다.',
  '색채 대비가 강렬하며 화면 전체에 긴장감이 살아있습니다.',
  '사고력과 정합성 측면에서 높은 완성도를 보입니다.',
  '전체적인 배치가 안정적이며 형태력이 돋보입니다.',
  '독창적인 아이디어가 잘 표현되었고 밀도 조절이 탁월합니다.',
  '기초적인 조형 원리가 깊이 있게 반영된 작품입니다.',
  '공간 분할이 효과적이며 완성도 면에서 수준급입니다.',
  '오브젝트 간 관계 설정이 논리적이고 정합성이 높습니다.',
  '렌더링 기술이 뛰어나고 빛과 그림자 표현이 섬세합니다.',
  '색면 구성이 대담하고 사고력의 깊이가 느껴집니다.',
];

type SchoolEntry = {
  university: string;
  majors: string[];
  grades: Grade[];
};

const SCHOOLS: SchoolEntry[] = [
  {
    university: '홍익대학교',
    majors: ['시각디자인', '기초디자인', '섬유미술패션디자인', '목조형가구학과'],
    grades: [Grade.A, Grade.A, Grade.B, Grade.A, Grade.B, Grade.A, Grade.B],
  },
  {
    university: '국민대학교',
    majors: ['시각디자인', '기초디자인', '공업디자인', '공간디자인'],
    grades: [Grade.A, Grade.B, Grade.B, Grade.A, Grade.C, Grade.B, Grade.A],
  },
  {
    university: '이화여자대학교',
    majors: ['조형예술학부', '디자인학부', '섬유예술', '도예유리'],
    grades: [Grade.B, Grade.A, Grade.B, Grade.B, Grade.A, Grade.C, Grade.B],
  },
  {
    university: '서울대학교',
    majors: ['서양화', '조소', '디자인학부', '공예'],
    grades: [Grade.A, Grade.A, Grade.A, Grade.B, Grade.A, Grade.B, Grade.A],
  },
  {
    university: '건국대학교',
    majors: ['시각·영상디자인', '기초디자인', '실내디자인', '의상디자인'],
    grades: [Grade.B, Grade.C, Grade.B, Grade.A, Grade.B, Grade.C, Grade.B],
  },
];

const ITEMS_PER_SCHOOL = 7;

export const MOCK_ARTWORKS: Artwork[] = SCHOOLS.flatMap((school, schoolIdx) =>
  Array.from({ length: ITEMS_PER_SCHOOL }, (_, i) => {
    const globalIdx = schoolIdx * ITEMS_PER_SCHOOL + i;
    return {
      id: `art-${globalIdx}`,
      imageUrl: `https://picsum.photos/300/400?random=${globalIdx + 10}`,
      university: school.university,
      major: school.majors[i % school.majors.length],
      grade: school.grades[i],
      score: 60 + Math.floor(Math.random() * 35),
      timestamp: Date.now() - globalIdx * 86400000,
      aiSummary: AI_SUMMARIES[globalIdx % AI_SUMMARIES.length],
    };
  })
);

export const getRecentArtworks = (limit = 5): Artwork[] =>
  MOCK_ARTWORKS.slice(0, limit);

export const getAllArtworks = (): Artwork[] => MOCK_ARTWORKS;

export const getArtworkById = (id: string): Artwork | undefined =>
  MOCK_ARTWORKS.find((art) => art.id === id);
