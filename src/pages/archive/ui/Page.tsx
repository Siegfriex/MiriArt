/**
 * @fileoverview 아카이브 페이지. ArtworkGrid/AnalysisCarousel, view/sort는 URL 쿼리와 동기화.
 * @참조 AppRouter
 * @라우팅 /app/archive, /app/archive?view=list&sort=school
 * @상태 useModalStore, useArchiveQuery (view, sort)
 */

import React, { useMemo } from 'react';
import { H1 } from '../../../shared/ui/Typography';
import { Grid as GridIcon, List } from 'lucide-react';
import { ArtworkGrid } from '../../../widgets/artwork/ArtworkGrid';
import { AnalysisCarousel } from '../../../widgets/artwork/AnalysisCarousel';
import { MOCK_ARTWORKS } from '../../../entities/artwork/model';
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

/** 아카이브 페이지. @참조 AppRouter @상태 useModalStore, useArchiveQuery */
export const Archive: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { view, setView, sort, setSort } = useArchiveQuery();

  const handleUpload = () => {
    openModal('UPLOAD_FLOW', {
      onComplete: () => navigate(ROUTES.RESULT('art-new')),
    });
  };

  const sortedArtworks = useMemo(() => {
    return [...MOCK_ARTWORKS].sort((a, b) =>
      sort === 'latest'
        ? b.timestamp - a.timestamp
        : a.university.localeCompare(b.university, 'ko')
    );
  }, [sort]);

  const hasArtworks = sortedArtworks.length > 0;

  return (
    <PageContainer>
      {/* 헤더 */}
      <header className="flex justify-between items-center">
        <H1 className="text-white">{STRINGS.ARCHIVE_TITLE}</H1>
      </header>

      {/* 뷰 토글 + 정렬 */}
      <div className="flex justify-between items-center gap-3">
        {/* 정렬 칩 */}
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

        {/* 뷰 토글 */}
        <div className="flex bg-dark-800 rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-all ${
              view === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-text-mid hover:text-text-secondary'
            }`}
          >
            <GridIcon size={16} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-all ${
              view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-text-mid hover:text-text-secondary'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* 작품 수 */}
      <div className="text-caption text-text-mid">
        {STRINGS.ARCHIVE_TOTAL(sortedArtworks.length)}
      </div>

      {/* 콘텐츠 */}
      {hasArtworks ? (
        <>
          {view === 'grid' ? (
            <ArtworkGrid artworks={sortedArtworks} />
          ) : (
            <AnalysisCarousel artworks={sortedArtworks} />
          )}

          {/* 기존 사용자 하단 Upload CTA */}
          <div className="pt-4 pb-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleUpload}
              className="border-dashed border-white/20"
            >
              {STRINGS.ARCHIVE_UPLOAD_MORE}
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          title={STRINGS.ARCHIVE_EMPTY_TITLE}
          description={STRINGS.ARCHIVE_EMPTY_DESC}
          actionLabel={STRINGS.EMPTY_ARTWORKS_ACTION}
          onAction={handleUpload}
        />
      )}

      <FAB onClick={handleUpload} />
    </PageContainer>
  );
};
