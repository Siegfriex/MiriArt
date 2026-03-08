/**
 * @fileoverview 사용자 평판 조회 훅. useQuery(reputationOptions(userId)).
 */

import { useQuery } from '@tanstack/react-query';
import { reputationOptions } from '@/entities/community/api/communityQueries';

export function useReputation(userId: string) {
  return useQuery(reputationOptions(userId));
}
