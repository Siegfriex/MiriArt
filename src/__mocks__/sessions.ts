/**
 * 중앙 Mock 데이터 — Session
 * 학교 5곳 x 2세션 = 10개
 * sessionId는 artworkId와 연결 가능하도록 'art-N' 형식 사용
 */

import { Session, Grade } from '../shared/model/types';

const SAMPLE_LAST_MESSAGES: Record<string, string[]> = {
  홍익대학교: [
    '하단 좌측의 밀도를 조금 더 높여보세요. 형태력이 살아날 거예요.',
    '전체 구도는 안정적입니다. 오브젝트 간 간격을 재조정하면 완성도가 높아집니다.',
  ],
  국민대학교: [
    '색상 팔레트가 작년 합격작과 매우 유사합니다. 좋은 방향이에요.',
    '기본기가 탄탄합니다. 사고력 지표를 높이려면 주제를 더 깊이 해석해보세요.',
  ],
  이화여자대학교: [
    '금속 오브젝트의 질감이 다소 평평하게 느껴집니다. 하이라이트 강화가 필요해요.',
    '색면 구성이 대담하고 개성 있습니다. 정합성 지표를 보완하세요.',
  ],
  서울대학교: [
    '구성 방식이 독창적입니다. 밀도 부분을 추가로 보완하면 최상위권 수준이에요.',
    '형태 묘사 실력이 뛰어납니다. 전체 완성도를 높이는 마무리 작업을 추천드려요.',
  ],
  건국대학교: [
    '기초디자인의 기본기가 충실히 반영되어 있습니다. 사고력 표현을 추가하세요.',
    '공간 활용이 효율적입니다. 색채 대비를 강화하면 더욱 좋아질 것 같아요.',
  ],
};

type SessionDef = {
  artworkId: string;
  university: string;
  major: string;
  title: string;
  grade: Grade;
  fixScope: 'DetailTuning' | 'StructureRebuild';
  lastMessageIdx: number;
  hoursAgo: number;
};

const SESSION_DEFS: SessionDef[] = [
  { artworkId: 'art-0', university: '홍익대학교', major: '시각디자인', title: '구도 레이아웃 점검', grade: Grade.B, fixScope: 'DetailTuning', lastMessageIdx: 0, hoursAgo: 0.5 },
  { artworkId: 'art-1', university: '홍익대학교', major: '기초디자인', title: '기초디자인 심층 분석', grade: Grade.A, fixScope: 'DetailTuning', lastMessageIdx: 1, hoursAgo: 3 },
  { artworkId: 'art-7', university: '국민대학교', major: '시각디자인', title: '색조 분석 세션', grade: Grade.A, fixScope: 'DetailTuning', lastMessageIdx: 0, hoursAgo: 24 },
  { artworkId: 'art-8', university: '국민대학교', major: '기초디자인', title: '기초조형 컨설팅', grade: Grade.B, fixScope: 'DetailTuning', lastMessageIdx: 1, hoursAgo: 48 },
  { artworkId: 'art-14', university: '이화여자대학교', major: '조형예술학부', title: '질감 렌더링 검토', grade: Grade.C, fixScope: 'StructureRebuild', lastMessageIdx: 0, hoursAgo: 72 },
  { artworkId: 'art-15', university: '이화여자대학교', major: '디자인학부', title: '색면 구성 전략', grade: Grade.B, fixScope: 'DetailTuning', lastMessageIdx: 1, hoursAgo: 96 },
  { artworkId: 'art-21', university: '서울대학교', major: '서양화', title: '서울대 합격 전략 세션', grade: Grade.A, fixScope: 'DetailTuning', lastMessageIdx: 0, hoursAgo: 120 },
  { artworkId: 'art-22', university: '서울대학교', major: '디자인학부', title: '형태 표현력 강화', grade: Grade.A, fixScope: 'DetailTuning', lastMessageIdx: 1, hoursAgo: 144 },
  { artworkId: 'art-28', university: '건국대학교', major: '시각·영상디자인', title: '건국대 기초디자인 분석', grade: Grade.B, fixScope: 'DetailTuning', lastMessageIdx: 0, hoursAgo: 168 },
  { artworkId: 'art-29', university: '건국대학교', major: '기초디자인', title: '공간 활용 최적화', grade: Grade.C, fixScope: 'StructureRebuild', lastMessageIdx: 1, hoursAgo: 192 },
];

export const MOCK_SESSIONS: Session[] = SESSION_DEFS.map((def, i) => ({
  // id를 artworkId와 동일하게 설정 → ChatRoom에서 artworkId 기반 lookup 가능
  id: def.artworkId,
  title: def.title,
  university: def.university,
  major: def.major,
  lastMessage: SAMPLE_LAST_MESSAGES[def.university][def.lastMessageIdx],
  timestamp: Date.now() - def.hoursAgo * 3600000,
  grade: def.grade,
  thumbnailUrl: `https://picsum.photos/100/100?random=${i + 50}`,
  fixScope: def.fixScope,
}));

export const getSessions = () => MOCK_SESSIONS;
