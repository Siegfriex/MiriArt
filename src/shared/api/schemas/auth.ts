/**
 * @fileoverview Auth API 응답 Zod 스키마. BE 계약 검증용.
 */

import { z } from 'zod';

export const tokenExchangeSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number().optional(),
  userId: z.string(),
  needsProfile: z.boolean(),
  provider: z.string().optional(),
});
export type TokenExchangeResponse = z.infer<typeof tokenExchangeSchema>;

export const refreshResponseSchema = z.object({
  accessToken: z.string(),
});
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
