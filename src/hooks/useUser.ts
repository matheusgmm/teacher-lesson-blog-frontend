import { useEffect, useState } from 'react';
import { ApiError, isAbortError } from '@/api/http-client';
import { getUser } from '@/api/users.api';
import type { User } from '@/types/auth';

type UserState = {
  key: string;
  user: User | null;
  error: string | null;
  notFound: boolean;
};

export function useUser(id: number | null) {
  const key = id ? String(id) : '';
  const [state, setState] = useState<UserState>({
    key: '',
    user: null,
    error: null,
    notFound: false,
  });

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const controller = new AbortController();

    getUser(id, controller.signal)
      .then((response) => {
        if (!response.data) {
          setState({
            key,
            user: null,
            error: null,
            notFound: true,
          });
          return;
        }

        setState({
          key,
          user: response.data,
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
          user: null,
          error: notFound ? null : 'Não foi possível carregar esta pessoa. Tente novamente.',
          notFound,
        });
      });

    return () => controller.abort();
  }, [id, key]);

  if (!id) {
    return {
      user: null,
      isLoading: false,
      error: null,
      notFound: true,
    };
  }

  const isLoading = state.key !== key;

  return {
    user: isLoading ? null : state.user,
    isLoading,
    error: isLoading ? null : state.error,
    notFound: isLoading ? false : state.notFound,
  };
}
