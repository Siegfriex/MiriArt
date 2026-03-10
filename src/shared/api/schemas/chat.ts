/**
 * @fileoverview Chat API Zod 스키마. BE 계약 검증용. Request + Response.
 */

import { z } from 'zod';

// ─── Response ────────────────────────────────────────────────────────────────
export const chatResponseSchema = z.object({
  text: z.string(),
  sessionId: z.string(),
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

export const stickyContextSchema = z.object({
  grade: z.string(),
  score: z.number(),
  fixScope: z.string(),
  radarData: z.record(z.string(), z.number()).optional(),
});
export type StickyContext = z.infer<typeof stickyContextSchema>;

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  modelType: z.enum(['CHAT_PRO', 'FAST', 'THINKING', 'SEARCH', 'IMAGE_EDIT']),
  sessionId: z.string().optional(),
  stickyContext: stickyContextSchema.optional(),
  imageBase64: z.string().optional(),
  imageMimeType: z.string().optional(),
  history: z.array(chatMessageHistorySchema).optional(),
});
export type ChatRequestApi = z.infer<typeof chatRequestSchema>;
