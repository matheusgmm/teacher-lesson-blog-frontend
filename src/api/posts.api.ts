import { http } from '@/api/http-client';
import type { ApiPaginated } from '@/types/api';
import type { ListPostsParams, Post } from '@/types/post';
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
