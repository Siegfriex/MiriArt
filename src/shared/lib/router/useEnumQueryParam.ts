/**
 * @fileoverview 단일 쿼리 파라미터를 enum 형태로 읽고 쓰는 훅. URL single source of truth.
 * @참조 usePostTypeQuery, HomeFeed tab
 */

import { useSearchParams } from 'react-router-dom';
import type { z } from 'zod';

export function useEnumQueryParam<T extends string>(
  key: string,
  schema: z.ZodType<T>,
  options?: { replace?: boolean }
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(key) ?? null;
  const value = schema.parse(raw ?? undefined) as T;

  const setValue = (next: T) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set(key, next);
        return nextParams;
      },
      { replace: options?.replace ?? true }
    );
  };

  return [value, setValue];
}
