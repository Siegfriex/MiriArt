/**
 * @fileoverview 홈 피드 URL 쿼리 훅. tab / grade / domain을 한 번에 관리. "전체" = param 없음.
 * @참조 Home Page, usePostsFeed
 */

import { z } from 'zod';
import { useEnumQueryParam } from '../../shared/lib/router/useEnumQueryParam';
import { useStringQueryParam } from '../../shared/lib/router/useStringQueryParam';

export type FeedTab = 'timeline' | 'qna' | 'popular';

const tabSchema = z.enum(['timeline', 'qna', 'popular']).catch('timeline');

export function useFeedQuery(): {
  tab: FeedTab;
  setTab: (tab: FeedTab) => void;
  grade: string;
  setGrade: (grade: string) => void;
  domain: string;
  setDomain: (domain: string) => void;
} {
  const [tab, setTab] = useEnumQueryParam<FeedTab>('tab', tabSchema);
  const [grade, setGrade] = useStringQueryParam('grade');
  const [domain, setDomain] = useStringQueryParam('domain');
  return { tab, setTab, grade, setGrade, domain, setDomain };
}
