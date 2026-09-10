import type { UserRole } from '@/types/auth';

export type CommentAuthor = {
  id: number;
  name: string;
  role: UserRole;
};

export type Comment = {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  author?: CommentAuthor;
  created_at: string;
  updated_at: string;
};

export type ListCommentsParams = {
  page?: number;
  limit?: number;
};

export type CreateCommentPayload = {
  content: string;
};

export type UpdateCommentPayload = {
  content: string;
};
