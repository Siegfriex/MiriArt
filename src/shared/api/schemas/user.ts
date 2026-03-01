/**
 * @fileoverview User API 응답 Zod 스키마. BE 계약 검증용.
 */

import { z } from 'zod';

export const userProfileApiSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  grade: z.string(),
  domain: z.string(),
  provider: z.string().optional(),
  role: z.string().optional(),
  reputationScore: z.number().optional(),
  reputationLevel: z.number().optional(),
  needsProfile: z.boolean(),
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
