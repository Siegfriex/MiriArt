/**
 * @fileoverview MiriArt 커뮤니티 API 진입점. VITE_COMMUNITY_MOCK=true 시 Mock, 아니면 Real(apiFetch).
 */

import { communityApiReal } from './communityApi.real';
import { communityApiMock } from './communityApi.mock';
import type { CommunityApiSurface } from './communityApi.real';
import type {
  Post,
  CreatePostRequest,
  PostsResponse,
  ToggleLikeRequest,
  ToggleLikeResponse,
  CreateAnswerRequest,
  CreateCommentRequest,
} from '@/entities/community/model/types';

const IS_MOCK = import.meta.env.VITE_COMMUNITY_MOCK === 'true';

export const communityApi: CommunityApiSurface = IS_MOCK ? communityApiMock : communityApiReal;

/** @deprecated Use communityApi. Kept for backward compatibility until usePostsFeed refactor. */
export const CommunityApi = communityApi;

export type {
  Post,
  CreatePostRequest,
  PostsResponse,
  ToggleLikeRequest,
  ToggleLikeResponse,
  CreateAnswerRequest,
  CreateCommentRequest,
};
