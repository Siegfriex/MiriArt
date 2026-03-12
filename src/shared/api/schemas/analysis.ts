/**
 * @fileoverview Analysis API 응답 Zod 스키마. BE 계약 검증용.
 * P0: POST /api/analyses 202 응답용 analysisStartResponseSchema 추가.
 */

import { z } from 'zod';

/** POST /api/analyses 202 Accepted 응답. analysisId로 GET 단건 조회 후 전체 결과 사용. */
export const analysisStartResponseSchema = z.object({
  analysisId: z.string(),
  status: z.string().optional(),
  message: z.string().optional(),
});
export type AnalysisStartResponse = z.infer<typeof analysisStartResponseSchema>;

const radarDataSchema = z.object({
  density: z.number(),
  form: z.number(),
  completion: z.number(),
  relevance: z.number(),
  thinking: z.number(),
});

const defaultRadarData = { density: 0, form: 0, completion: 0, relevance: 0, thinking: 0 };

/** BE가 문자열 JSON 또는 배열로 보낼 수 있음. 항상 배열로 정규화. */
export const universityPredictionSchema = z.object({
  name: z.string(),
  type: z.enum(['TOP', 'MID', 'SAFE']),
  probability: z.number(),
});

const universityPredictionsCoercedSchema = z
  .union([
    z.string().transform((s) => {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          const result = z.array(universityPredictionSchema).safeParse(parsed);
          if (result.success) return result.data;
        }
        return [];
      } catch {
        return [];
      }
    }),
    z.array(universityPredictionSchema),
  ])
  .optional();

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
  universityPredictions: universityPredictionsCoercedSchema,
  summaryComment: z.string().optional(),
  targetMajor: z.string().optional(),
  targetUniversity: z.string().optional(),
});
export type AnalysisResponseApi = z.infer<typeof analysisResponseSchema>;

/** GET /api/analyses 목록 응답. content(Spring Page) 또는 analyses */
export const analysesListResponseSchema = z.union([
  z.object({ analyses: z.array(analysisResponseSchema) }),
  z.object({ content: z.array(analysisResponseSchema) }),
]).transform((v) => 'analyses' in v ? v.analyses : v.content);
export type AnalysesListResponseApi = z.infer<typeof analysesListResponseSchema>;
