/**
 * @fileoverview Chat API 응답 Zod 스키마. BE 계약 검증용. Request 스키마는 BE 연동 시점에 적용 예정.
 */

import { z } from 'zod';

export const chatResponseSchema = z.object({
  text: z.string(),
  sessionId: z.string(),
  groundingUrls: z.array(z.string()).optional(),
  quickReplies: z.array(z.string()).optional(),
});
export type ChatResponse = z.infer<typeof chatResponseSchema>;

// TODO: ChatRequest / ChatMessageHistory 등 request 관련 스키마는 BE 연동 시 적용
// export const chatRequestSchema = z.object({ ... });
