/**
 * @fileoverview 세션 목록 훅. AnalysisApi.getList()로 분석 이력을 조회하여 Session[]로 변환.
 * MOCK_SESSIONS 제거 후 실 API 연동.
 * @참조 SessionListPanel, SideGNB
 */

import { useState, useEffect } from 'react';
import { AnalysisApi } from '../../shared/api/miriartApi';
import type { Session, AnalysisResult } from '../../shared/model/types';

/** 분석 결과 → 세션 카드용 데이터 변환 */
function analysisToSession(a: AnalysisResult): Session {
  return {
    id: a.id,
    title: `${a.university} ${a.major}`,
    university: a.university,
    major: a.major,
    lastMessage: a.comment,
    timestamp: a.timestamp,
    grade: a.grade,
    thumbnailUrl: '', // SignedImage가 analysisId로 처리
    fixScope: a.fixScope,
  };
}

/**
 * 분석 이력 기반 세션 목록 조회.
 * @param size 최대 조회 건수 (기본 20)
 */
export function useSessionList(size = 20) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    setError(null);
    AnalysisApi.getList({ size })
      .then((list) => setSessions(list.map(analysisToSession)))
      .catch(() => setError('세션 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, [size]);

  return { sessions, loading, error, refresh };
}
