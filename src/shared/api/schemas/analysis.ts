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

const defaultRadarData = { density: 0, form: 0, completion: 0, relevance: 0, thinking: 0 };

export const analysisResponseSchema = z.object({
  id: z.string(),
  grade: z.string(),
  totalScore: z.number().nullable().transform((v) => v ?? 0),
  radarData: radarDataSchema.optional().default(defaultRadarData),
  fixScope: z.enum(['StructureRebuild', 'DetailTuning']).optional().default('DetailTuning'),
  comment: z.string().default(''),
  imageUrl: z.string().optional(),
  university: z.string().optional(),
  major: z.string().optional(),
});
export type AnalysisResponseApi = z.infer<typeof analysisResponseSchema>;

/** GET /api/analyses 목록 응답. content(Spring Page) 또는 analyses */
export const analysesListResponseSchema = z.union([
  z.object({ analyses: z.array(analysisResponseSchema) }),
  z.object({ content: z.array(analysisResponseSchema) }),
]).transform((v) => 'analyses' in v ? v.analyses : v.content);
export type AnalysesListResponseApi = z.infer<typeof analysesListResponseSchema>;
