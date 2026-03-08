/**
 * @fileoverview 글 작성 훅. useMutation + communityApi.createPost, 성공 시 피드 invalidation.
 * @참조 WritePostPage, communityApi, communityQueries
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostType } from '@/entities/community/model/post';
import { communityApi } from '@/entities/community/api/communityApi';
import { communityKeys } from '@/entities/community/api/communityQueries';
import type { CreatePostRequest } from '@/entities/community/model/types';

export interface CreatePostForm {
  type: PostType;
  title: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
  deadlineHours?: 24 | 48 | 72;
  images: File[];
  gradeScope?: string;
  domainScope?: string;
}

export interface UseCreatePostReturn {
  formState: CreatePostForm;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  toggleTag: (tag: string) => void;
  setIsAnonymous: (v: boolean) => void;
  setDeadlineHours: (v: 24 | 48 | 72 | undefined) => void;
  setGradeScope: (v: string | undefined) => void;
  setDomainScope: (v: string | undefined) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  isSubmitting: boolean;
  submit: () => Promise<void>;
  isError: boolean;
  error: Error | null;
}

export function useCreatePost(
  initialType: PostType = 'free',
  initialGrade?: string,
  initialDomain?: string
): UseCreatePostReturn {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<CreatePostForm>({
    type: initialType,
    title: '',
    content: '',
    tags: [],
    isAnonymous: true,
    deadlineHours: initialType === 'qna' ? 48 : undefined,
    images: [],
    gradeScope: initialGrade ?? undefined,
    domainScope: initialDomain ?? undefined,
  });

  const mutation = useMutation({
    mutationFn: (body: CreatePostRequest) => communityApi.createPost(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.posts() });
      navigate(-1);
    },
  });

  const setTitle = (v: string) => setFormState((s) => ({ ...s, title: v }));
  const setContent = (v: string) => setFormState((s) => ({ ...s, content: v }));
  const setIsAnonymous = (v: boolean) => setFormState((s) => ({ ...s, isAnonymous: v }));
  const setDeadlineHours = (v: 24 | 48 | 72 | undefined) => setFormState((s) => ({ ...s, deadlineHours: v }));
  const setGradeScope = (v: string | undefined) => setFormState((s) => ({ ...s, gradeScope: v }));
  const setDomainScope = (v: string | undefined) => setFormState((s) => ({ ...s, domainScope: v }));

  const toggleTag = (tag: string) =>
    setFormState((s) => ({
      ...s,
      tags: s.tags.includes(tag) ? s.tags.filter((t) => t !== tag) : [...s.tags, tag],
    }));

  const addImage = (file: File) =>
    setFormState((s) => (s.images.length < 5 ? { ...s, images: [...s.images, file] } : s));

  const removeImage = (index: number) =>
    setFormState((s) => ({ ...s, images: s.images.filter((_, i) => i !== index) }));

  const submit = useCallback(async () => {
    if (!formState.title.trim() || !formState.content.trim()) return;
    const body: CreatePostRequest = {
      type: formState.type,
      title: formState.title.trim(),
      content: formState.content.trim(),
      tags: formState.tags.length ? formState.tags : undefined,
      gradeScope: formState.gradeScope || undefined,
      domainScope: formState.domainScope || undefined,
      isAnonymous: formState.isAnonymous,
      deadlineHours: formState.deadlineHours,
      imageUrls: [], // TODO: GCS presigned URL 또는 BE 업로드 API 연동 후 imageUrls 전달
    };
    await mutation.mutateAsync(body);
  }, [formState, mutation]);

  return {
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
    isSubmitting: mutation.isPending,
    submit,
    isError: mutation.isError,
    error: mutation.error instanceof Error ? mutation.error : null,
  };
}
