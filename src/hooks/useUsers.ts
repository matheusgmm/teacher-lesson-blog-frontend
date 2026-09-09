import { useEffect, useState } from 'react';
import { isAbortError } from '@/api/http-client';
import { listUsers } from '@/api/users.api';
import type { PaginationMeta } from '@/types/api';
import type { User } from '@/types/auth';

const DEFAULT_LIMIT = 10;

type UsersState = {
  key: string;
  users: User[];
  meta: PaginationMeta | null;
  error: string | null;
};

function requestKey(search: string, page: number, limit: number): string {
  return `${search}|${page}|${limit}`;
}

export function useUsers(search: string, page: number, limit = DEFAULT_LIMIT) {
  const key = requestKey(search, page, limit);
  const [state, setState] = useState<UsersState>({
    key: '',
    users: [],
    meta: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    listUsers({ search, page, limit }, controller.signal)
      .then((response) => {
        setState({
          key,
          users: response.data,
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
          users: [],
          meta: null,
          error: 'Não foi possível carregar a comunidade. Tente novamente.',
        });
      });

    return () => controller.abort();
  }, [search, page, limit, key]);

  const isLoading = state.key !== key;

  return {
    users: isLoading ? [] : state.users,
    meta: isLoading ? null : state.meta,
    isLoading,
    error: isLoading ? null : state.error,
  };
}
