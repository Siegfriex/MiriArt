/**
 * @fileoverview Chat Session API Zod 스키마. GET /api/chat/sessions 응답 검증용.
 * BE 근거: ChatSessionResponse.java (id, sessionKey, analysisId, title, lastMessage, messageCount, grade, totalScore, fixScope, createdAt, updatedAt)
 */

import { z } from 'zod';

/** GET /api/chat/sessions 개별 항목. BE ChatSessionResponse */
export const chatSessionSchema = z.object({
  id: z.number(),
  sessionKey: z.string(),
  analysisId: z.number().nullable(),
  title: z.string(),
  lastMessage: z.string().nullable(),
  messageCount: z.number().int().min(0),
  grade: z.string().nullable(),
  totalScore: z.number().nullable(),
  fixScope: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ChatSessionDto = z.infer<typeof chatSessionSchema>;

/** Spring Page 래퍼. BE ApiResponse.success(Page<ChatSessionResponse>) → data */
export const chatSessionPageSchema = z.object({
  content: z.array(chatSessionSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(),
  first: z.boolean(),
  last: z.boolean(),
  empty: z.boolean(),
});
export type ChatSessionPage = z.infer<typeof chatSessionPageSchema>;
