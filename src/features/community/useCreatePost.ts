/**
 * @fileoverview 글 작성 훅. Phase C1 전: console.log + navigate(-1).
 * @참조 WritePostPage
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostType } from '../../entities/community/model/post';

interface CreatePostForm {
  type: PostType;
  title: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
  deadlineHours?: 24 | 48 | 72;
  images: File[];
}

interface UseCreatePostReturn {
  formState: CreatePostForm;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  toggleTag: (tag: string) => void;
  setIsAnonymous: (v: boolean) => void;
  setDeadlineHours: (v: 24 | 48 | 72 | undefined) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  isSubmitting: boolean;
  submit: () => Promise<void>;
}

export function useCreatePost(initialType: PostType = 'free'): UseCreatePostReturn {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<CreatePostForm>({
    type: initialType,
    title: '',
    content: '',
    tags: [],
    isAnonymous: true,
    deadlineHours: initialType === 'qna' ? 48 : undefined,
    images: [],
  });

  const setTitle = (v: string) => setFormState((s) => ({ ...s, title: v }));
  const setContent = (v: string) => setFormState((s) => ({ ...s, content: v }));
  const setIsAnonymous = (v: boolean) => setFormState((s) => ({ ...s, isAnonymous: v }));
  const setDeadlineHours = (v: 24 | 48 | 72 | undefined) => setFormState((s) => ({ ...s, deadlineHours: v }));

  const toggleTag = (tag: string) =>
    setFormState((s) => ({
      ...s,
      tags: s.tags.includes(tag) ? s.tags.filter((t) => t !== tag) : [...s.tags, tag],
    }));

  const addImage = (file: File) =>
    setFormState((s) => s.images.length < 5 ? { ...s, images: [...s.images, file] } : s);

  const removeImage = (index: number) =>
    setFormState((s) => ({ ...s, images: s.images.filter((_, i) => i !== index) }));

  const submit = useCallback(async () => {
    if (!formState.title.trim() || !formState.content.trim()) return;
    setIsSubmitting(true);
    try {
      // Phase C1 전: 로컬 처리만
      console.log('POST 작성:', formState);
      // Phase C1 후: await CommunityApi.createPost({ ... })
      navigate(-1);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, navigate]);

  return {
    formState, setTitle, setContent, toggleTag,
    setIsAnonymous, setDeadlineHours, addImage, removeImage,
    isSubmitting, submit,
  };
}
