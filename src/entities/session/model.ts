// Entities Layer: Session Model
import { Grade, Session } from '../../shared/model/types';

export const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    title: 'Composition Layout Check',
    university: 'Hongik Univ.',
    major: 'Visual Design',
    lastMessage: 'The density in the lower left corner needs more work. Try adding...',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    grade: Grade.B,
    thumbnailUrl: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: '2',
    title: 'Color Tone Analysis',
    university: 'Kookmin Univ.',
    major: 'Basic Design',
    lastMessage: 'Your color palette is very consistent with the winning entries from last year.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    grade: Grade.A,
    thumbnailUrl: 'https://picsum.photos/100/100?random=2',
  },
  {
    id: '3',
    title: 'Texture Rendering Review',
    university: 'Seoul Nat. Univ.',
    major: 'Craft Design',
    lastMessage: 'The texture of the metal object looks a bit flat.',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    grade: Grade.C,
    thumbnailUrl: 'https://picsum.photos/100/100?random=3',
  }
];

export const getSessions = () => MOCK_SESSIONS;