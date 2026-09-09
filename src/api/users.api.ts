import { http } from '@/api/http-client';
import type { ApiPaginated, ApiSuccess } from '@/types/api';
import type { CreateUserPayload, ListUsersParams, UpdateUserPayload, User } from '@/types/auth';
import { toQueryString } from '@/utils/query-string';

export function listUsers(params: ListUsersParams = {}, signal?: AbortSignal) {
  return http<ApiPaginated<User>>(
    `/api/user${toQueryString({
      search: params.search,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    })}`,
    {
      method: 'GET',
      signal,
    },
  );
}

export function getUser(id: number, signal?: AbortSignal) {
  return http<ApiSuccess<User>>(`/api/user/${id}`, {
    method: 'GET',
    signal,
  });
}

export function createUser(payload: CreateUserPayload, signal?: AbortSignal) {
  return http<ApiSuccess<User>>('/api/user', {
    method: 'POST',
    body: payload,
    signal,
  });
}

export function updateMe(payload: UpdateUserPayload, signal?: AbortSignal) {
  return http<ApiSuccess<User>>('/api/user', {
    method: 'PATCH',
    body: payload,
    signal,
  });
}

export function updateUser(id: number, payload: UpdateUserPayload, signal?: AbortSignal) {
  return http<ApiSuccess<User>>(`/api/user/${id}`, {
    method: 'PATCH',
    body: payload,
    signal,
  });
}

export function deleteUser(id: number, signal?: AbortSignal) {
  return http<ApiSuccess<null>>(`/api/user/${id}`, {
    method: 'DELETE',
    signal,
  });
}
