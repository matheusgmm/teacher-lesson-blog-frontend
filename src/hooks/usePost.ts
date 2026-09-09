import { useEffect, useState } from 'react';
import { ApiError, isAbortError } from '@/api/http-client';
import { getPost } from '@/api/posts.api';
import type { Post } from '@/types/post';

type PostState = {
  key: string;
  post: Post | null;
  error: string | null;
  notFound: boolean;
};

export function usePost(id: number | null) {
  const key = id ? String(id) : '';
  const [state, setState] = useState<PostState>({
    key: '',
    post: null,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const controller = new AbortController();

    getPost(id, controller.signal)
      .then((response) => {
        if (!response.data) {
          setState({
            key,
            post: null,
            error: null,
            notFound: true,
          });
          return;
        }

        setState({
          key,
          post: response.data,
          error: null,
          notFound: false,
        });
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught) || controller.signal.aborted) {
          return;
        }

        const notFound = caught instanceof ApiError && caught.status === 404;

        setState({
          key,
          post: null,
          error: notFound ? null : 'Não foi possível carregar esta aula. Tente novamente.',
          notFound,
        });
      });

    return () => controller.abort();
  }, [id, key]);

  if (!id) {
    return {
      post: null,
      isLoading: false,
      error: null,
      notFound: true,
    };
  }

  const isLoading = state.key !== key;

  return {
    post: isLoading ? null : state.post,
    isLoading,
    error: isLoading ? null : state.error,
    notFound: isLoading ? false : state.notFound,
  };
}
