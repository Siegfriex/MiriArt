/**
 * @fileoverview 글쓰기/질문하기 Full Page. usePostTypeQuery로 type 쿼리 읽기 (URL single source of truth).
 * @참조 AppRouter
 * @라우팅 /write?type=free|qna
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { H2 } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { TextInput } from '../../../shared/ui/TextInput';
import { Select } from '../../../shared/ui/Select';
import { TagChip } from '../../../shared/ui/TagChip';
import { useCreatePost } from '../../../features/community/useCreatePost';
import { usePostTypeQuery } from '../../../shared/lib/router/usePostTypeQuery';
import { useFeedQuery } from '../../../features/community/useFeedQuery';
import { STRINGS } from '../../../shared/config/strings';
import {
  QNA_DEADLINE_OPTIONS,
  PRESET_TAGS,
  GRADE_SCOPE_OPTIONS,
  DOMAIN_SCOPE_OPTIONS,
  POST_TITLE_MAX_LENGTH,
  POST_CONTENT_MAX_LENGTH,
  POST_IMAGES_MAX_COUNT,
} from '../../../shared/config/community';
import { FullScreenContainer } from '../../../shared/ui/FullScreenContainer';

/** 글쓰기/질문하기 페이지. */
export const WritePostPage: React.FC = () => {
  const [type] = usePostTypeQuery();
  const { grade: initialGrade, domain: initialDomain } = useFeedQuery();
  const navigate = useNavigate();
  const {
    formState,
    setTitle,
    setContent,
    toggleTag,
    setIsAnonymous,
    setDeadlineHours,
    setGradeScope,
    setDomainScope,
    addImage,
    removeImage,
    isSubmitting,
    submit,
  } = useCreatePost(type, initialGrade || undefined, initialDomain || undefined);

  const isQna = formState.type === 'qna';
  const pageTitle = isQna ? STRINGS.POST_PAGE_TITLE_QNA : STRINGS.POST_PAGE_TITLE_FREE;

  return (
    <FullScreenContainer scroll="none">
      <header className="h-14 flex items-center justify-between px-page-x border-b border-border-default flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-text-mid hover:text-text-primary transition-colors"
          aria-label={STRINGS.BACK}
        >
          <X size={22} />
        </button>
        <H2 className="text-text-primary text-sm">{pageTitle}</H2>
        <Button
          size="sm"
          onClick={submit}
          disabled={isSubmitting || !formState.title.trim() || !formState.content.trim()}
          className="rounded-xl"
        >
          {isSubmitting ? STRINGS.POST_SUBMITTING : STRINGS.POST_SUBMIT}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-page-x space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            {STRINGS.POST_LABEL_TITLE}
          </label>
          <TextInput
            value={formState.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isQna ? STRINGS.POST_PLACEHOLDER_TITLE_QNA : STRINGS.POST_PLACEHOLDER_TITLE}
            maxLength={POST_TITLE_MAX_LENGTH}
            size="md"
          />
          <div className="text-right text-caption text-text-low">
            {formState.title.length}/{POST_TITLE_MAX_LENGTH}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            {isQna ? STRINGS.POST_LABEL_CONTENT_QNA : STRINGS.POST_LABEL_CONTENT}
          </label>
          <TextInput
            multiline
            rows={6}
            value={formState.content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isQna ? STRINGS.POST_PLACEHOLDER_CONTENT_QNA : STRINGS.POST_PLACEHOLDER_CONTENT
            }
            maxLength={POST_CONTENT_MAX_LENGTH}
          />
          <div className="text-right text-caption text-text-low">
            {formState.content.length}/{POST_CONTENT_MAX_LENGTH}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            {STRINGS.POST_LABEL_IMAGES}
          </label>
          <div className="flex gap-2 flex-wrap">
            {formState.images.map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-medium overflow-hidden border border-border-default"
              >
                <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 min-w-0 p-0 rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label={STRINGS.DELETE}
                >
                  ×
                </Button>
              </div>
            ))}
            {formState.images.length < POST_IMAGES_MAX_COUNT && (
              <label className="w-20 h-20 rounded-medium border-2 border-dashed border-border-subtle flex items-center justify-center cursor-pointer hover:border-primary-lime/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) addImage(e.target.files[0]);
                  }}
                />
                <ImageIcon size={24} className="text-text-low" />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            {STRINGS.POST_LABEL_TAGS}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TAGS.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={formState.tags.includes(tag) ? 'outline' : 'secondary'}
                size="sm"
                onClick={() => toggleTag(tag)}
                className={
                  formState.tags.includes(tag)
                    ? 'bg-primary-lime/10 border-primary-lime text-primary-lime'
                    : ''
                }
              >
                {tag}
              </Button>
            ))}
          </div>
          {formState.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {formState.tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-border-default">
          <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
            {STRINGS.POST_LABEL_TARGET}
          </label>
          <div className="flex gap-2">
            <Select
              value={formState.gradeScope ?? ''}
              onChange={(e) => setGradeScope(e.target.value || undefined)}
              className="flex-1"
              fullWidth
            >
              <option value="">{STRINGS.ARCHIVE_FILTER_ALL}</option>
              {GRADE_SCOPE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
            <Select
              value={formState.domainScope ?? ''}
              onChange={(e) => setDomainScope(e.target.value || undefined)}
              className="flex-1"
              fullWidth
            >
              <option value="">{STRINGS.ARCHIVE_FILTER_ALL}</option>
              {DOMAIN_SCOPE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isQna && (
          <div className="space-y-2">
            <label className="text-xs text-text-mid font-medium uppercase tracking-wider">
              {STRINGS.POST_LABEL_DEADLINE}
            </label>
            <div className="flex gap-2">
              {QNA_DEADLINE_OPTIONS.map(({ label, value }) => (
                <Button
                  key={value}
                  type="button"
                  variant={formState.deadlineHours === value ? 'outline' : 'secondary'}
                  size="sm"
                  onClick={() => setDeadlineHours(value)}
                  className={
                    formState.deadlineHours === value
                      ? 'bg-primary-lime/10 border-primary-lime text-primary-lime'
                      : ''
                  }
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-3 border-t border-border-default">
          <span className="text-sm text-text-primary">{STRINGS.POST_ANONYMOUS}</span>
          <button
            type="button"
            onClick={() => setIsAnonymous(!formState.isAnonymous)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              formState.isAnonymous ? 'bg-primary-lime' : 'bg-surface-tertiary'
            }`}
            aria-pressed={formState.isAnonymous}
            aria-label={STRINGS.POST_ANONYMOUS}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                formState.isAnonymous ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="rounded-medium border border-border-default bg-surface-alt p-4 flex items-center gap-3 opacity-50">
          <Sparkles size={20} className="text-primary-lime flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-text-primary">{STRINGS.POST_AI_ASK_TITLE}</div>
            <div className="text-xs text-text-mid">{STRINGS.POST_AI_ASK_PLACEHOLDER}</div>
          </div>
        </div>
      </div>
    </FullScreenContainer>
  );
};
