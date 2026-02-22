/**
 * @fileoverview MiriArt UI 문자열 중앙 관리. H1 브랜드명("MiriArt") 영문 유지, H2 이하 한국어.
 * @참조 aiModels.ts, Onboarding, Login, Signup, Home, Archive, ChatRoom, Profile 등 전역
 * @라우팅 (직접 사용 안 함 - 문자열만 제공)
 * @상태 (직접 사용 안 함)
 */

export const STRINGS = {
  // ─── 공통 ──────────────────────────────────────────────────────────────────
  APP_NAME: 'MiriArt',
  CONFIRM: '확인',
  CANCEL: '취소',
  SAVE: '저장',
  DELETE: '삭제',
  BACK: '뒤로가기',
  CLOSE: '닫기',
  SKIP: '건너뛰기',
  NEXT: '다음',
  LOADING: '로딩 중...',
  ERROR: '오류가 발생했습니다',
  RETRY: '다시 시도',

  // ─── BottomNav ─────────────────────────────────────────────────────────────
  NAV_HOME: '홈',
  NAV_ARCHIVE: '아카이브',
  NAV_CHAT: 'AI 상담',
  NAV_PROFILE: '프로필',

  // ─── 인증 ──────────────────────────────────────────────────────────────────
  LOGIN_TITLE: '다시 오셨군요',
  LOGIN_SUBTITLE: '계속하려면 로그인해주세요.',
  LOGIN_EMAIL: '이메일',
  LOGIN_PASSWORD: '비밀번호',
  LOGIN_BUTTON: '로그인',
  LOGIN_TO_SIGNUP: '계정이 없으신가요?',
  LOGIN_SIGNUP_LINK: '회원가입',

  SIGNUP_TITLE: '계정 만들기',
  SIGNUP_SUBTITLE: 'AI 멘토링을 시작해보세요.',
  SIGNUP_NICKNAME: '닉네임',
  SIGNUP_GRADE: '학년',
  SIGNUP_MAJOR: '전공',
  SIGNUP_BUTTON: '회원가입',
  SIGNUP_TO_LOGIN: '이미 계정이 있으신가요?',
  SIGNUP_LOGIN_LINK: '로그인',

  GRADE_HS1: '고등학교 1학년',
  GRADE_HS2: '고등학교 2학년',
  GRADE_HS3: '고등학교 3학년',
  GRADE_GAP: '재수생',

  MAJOR_VISUAL: '시각디자인',
  MAJOR_INDUSTRIAL: '산업디자인',
  MAJOR_FINE: '순수미술',
  MAJOR_CRAFT: '공예',

  // ─── Onboarding ─────────────────────────────────────────────────────────────
  ONBOARDING_SLIDE1_TITLE: 'AI가 8초 만에 작품 평가',
  ONBOARDING_SLIDE1_DESC: '구도, 밀도, 형태력을 즉시 분석해 등급을 제공합니다.',
  ONBOARDING_SLIDE2_TITLE: '합격 확률을 미리 확인',
  ONBOARDING_SLIDE2_DESC: '실제 합격작 데이터 기반으로 나의 위치를 파악하세요.',
  ONBOARDING_SLIDE3_TITLE: 'AI 멘토가 1:1 코칭',
  ONBOARDING_SLIDE3_DESC: '상위권 미대 커리큘럼으로 훈련된 AI와 대화하세요.',
  ONBOARDING_GET_STARTED: '시작하기',

  // ─── Tutorial ───────────────────────────────────────────────────────────────
  TUTORIAL_TITLE: '첫 분석을 시작하세요',
  TUTORIAL_DESC: '지금 바로 작품을 업로드하면 AI 등급과 합격 확률을 즉시 알 수 있어요.',
  TUTORIAL_BUTTON: '지금 업로드',

  // ─── Home ───────────────────────────────────────────────────────────────────
  HOME_PLAN_BADGE: '기본 플랜',
  HOME_UPLOAD_CTA_TITLE: '분석 시작',
  HOME_UPLOAD_CTA_DESC: '작품을 업로드하면 AI가 8초 안에 피드백을 드려요.',
  HOME_UPLOAD_BUTTON: '작품 업로드',
  HOME_RECENT_TITLE: '최근 분석',
  HOME_RECENT_VIEW_ALL: '전체 보기',
  HOME_FIRST_LOGIN_TOOLTIP: '첫 작품을 업로드해보세요!',

  // ─── Archive ────────────────────────────────────────────────────────────────
  ARCHIVE_TITLE: '아카이브',
  ARCHIVE_TOTAL: (n: number) => `총 ${n}개 작품`,
  ARCHIVE_SORT_LATEST: '최신순',
  ARCHIVE_SORT_SCHOOL: '학교순',
  ARCHIVE_FILTER_ALL: '전체',
  ARCHIVE_EMPTY_TITLE: '아직 작품이 없습니다',
  ARCHIVE_EMPTY_DESC: '첫 작품을 업로드해서 AI 피드백을 받아보세요.',
  ARCHIVE_UPLOAD_MORE: '작품 분석 추가',

  // ─── AI Chat ────────────────────────────────────────────────────────────────
  CHAT_TITLE: 'AI 상담',
  CHAT_SEARCH_PLACEHOLDER: '세션 제목, 학교명, 키워드 검색...',
  CHAT_FILTER_ALL: '전체',
  CHAT_EMPTY_TITLE: '채팅 세션 없음',
  CHAT_EMPTY_DESC: '첫 작품을 업로드하고 AI 멘토를 만나보세요.',
  CHAT_EMPTY_ACTION: '새 분석 시작',
  CHAT_NEW_SESSION: '새 세션',
  CHAT_CREDITS: (n: number) => `${n} 크레딧`,

  // ─── SideGNB ────────────────────────────────────────────────────────────────
  SIDEGNB_TITLE: '세션 목록',
  SIDEGNB_FULL_BADGE: '전체',
  SIDEGNB_PARTIAL_BADGE: '빠른보기',
  SIDEGNB_RECENT: '최근 세션',
  SIDEGNB_GRADE_FILTER: '등급별',
  SIDEGNB_SCHOOL_FILTER: '학교별',
  SIDEGNB_NEW_SESSION: '새 세션',

  // ─── ChatRoom ───────────────────────────────────────────────────────────────
  CHATROOM_NEW_SESSION: '새 분석',
  CHATROOM_EXIT: '나가기',
  CHATROOM_THINKING: 'AI가 생각 중...',
  CHATROOM_PLACEHOLDER_CHAT: 'AI 멘토에게 질문하세요...',
  CHATROOM_PLACEHOLDER_EDIT: '수정 내용을 설명하세요 (예: 레트로 필터 추가)...',
  CHATROOM_GREETING: '안녕하세요! AI 멘토입니다. 작품을 업로드하거나 포트폴리오에 대해 질문해보세요.',
  CHATROOM_MODEL_ASK: '질문',
  CHATROOM_MODEL_PLAN: '계획',
  CHATROOM_MODEL_CRITIC: '비평',
  CHATROOM_MODEL_INFERENCE: '추론',
  CHATROOM_MODEL_EDIT: '이미지편집',

  // ─── Result Detail ──────────────────────────────────────────────────────────
  RESULT_GRADE_LABEL: '등급',
  RESULT_SCORE_LABEL: '총점',
  RESULT_5FACTOR: '5요소 분석',
  RESULT_RADAR_DENSITY: '밀도',
  RESULT_RADAR_FORM: '형태력',
  RESULT_RADAR_COMPLETION: '완성도',
  RESULT_RADAR_RELEVANCE: '정합성',
  RESULT_RADAR_THINKING: '사고력',
  RESULT_FIXSCOPE_REBUILD: '구조 재설계 필요',
  RESULT_FIXSCOPE_TUNING: '디테일 개선 권장',
  RESULT_COMPARISON_TITLE: '합격 비교',
  RESULT_COMPARISON_LOCKED: '합격작을 업로드하면 비교분석이 활성화됩니다',
  RESULT_GRADE_INPUT_CTA: '성적을 입력하면 합격 확률을 볼 수 있어요',
  RESULT_GRADE_INPUT_BUTTON: '입력하기',
  RESULT_REANALYZE: '재평가하기',
  RESULT_ASK_MENTOR: 'AI 멘토에게 질문하기',
  RESULT_YEAR_LABEL: '2024 데이터 기준',
  RESULT_COMPARISON_TIER_TOP: 'TOP — 최고 강점',
  RESULT_COMPARISON_TIER_HIGH: 'HIGH — 강점',
  RESULT_COMPARISON_TIER_MID: 'MID — 기본기',
  RESULT_COMPARISON_TIER_LOW: 'LOW — 보완 필요',
  RESULT_COMPARISON_TIER_CRITICAL: 'CRITICAL — 긴급 보완',

  // ─── Upload Flow ────────────────────────────────────────────────────────────
  UPLOAD_TITLE: '새 분석',
  UPLOAD_STEP1_TITLE: '작품 선택',
  UPLOAD_STEP1_DESC: '갤러리에서 사진을 선택해주세요.',
  UPLOAD_STEP1_GALLERY: '갤러리 열기',
  UPLOAD_STEP2_TITLE: '상세 정보',
  UPLOAD_STEP2_TYPE_COMPOSITION: '기초디자인',
  UPLOAD_STEP2_TYPE_BASIC: '기초소양',
  UPLOAD_STEP2_CONTEXT_LABEL: '문제 / 맥락 (선택)',
  UPLOAD_STEP2_CONTEXT_PLACEHOLDER: '문제 또는 의도를 입력해주세요...',
  UPLOAD_STEP3_TITLE: '1 크레딧을 사용하시겠어요?',
  UPLOAD_STEP3_DESC: (credits: number) => `잔여 크레딧: ${credits}개. 분석에 약 8초 소요됩니다.`,
  UPLOAD_STEP4_TITLE: '작품 분석 중...',
  UPLOAD_STEP4_DESC: '구도, 밀도, 형태력을 분석하고 있어요.',
  UPLOAD_ERROR_CREDITS: '크레딧이 부족합니다',
  UPLOAD_ERROR_FILE_SIZE: '파일 크기가 너무 큽니다 (최대 10MB)',
  UPLOAD_ERROR_TIMEOUT: '잠시 후 결과를 알려드릴게요',

  // ─── Grade Input ────────────────────────────────────────────────────────────
  GRADE_INPUT_TITLE: '내신 등급',
  GRADE_INPUT_SUBTITLE: '정확한 합격 확률 예측을 위해 모의고사 등급을 입력해주세요.',
  GRADE_INPUT_KOREAN: '국어',
  GRADE_INPUT_MATH: '수학',
  GRADE_INPUT_ENGLISH: '영어',
  GRADE_INPUT_INQUIRY: '탐구',
  GRADE_INPUT_PERCENTILE: '백분위',
  GRADE_INPUT_MATH_NA: '미적용',
  GRADE_INPUT_INQUIRY_SOCIAL: '사회탐구',
  GRADE_INPUT_INQUIRY_SCIENCE: '과학탐구',
  GRADE_INPUT_SAVE: '저장',
  GRADE_INPUT_LATER: '나중에 입력하기',

  // ─── Subscription ───────────────────────────────────────────────────────────
  SUBSCRIPTION_TITLE: '플랜 업그레이드',
  SUBSCRIPTION_CURRENT: (plan: string) => `현재 플랜: ${plan}`,
  SUBSCRIPTION_FREE: '무료',
  SUBSCRIPTION_BASIC: '기본',
  SUBSCRIPTION_PREMIUM: '프리미엄',
  SUBSCRIPTION_BEST_VALUE: '최고 가치',
  SUBSCRIPTION_CURRENT_PLAN: '현재 플랜',
  SUBSCRIPTION_SUBSCRIBE: (plan: string) => `${plan} 구독하기`,
  SUBSCRIPTION_PAYMENT_CARD: '카드',
  SUBSCRIPTION_PAYMENT_KAKAO: '카카오페이',
  SUBSCRIPTION_PAYMENT_NAVER: '네이버페이',

  // ─── Profile ────────────────────────────────────────────────────────────────
  PROFILE_TITLE: '프로필',
  PROFILE_CREDITS_LABEL: '사용 가능 크레딧',
  PROFILE_CREDITS_CHARGE: '충전하기',
  PROFILE_UPGRADE: '업그레이드',
  PROFILE_RESET_DATE: (date: string) => `${date}에 초기화`,
  PROFILE_ACADEMIC_TITLE: '학업 정보',
  PROFILE_ACADEMIC_GRADE: '학년',
  PROFILE_ACADEMIC_DOMAIN: '전공',
  PROFILE_ACADEMIC_EDIT: '성적 입력/수정',
  PROFILE_SETTINGS_NOTIFICATIONS: '알림 설정',
  PROFILE_SETTINGS_ACCOUNT: '계정 관리',
  PROFILE_SETTINGS_HELP: '도움말 및 지원',
  PROFILE_SETTINGS_LOGOUT: '로그아웃',

  // ─── Session Card ───────────────────────────────────────────────────────────
  SESSION_FIXSCOPE_REBUILD: '구조 재설계',
  SESSION_FIXSCOPE_TUNING: '디테일 조정',

  // ─── Empty States ───────────────────────────────────────────────────────────
  EMPTY_ARTWORKS_TITLE: '아직 작품이 없습니다',
  EMPTY_ARTWORKS_DESC: '첫 작품을 업로드해서 AI 피드백을 받아보세요.',
  EMPTY_ARTWORKS_ACTION: '지금 업로드',

  // ─── Live Ticker ────────────────────────────────────────────────────────────
  TICKER_ITEMS: [
    'User293님이 기초디자인에서 A등급을 달성했습니다.',
    '홍익대 기초조형 합격 확률이 User102님께 계산되었습니다.',
    '새 분석이 7.2초 만에 완료되었습니다.',
    'User888님이 프리미엄 플랜으로 업그레이드했습니다.',
    '오늘 총 128개의 작품이 분석되었습니다.',
  ],
} as const;
