/**
 * @fileoverview 공통 도메인 타입 정의. User, Message, Session, Grade, AIModelType 등 앱 전역에서 사용.
 * @참조 miriartApi.ts, aiModels.ts, MessageBubble, ChatInput, SessionCard, AnalysisCard, RadarChart,
 *        StickyContextCard, SessionListPanel, ComparisonAccordion, chat-room Page, result-detail Page, entities
 * @라우팅 (직접 사용 안 함 - 타입만 제공)
 * @상태 (직접 사용 안 함 - 타입만 제공)
 */

/** 사용자 역할: 학생 또는 멘토 */
export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
}

/** 성적 등급 (A~F) */
export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}

/** 사용자 정보: id, 닉네임, 역할, 크레딧, 아바타 URL */
export interface User {
  id: string;
  nickname: string;
  role: UserRole;
  credits: number;
  avatarUrl?: string;
}

/** 메시지 종류: 텍스트, 이미지, 시스템 */
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM',
}

/** 메시지 발신자: 사용자 또는 AI */
export enum Sender {
  USER = 'USER',
  AI = 'AI',
}

/** 채팅 메시지 한 건. id, 발신자, 타입, 내용, 타임스탬프, 출처 URL, 퀵리플라이 등. Structured Chat v3: sectionType/sectionTitle/isLastSection */
export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string;
  timestamp: number;
  isThinking?: boolean;
  groundingUrls?: string[];
  quickReplies?: string[];
  sectionType?: 'strength' | 'improvement' | 'action' | 'summary';
  sectionTitle?: string;
  isLastSection?: boolean;
}

/** 수정 범위: 전체 재구성 또는 세부 조정 */
export type FixScope = 'StructureRebuild' | 'DetailTuning';

/** 세션(채팅/작업 단위) 정보. BE GET /api/chat/sessions 응답과 1:1 대응. URL/라우팅은 sessionKey만 사용(analysisId는 사용하지 않음). */
export interface Session {
  id: number;
  sessionKey: string;
  analysisId: number | null;
  title: string;
  lastMessage: string | null;
  messageCount: number;
  grade: string | null;
  totalScore: number | null;
  fixScope: string | null;
  createdAt: string;
  updatedAt: string;
}

/** AI 모델 종류: CHAT_PRO, FAST, THINKING, SEARCH, IMAGE_EDIT */
export enum AIModelType {
  CHAT_PRO = 'CHAT_PRO',     // gemini-3-pro-preview
  FAST = 'FAST',             // gemini-2.5-flash-lite
  THINKING = 'THINKING',     // gemini-3-pro-preview (high budget)
  SEARCH = 'SEARCH',         // gemini-3-flash-preview (grounding)
  IMAGE_EDIT = 'IMAGE_EDIT', // gemini-2.5-flash-image
}

/** 레이더 차트용 5축 점수 (density, form, completion, relevance, thinking) */
export interface RadarData {
  density: number;
  form: number;
  completion: number;
  relevance: number;
  thinking: number;
}

/** 비교 항목: 대학, 전공, 확률, 유사 합격 수, 설명 */
export interface ComparisonItem {
  university: string;
  major: string;
  probability: number;
  similarAcceptedCount: number;
  description: string;
}

/** 비교 등급 티어: TOP/HIGH/MID/LOW/CRITICAL, 라벨, 임계값, 항목 목록 */
export interface ComparisonTier {
  level: 'TOP' | 'HIGH' | 'MID' | 'LOW' | 'CRITICAL';
  label: string;
  threshold: string;
  items: ComparisonItem[];
}

/** 대학 예측 항목. stickyContext·분석 확장용 */
export interface UniversityPrediction {
  name: string;
  type: 'TOP' | 'MID' | 'SAFE';
  probability: number;
}

/** 분석 결과: id, 이미지 URL, 성적, 총점, 대학, 전공, 레이더 데이터, 코멘트, 비교 티어, 대학 예측 등 */
export interface AnalysisResult {
  id: string;
  imageUrl: string;
  grade: Grade;
  totalScore: number;
  university: string;
  major: string;
  score?: number;
  timestamp: number;
  radarData: RadarData;
  fixScope: FixScope;
  comment: string;
  comparisonTiers?: ComparisonTier[];
  hasAcceptedArtwork?: boolean;
  /** stickyContext 확장: 대학 예측 목록 */
  universityPredictions?: UniversityPrediction[];
  /** 요약 코멘트 (analysisComment로 전달) */
  summaryComment?: string;
  targetMajor?: string;
  targetUniversity?: string;
}