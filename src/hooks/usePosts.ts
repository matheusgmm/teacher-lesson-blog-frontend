import { useEffect, useState } from 'react';
import { isAbortError } from '@/api/http-client';
import { listPosts } from '@/api/posts.api';
import type { PaginationMeta } from '@/types/api';
import type { Post } from '@/types/post';

const DEFAULT_LIMIT = 10;

type PostsState = {
  key: string;
  posts: Post[];
  meta: PaginationMeta | null;
  error: string | null;
};

function requestKey(
  search: string,
  page: number,
  limit: number,
  from: string | null,
  to: string | null,
): string {
  return `${search}|${from ?? ''}|${to ?? ''}|${page}|${limit}`;
}

export function usePosts(
  search: string,
  page: number,
  limit = DEFAULT_LIMIT,
  from: string | null = null,
  to: string | null = null,
) {
  const key = requestKey(search, page, limit, from, to);
  const [state, setState] = useState<PostsState>({
    key: '',
    posts: [],
    meta: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    listPosts({ search, page, limit, from, to }, controller.signal)
      .then((response) => {
        setState({
          key,
          posts: response.data,
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
          posts: [],
          meta: null,
          error: 'Não foi possível carregar as postagens. Tente novamente.',
        });
      });

    return () => controller.abort();
  }, [search, page, limit, from, to, key]);

  const isLoading = state.key !== key;

  return {
    posts: isLoading ? [] : state.posts,
    meta: isLoading ? null : state.meta,
    isLoading,
    error: isLoading ? null : state.error,
  };
}
