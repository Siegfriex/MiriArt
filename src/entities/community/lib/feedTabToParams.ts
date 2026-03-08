/**
 * @fileoverview FeedTab → API params 매핑. HomeFeed에서 usePostsFeed에 병합용.
 */
import type { PostFeedParams } from '../api/communityQueries';

export type FeedTab = 'timeline' | 'qna' | 'popular';

export const FEED_TAB_PARAMS: Record<FeedTab, PostFeedParams> = {
  timeline: { sort: 'latest' },
  qna:      { type: 'qna', sort: 'latest' },
  popular:  { sort: 'popular' },
};
