/**
 * @fileoverview optional 단일 쿼리 파라미터(문자열) 읽기/쓰기. "전체" = param 없음.
 * @참조 useFeedQuery (grade, domain)
 */

import { useSearchParams } from 'react-router-dom';

export function useStringQueryParam(
  key: string,
  options?: { replace?: boolean }
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) ?? '';

  const setValue = (next: string) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (next === '') {
          nextParams.delete(key);
        } else {
          nextParams.set(key, next);
        }
        return nextParams;
      },
      { replace: options?.replace ?? true }
    );
  };

  return [value, setValue];
}
