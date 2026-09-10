import { useCallback, useEffect, useState } from 'react';
import { isAbortError } from '@/api/http-client';
import { listComments } from '@/api/comments.api';
import type { PaginationMeta } from '@/types/api';
import type { Comment } from '@/types/comment';

const DEFAULT_LIMIT = 10;

type CommentsState = {
  key: string;
  comments: Comment[];
  meta: PaginationMeta | null;
  error: string | null;
};

function requestKey(postId: number | null, page: number, limit: number, refresh: number): string {
  return `${postId ?? ''}|${page}|${limit}|${refresh}`;
}

export function useComments(postId: number | null, page: number, limit = DEFAULT_LIMIT) {
  const [refresh, setRefresh] = useState(0);
  const key = requestKey(postId, page, limit, refresh);
  const [state, setState] = useState<CommentsState>({
    key: '',
    comments: [],
    meta: null,
    error: null,
  });

  const reload = useCallback(() => {
    setRefresh((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!postId) {
      return undefined;
    }

    const controller = new AbortController();

    listComments(postId, { page, limit }, controller.signal)
      .then((response) => {
        setState({
          key,
          comments: response.data,
          meta: response.meta,
          error: null,
        });
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught) || controller.signal.aborted) {
          return;
        }

        setState({
          key,
          comments: [],
          meta: null,
          error: 'Não foi possível carregar os comentários. Tente novamente.',
        });
      });

    return () => controller.abort();
  }, [postId, page, limit, key]);

  if (!postId) {
    return {
      comments: [],
      meta: null,
      isLoading: false,
      error: null,
      reload,
    };
  }

  const isLoading = state.key !== key;

  return {
    comments: isLoading ? [] : state.comments,
    meta: isLoading ? null : state.meta,
    isLoading,
    error: isLoading ? null : state.error,
    reload,
  };
}
