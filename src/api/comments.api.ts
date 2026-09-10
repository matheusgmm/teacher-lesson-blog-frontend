import { http } from '@/api/http-client';
import type { ApiPaginated, ApiSuccess } from '@/types/api';
import type {
  Comment,
  CreateCommentPayload,
  ListCommentsParams,
  UpdateCommentPayload,
} from '@/types/comment';
import { toQueryString } from '@/utils/query-string';

export function listComments(
  postId: number,
  params: ListCommentsParams = {},
  signal?: AbortSignal,
) {
  return http<ApiPaginated<Comment>>(
    `/api/post/${postId}/comments${toQueryString({
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    })}`,
    {
      method: 'GET',
      signal,
    },
  );
}

export function createComment(
  postId: number,
  payload: CreateCommentPayload,
  signal?: AbortSignal,
) {
  return http<ApiSuccess<Comment>>(`/api/post/${postId}/comments`, {
    method: 'POST',
    body: payload,
    signal,
  });
}

export function updateComment(
  postId: number,
  commentId: number,
  payload: UpdateCommentPayload,
  signal?: AbortSignal,
) {
  return http<ApiSuccess<Comment>>(`/api/post/${postId}/comments/${commentId}`, {
    method: 'PATCH',
    body: payload,
    signal,
  });
}

export function deleteComment(postId: number, commentId: number, signal?: AbortSignal) {
  return http<ApiSuccess<null>>(`/api/post/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    signal,
  });
}
