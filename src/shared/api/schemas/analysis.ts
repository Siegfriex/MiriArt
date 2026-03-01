/**
 * @fileoverview Analysis API 응답 Zod 스키마. BE 계약 검증용.
 */

import { z } from 'zod';

const radarDataSchema = z.object({
  density: z.number(),
  form: z.number(),
  completion: z.number(),
  relevance: z.number(),
  thinking: z.number(),
});

export const analysisResponseSchema = z.object({
  id: z.string(),
  grade: z.string(),
  totalScore: z.number(),
  radarData: radarDataSchema,
  fixScope: z.enum(['StructureRebuild', 'DetailTuning']),
  comment: z.string(),
});
export type AnalysisResponseApi = z.infer<typeof analysisResponseSchema>;
