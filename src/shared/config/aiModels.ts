/**
 * @fileoverview AI 모델 설정. CHAT_PRO, FAST, THINKING, SEARCH, IMAGE_EDIT 각각 label, icon 매핑.
 * @참조 ChatInput (채팅방 모델 선택), ChatRoom Page
 * @라우팅 /chat/:sessionId
 * @상태 (직접 사용 안 함 - 설정만 제공)
 */

import { AIModelType } from '../model/types';
import { STRINGS } from './strings';

/** AI 모델 설정: type, label, iconName */
export interface AIModelConfig {
  type: AIModelType;
  label: string;
  iconName: 'MessageCircle' | 'Zap' | 'Brain' | 'Globe' | 'Edit3';
}

/** AI 모델 목록 (채팅방 모델 선택용) */
export const AI_MODELS: AIModelConfig[] = [
  { type: AIModelType.CHAT_PRO,   label: STRINGS.CHATROOM_MODEL_ASK,       iconName: 'MessageCircle' },
  { type: AIModelType.FAST,        label: STRINGS.CHATROOM_MODEL_PLAN,       iconName: 'Zap' },
  { type: AIModelType.THINKING,    label: STRINGS.CHATROOM_MODEL_CRITIC,     iconName: 'Brain' },
  { type: AIModelType.SEARCH,      label: STRINGS.CHATROOM_MODEL_INFERENCE,  iconName: 'Globe' },
  { type: AIModelType.IMAGE_EDIT,  label: STRINGS.CHATROOM_MODEL_EDIT,       iconName: 'Edit3' },
];
