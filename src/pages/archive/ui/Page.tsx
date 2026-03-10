/**
 * @fileoverview 아카이브 페이지. ArtworkGrid/AnalysisCarousel, view/sort는 URL 쿼리와 동기화.
 * 목록은 /api/analyses 연동.
 * @참조 AppRouter
 * @라우팅 /app/archive, /app/archive?view=list&sort=school
 * @상태 useModalStore, useArchiveQuery (view, sort)
 */

import React, { useEffect, useState, useMemo } from 'react';
import { H1 } from '../../../shared/ui/Typography';
import { Grid as GridIcon, List } from 'lucide-react';
import { ArtworkGrid } from '../../../widgets/artwork/ArtworkGrid';
import { AnalysisCarousel } from '../../../widgets/artwork/AnalysisCarousel';
import { FAB } from '../../../shared/ui/FAB';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { EmptyState } from '../../../widgets/common/EmptyState';
import { FilterChip } from '../../../shared/ui/FilterChip';
import { Button } from '../../../shared/ui/Button';
import { useModalStore } from '../../../shared/model/modalStore';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';
import { useArchiveQuery } from '../model/useArchiveQuery';
import { AnalysisApi, handleApiError, tokenManager } from '../../../shared/api/miriartApi';
import type { AnalysisResult } from '../../../shared/model/types';
import type { Artwork } from '../../../entities/artwork/model';

function toArtwork(a: AnalysisResult): Artwork {
  return {
    id: a.id,
    imageUrl: a.imageUrl,
    university: a.university,
    major: a.major,
    grade: a.grade,
    score: a.totalScore,
    timestamp: a.timestamp,
    aiSummary: a.comment,
  };
}

/** 아카이브 페이지. */
export const Archive: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { view, setView, sort, setSort } = useArchiveQuery();

  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenManager.getAccessToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    AnalysisApi.getList()
      .then(setAnalyses)
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const sortedArtworks = useMemo(() => {
    const list = analyses.map(toArtwork);
    return [...list].sort((a, b) =>
      sort === 'latest' ? b.timestamp - a.timestamp : a.university.localeCompare(b.university, 'ko')
    );
  }, [analyses, sort]);

  const hasArtworks = sortedArtworks.length > 0;

  const handleUpload = () => {
    openModal('UPLOAD_FLOW', {
      onComplete: () => {
        setLoading(true);
        setError(null);
        AnalysisApi.getList()
          .then(setAnalyses)
          .catch((err) => setError(handleApiError(err)))
          .finally(() => setLoading(false));
      },
    });
  };

  return (
    <PageContainer>
      <header className="flex justify-between items-center">
        <H1>{STRINGS.ARCHIVE_TITLE}</H1>
      </header>

      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-2">
          <FilterChip
            label={STRINGS.ARCHIVE_SORT_LATEST}
            selected={sort === 'latest'}
            onClick={() => setSort('latest')}
          />
          <FilterChip
            label={STRINGS.ARCHIVE_SORT_SCHOOL}
            selected={sort === 'school'}
            onClick={() => setSort('school')}
          />
        </div>
        <div className="flex bg-surface-alt rounded-lg p-1 border border-border-default">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-all ${
              view === 'grid' ? 'bg-primary-lime/10 text-text-primary shadow-sm' : 'text-text-mid hover:text-text-secondary'
            }`}
          >
            <GridIcon size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${
              view === 'list' ? 'bg-primary-lime/10 text-text-primary shadow-sm' : 'text-text-mid hover:text-text-secondary'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="text-caption text-text-mid">
        {STRINGS.ARCHIVE_TOTAL(sortedArtworks.length)}
      </div>

      {loading ? (
        <div className="grid grid-cols-5 gap-1.5 py-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="aspect-[3/4] bg-surface-alt rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-text-mid py-8">{error}</p>
      ) : !hasArtworks ? (
        <EmptyState
          title={STRINGS.ARCHIVE_EMPTY_TITLE}
          description={STRINGS.ARCHIVE_EMPTY_DESC}
          actionLabel={STRINGS.EMPTY_ARTWORKS_ACTION}
          onAction={handleUpload}
        />
      ) : (
        <>
          {view === 'grid' ? (
            <ArtworkGrid artworks={sortedArtworks} />
          ) : (
            <AnalysisCarousel artworks={sortedArtworks} />
          )}
          <div className="pt-4 pb-2">
            <Button variant="secondary" fullWidth onClick={handleUpload} className="border-dashed border-border-subtle">
              {STRINGS.ARCHIVE_UPLOAD_MORE}
            </Button>
          </div>
        </>
      )}

      <FAB onClick={handleUpload} />
    </PageContainer>
  );
};
