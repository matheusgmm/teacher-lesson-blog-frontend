import { http } from '@/api/http-client';
import type { ApiPaginated, ApiSuccess } from '@/types/api';
import type { CreatePostPayload, ListPostsParams, Post, UpdatePostPayload } from '@/types/post';
import { toQueryString } from '@/utils/query-string';

export function listPosts(params: ListPostsParams = {}, signal?: AbortSignal) {
  return http<ApiPaginated<Post>>(
    `/api/post${toQueryString({
      search: params.search,
      from: params.from,
      to: params.to,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    })}`,
    {
      method: 'GET',
      signal,
    },
  );
}

export function getPost(id: number, signal?: AbortSignal) {
  return http<ApiSuccess<Post>>(`/api/post/${id}`, {
    method: 'GET',
    signal,
  });
}

export function createPost(payload: CreatePostPayload, signal?: AbortSignal) {
  return http<ApiSuccess<Post>>('/api/post', {
    method: 'POST',
    body: payload,
    signal,
  });
}

export function updatePost(id: number, payload: UpdatePostPayload, signal?: AbortSignal) {
  return http<ApiSuccess<Post>>(`/api/post/${id}`, {
    method: 'PATCH',
    body: payload,
    signal,
  });
}

export function deletePost(id: number, signal?: AbortSignal) {
  return http<ApiSuccess<null>>(`/api/post/${id}`, {
    method: 'DELETE',
    signal,
  });
}
