/**
 * @fileoverview 평판 레벨 enum. Lv.1~12, 뱃지 정의.
 * @참조 PersonaAvatar, ReputationBadge
 */

export interface ReputationLevel {
  level: number;
  label: string;
  badge: string;
  minScore: number;
}

export const REPUTATION_LEVELS: ReputationLevel[] = [
  { level: 1,  label: '신입생',  badge: '🌱', minScore: 0 },
  { level: 2,  label: '준비생',  badge: '🌱', minScore: 15 },
  { level: 3,  label: '실기생',  badge: '🎨', minScore: 30 },
  { level: 4,  label: '실기생+', badge: '🎨', minScore: 60 },
  { level: 5,  label: '연구생',  badge: '🖌️', minScore: 100 },
  { level: 6,  label: '연구생+', badge: '🖌️', minScore: 150 },
  { level: 7,  label: '수험생',  badge: '🖌️', minScore: 200 },
  { level: 8,  label: '멘토',    badge: '⭐', minScore: 300 },
  { level: 9,  label: '멘토+',   badge: '⭐', minScore: 420 },
  { level: 10, label: '전문가',  badge: '⭐', minScore: 550 },
  { level: 11, label: '마스터-', badge: '👑', minScore: 620 },
  { level: 12, label: '마스터',  badge: '👑', minScore: 700 },
];

export function getBadge(level: number): string {
  return REPUTATION_LEVELS.find((r) => r.level === level)?.badge ?? '🌱';
}
