/**
 * @fileoverview User API 응답 Zod 스키마. BE 계약 검증용.
 * GET /api/users/me 응답의 data 객체 형식에 맞춤 (nickname/grade/domain null 허용, createdAt 포함).
 */

import { z } from 'zod';

/** BE /api/users/me 응답의 data 필드 스키마. raw.data 를 파싱 대상으로 사용. */
export const userProfileApiSchema = z.object({
  id: z.string(),
  nickname: z.string().nullable().transform((v) => v ?? ''),
  grade: z.string().nullable().transform((v) => v ?? ''),
  domain: z.string().nullable().transform((v) => v ?? ''),
  provider: z.string().optional(),
  role: z.string().optional(),
  reputationScore: z.number(),
  reputationLevel: z.number(),
  needsProfile: z.boolean(),
  createdAt: z.string(),
});
export type UserProfileApi = z.infer<typeof userProfileApiSchema>;

export const userPlanSchema = z.object({
  plan: z.string(),
  monthlyLimit: z.number(),
  usedThisMonth: z.number(),
  remaining: z.number(),
  billingPeriodStart: z.string().optional(),
});
export type UserPlanApi = z.infer<typeof userPlanSchema>;
