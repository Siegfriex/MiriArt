/**
 * @fileoverview /write?type= 쿼리를 URL single source of truth로 다루는 훅.
 * Zod로 type 파싱, 비정상 값은 'free'로 정규화.
 * @참조 WritePostPage
 */

import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import type { PostType } from '../../../entities/community/model/post';

const postTypeSchema = z.enum(['free', 'qna']).catch('free');

export function usePostTypeQuery(): [PostType, (type: PostType) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('type') ?? 'free';
  const type = postTypeSchema.parse(raw) as PostType;

  const setType = (next: PostType) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set('type', next);
        return nextParams;
      },
      { replace: true }
    );
  };

  return [type, setType];
}
