/**
 * @fileoverview 아카이브 페이지 URL 쿼리 훅. view, sort를 URL과 동기화.
 * @참조 Archive Page
 */

import { z } from 'zod';
import { useEnumQueryParam } from '../../../shared/lib/router/useEnumQueryParam';

export type ArchiveView = 'grid' | 'list';
export type ArchiveSort = 'latest' | 'school';

const viewSchema = z.enum(['grid', 'list']).catch('grid');
const sortSchema = z.enum(['latest', 'school']).catch('latest');

export function useArchiveQuery() {
  const [view, setView] = useEnumQueryParam<ArchiveView>('view', viewSchema);
  const [sort, setSort] = useEnumQueryParam<ArchiveSort>('sort', sortSchema);
  return { view, setView, sort, setSort };
}
