/**
 * @fileoverview Chat Session API Zod 스키마. GET /api/chat/sessions 응답 검증용.
 * BE 근거: ChatSessionResponse.java (id, sessionKey, analysisId, title, lastMessage, messageCount, grade, totalScore, fixScope, createdAt, updatedAt)
 */

import { z } from 'zod';

/**
 * GET /api/chat/sessions 개별 항목·단건 조회·getOrCreate 응답. BE ChatSessionResponse.
 * sessionKey = SSOT for URL/라우팅. analysisId는 API 응답에서만 사용(절대 URL param으로 쓰지 않음).
 */
export const chatSessionSchema = z.object({
  id: z.number(),
  sessionKey: z.string(),
  analysisId: z.number().nullable(),
  modelType: z.string().optional(),
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

/**
 * GET /api/chat/sessions/{sessionKey}/messages 응답 항목. BE 메시지 DTO와 1:1 대응.
 * sender: USER|AI → Message.sender 매핑. type은 스펙상 TEXT만.
 */
export const chatMessageDtoSchema = z.object({
  id: z.string(),
  sender: z.enum(['USER', 'AI']),
  type: z.enum(['TEXT']),
  content: z.string(),
  timestamp: z.number(),
});
export type ChatMessageDto = z.infer<typeof chatMessageDtoSchema>;

/**
 * Spring Page 래퍼. BE ApiResponse.success(Page<ChatSessionResponse>) → data.
 * 엣지: BE가 pageable: { pageNumber, pageSize } 형태로만 내려주면 파싱 실패 가능. Spring은 보통 number/size로 직렬화하므로 일치함. 불일치 시 .transform() 또는 optional 키 추가 검토.
 */
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
