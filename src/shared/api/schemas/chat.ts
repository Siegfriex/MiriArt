/**
 * @fileoverview Chat API Zod 스키마. BE 계약 검증용. Request + Response.
 */

import { z } from 'zod';

/**
 * POST /api/chat 응답. 실제 API JSON: text, groundingUrls?, quickReplies?, sessionKey, sessionId(하위호환).
 * FE는 sessionKey 우선 사용. 둘 다 없으면 new-session replace 불가.
 */
export const chatResponseSchema = z.object({
  text: z.string(),
  sessionId: z.string().optional(),
  sessionKey: z.string().optional(),
  groundingUrls: z.array(z.string()).optional(),
  quickReplies: z.array(z.string()).optional(),
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;

// ─── Request ─────────────────────────────────────────────────────────────────
export const chatMessageHistorySchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});
export type ChatMessageHistory = z.infer<typeof chatMessageHistorySchema>;

/** 대학 예측 항목. stickyContext 확장용 (3단계). */
export const universityPredictionSchema = z.object({
  name: z.string(),
  type: z.enum(['TOP', 'MID', 'SAFE']),
  probability: z.number(),
});

/**
 * POST /api/chat 요청의 stickyContext. 분석 있을 때: grade/score/fixScope/radarData + 확장 필드 + summaryText.
 * 분석 없고 세션 메타만 있을 때: grade/score/fixScope + summaryText. summaryText는 LLM용 짧은 분석 카드.
 */
export const stickyContextSchema = z.object({
  grade: z.string(),
  score: z.number(),
  fixScope: z.string(),
  radarData: z.record(z.string(), z.number()).optional(),
  universityPredictions: z.array(universityPredictionSchema).optional(),
  analysisComment: z.string().optional(),
  targetMajor: z.string().optional(),
  targetUniversity: z.string().optional(),
  summaryText: z.string().optional(),
});
export type StickyContext = z.infer<typeof stickyContextSchema>;

/**
 * POST /api/chat 요청. sessionKey = SSOT. sessionId는 BE 하위호환용.
 * history는 최근 8턴만 FastAPI에 전달됨. stickyContext는 camelCase → BE에서 snake_case 변환 가능.
 */
export const chatRequestSchema = z.object({
  message: z.string().min(1),
  modelType: z.enum(['CHAT_PRO', 'FAST', 'THINKING', 'SEARCH', 'IMAGE_EDIT']),
  sessionId: z.string().optional(),
  sessionKey: z.string().optional(),
  stickyContext: stickyContextSchema.optional(),
  imageBase64: z.string().optional(),
  imageMimeType: z.string().optional(),
  history: z.array(chatMessageHistorySchema).optional(),
});
export type ChatRequestApi = z.infer<typeof chatRequestSchema>;
