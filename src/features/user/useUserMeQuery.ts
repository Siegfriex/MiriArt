/**
 * GET /api/users/me React Query 훅 스켈레톤.
 * TODO: React Query 도입 시 실제로 사용하도록 페이지/훅을 교체 (예: SideGNB, 프로필 영역에서 UserApi.getMe 대신 useUserMeQuery 사용).
 */

import { useQuery } from '@tanstack/react-query';
import { apiFetch, getAuthHeaders, ApiError } from '../../shared/api/miriartApi';
import { userProfileApiSchema, type UserProfileApi } from '../../shared/api/schemas/user';

export function useUserMeQuery() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async (): Promise<UserProfileApi> => {
      const raw = await apiFetch<unknown>('/api/users/me', { headers: getAuthHeaders() });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const parsed = userProfileApiSchema.safeParse(payload);
      if (!parsed.success) throw new ApiError(500, 'Invalid user profile response');
      return parsed.data;
    },
  });
}
