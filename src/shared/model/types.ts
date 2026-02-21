// Entities: Shared types
export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
}

export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}

export interface User {
  id: string;
  nickname: string;
  role: UserRole;
  credits: number;
  avatarUrl?: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM',
}

export enum Sender {
  USER = 'USER',
  AI = 'AI',
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string; // Text content or Image URL
  timestamp: number;
  isThinking?: boolean; // UI state for thinking mode
  groundingUrls?: string[]; // For search results
}

export interface Session {
  id: string;
  title: string;
  university: string;
  major: string;
  lastMessage: string;
  timestamp: number;
  grade: Grade;
  thumbnailUrl: string;
  unreadCount?: number;
}

export enum AIModelType {
  CHAT_PRO = 'CHAT_PRO',     // gemini-3-pro-preview
  FAST = 'FAST',             // gemini-2.5-flash-lite
  THINKING = 'THINKING',     // gemini-3-pro-preview (high budget)
  SEARCH = 'SEARCH',         // gemini-3-flash-preview (grounding)
  IMAGE_EDIT = 'IMAGE_EDIT', // gemini-2.5-flash-image
}

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  grade: Grade;
  totalScore: number;
  university: string;
  major: string;
  radarData: {
    density: number; // 밀도
    form: number;    // 형태력
    completion: number; // 완성도
    relevance: number; // 정합성
    thinking: number; // 사고력
  };
  fixScope: 'StructureRebuild' | 'DetailTuning';
  comment: string;
  timestamp: number;
}