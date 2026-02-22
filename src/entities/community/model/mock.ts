/**
 * @fileoverview Mock 커뮤니티 데이터. Phase C1 전 UI 검증용.
 * 자유글 3개 + Q&A 3개 (미해결 1, 해결 1, 만료 1).
 */

import { Post } from './post';
import { Answer } from './answer';
import { Comment } from './comment';

const now = new Date();
const minsAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();
const hoursLater = (h: number) => new Date(now.getTime() + h * 3_600_000).toISOString();

export const MOCK_POSTS: Post[] = [
  // ── 자유글 ─────────────────────────────────────────────────────────────
  {
    id: 'p1',
    type: 'free',
    status: 'OPEN',
    title: '석고 모작 완성했는데 봐주실 분',
    content:
      '아그리파 3시간 잡고 드디어 완성했어요. 밝은 부분 톤을 어떻게 처리해야 할지 모르겠어서 살짝 날아갔는데, 피드백 주시면 감사하겠습니다!',
    grade: '고3',
    domain: '기초디자인',
    tags: ['석고', '모작', '아그리파'],
    imageUrls: ['https://placehold.co/400x500/1a1a1a/C2F970?text=석고+모작'],
    likeCount: 8,
    answerCount: 0,
    commentCount: 5,
    createdAt: minsAgo(15),
    persona: { displayName: '익명의 화가 42', colorToken: '#C2F970' },
    reputationLevel: 3,
    isLiked: false,
  },
  {
    id: 'p2',
    type: 'free',
    status: 'OPEN',
    title: '정물 수채화 연습 — 톤 분리 조언 구합니다',
    content:
      '정물 수채화인데 밝은 부분과 중간 톤 분리가 잘 안 돼요. 물을 너무 많이 쓴 건지 색이 번져서... 선생님한테 물어봤는데 "드라이하게 해봐"라고만 하셔서요.',
    grade: '재수',
    domain: '수채화',
    tags: ['수채화', '정물', '톤'],
    imageUrls: ['https://placehold.co/400x500/1a1a1a/A8DADC?text=수채화'],
    likeCount: 12,
    answerCount: 0,
    commentCount: 3,
    createdAt: minsAgo(40),
    persona: { displayName: '익명의 화가 17', colorToken: '#A8DADC' },
    reputationLevel: 5,
    isLiked: false,
  },
  {
    id: 'p3',
    type: 'free',
    status: 'OPEN',
    title: '기초디자인 오브젝트 배치 팁 공유',
    content:
      '저 같은 경우 오브젝트를 먼저 가이드라인 없이 배치하고 나서 전체 무게중심을 잡아요. 오른쪽 하단에 무거운 오브젝트 하나 넣으면 안정감이 확 올라오더라고요.',
    grade: 'N수',
    domain: '기초디자인',
    tags: ['기초디자인', '구도', '오브젝트'],
    imageUrls: [],
    likeCount: 34,
    answerCount: 0,
    commentCount: 11,
    createdAt: hoursAgo(3),
    persona: { displayName: '익명의 화가 7', colorToken: '#FFD6A5' },
    reputationLevel: 8,
    isLiked: true,
  },

  // ── Q&A ────────────────────────────────────────────────────────────────
  {
    id: 'q1',
    type: 'qna',
    status: 'OPEN',
    title: '석고 데생 밝은 부분 톤 처리 어떻게 하나요?',
    content:
      '밀도를 올리고 싶은데 어두운 쪽만 계속 짙어져서 밝은 부분이 날아가요. 지우개로 빼는 게 맞나요? 하이라이트를 어느 정도까지 남겨둬야 할지 감이 없어요.',
    grade: '고3',
    domain: '기초디자인',
    tags: ['석고', '데생', '톤', '밀도'],
    imageUrls: ['https://placehold.co/400x500/1a1a1a/C2F970?text=Q+석고+데생'],
    likeCount: 34,
    answerCount: 3,
    commentCount: 7,
    deadlineAt: hoursLater(45),
    createdAt: minsAgo(3),
    persona: { displayName: '익명의 화가 88', colorToken: '#C2F970' },
    reputationLevel: 2,
    isLiked: false,
  },
  {
    id: 'q2',
    type: 'qna',
    status: 'SOLVED',
    title: '수채화 혼색할 때 탁해지는 문제 해결 방법',
    content:
      '팔레트에서 혼색하면 괜찮은데 종이 위에서 혼색하면 항상 탁해져요. 물의 양 문제인지 색의 순서 문제인지 모르겠어서요.',
    grade: '재수',
    domain: '수채화',
    tags: ['수채화', '혼색'],
    imageUrls: [],
    likeCount: 21,
    answerCount: 2,
    commentCount: 4,
    deadlineAt: hoursAgo(12),
    createdAt: hoursAgo(24),
    persona: { displayName: '익명의 화가 55', colorToken: '#A8DADC' },
    reputationLevel: 4,
    isLiked: false,
  },
  {
    id: 'q3',
    type: 'qna',
    status: 'EXPIRED',
    title: '사고의전환 발상 방법 — 동물 + 건축물 조합',
    content:
      '이번 주제가 동물+건축물 기초디자인인데 너무 뻔한 아이디어만 나와요. 발상 전환 어떻게 하시나요?',
    grade: '고2',
    domain: '사고의전환',
    tags: ['사고의전환', '발상', '기초디자인'],
    imageUrls: [],
    likeCount: 9,
    answerCount: 0,
    commentCount: 2,
    deadlineAt: hoursAgo(6),
    createdAt: hoursAgo(78),
    persona: { displayName: '익명의 화가 31', colorToken: '#FF6B6B' },
    reputationLevel: 1,
    isLiked: false,
  },
];

export const MOCK_ANSWERS: Answer[] = [
  {
    id: 'a1',
    postId: 'q1',
    persona: { displayName: '익명의 화가 3', colorToken: '#C2F970' },
    reputationLevel: 12,
    content:
      '밝은 부분은 지우개보다 "남겨두는" 방식이 좋아요. 처음부터 밝은 면을 건드리지 않고 중간톤부터 시작해서 어두운 쪽을 쌓아가는 방식으로 접근해보세요. 하이라이트 근처에서 B연필보다 H 계열로 그라데이션 넣으면 부드럽게 연결돼요.',
    imageUrls: [],
    likeCount: 21,
    isAccepted: true,
    commentCount: 5,
    createdAt: hoursAgo(2),
  },
  {
    id: 'a2',
    postId: 'q1',
    persona: { displayName: '익명의 화가 19', colorToken: '#FFD6A5' },
    reputationLevel: 5,
    content:
      '4B로 어두운 쪽 먼저 잡고, 2H로 밝은 쪽 경계부를 정리하는 방법도 있어요. 지우개는 하이라이트 포인트에만 쓰고 나머지는 남겨두는 게 좋습니다.',
    imageUrls: [],
    likeCount: 7,
    isAccepted: false,
    commentCount: 1,
    createdAt: hoursAgo(4),
  },
  {
    id: 'a3',
    postId: 'q2',
    persona: { displayName: '익명의 화가 62', colorToken: '#A8DADC' },
    reputationLevel: 8,
    content:
      '종이 위에서 혼색할 때 탁해지는 건 색이 완전히 마르기 전에 덧칠해서 그래요. 첫 레이어가 완전히 마른 다음에 두 번째 색을 올려야 선명하게 혼색돼요.',
    imageUrls: [],
    likeCount: 15,
    isAccepted: true,
    commentCount: 3,
    createdAt: hoursAgo(20),
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    parentType: 'post',
    parentId: 'p1',
    persona: { displayName: '익명의 화가 9', colorToken: '#C2F970' },
    content: '오 잘 그렸다! 밝은 부분은 2H 연필로 가볍게 눌러주면 날아가는 느낌 좀 나아질 거에요',
    createdAt: minsAgo(10),
  },
  {
    id: 'c2',
    parentType: 'post',
    parentId: 'p1',
    persona: { displayName: '익명의 화가 44', colorToken: '#FFD6A5' },
    content: '아그리파 3시간이면 빠른 편이네요. 저는 5시간 걸렸는데...',
    createdAt: minsAgo(5),
  },
  {
    id: 'c3',
    parentType: 'answer',
    parentId: 'a1',
    persona: { displayName: '익명의 화가 88', colorToken: '#C2F970' },
    content: '오 이거 진짜 도움됐어요! 채택할게요',
    createdAt: hoursAgo(1),
  },
];
