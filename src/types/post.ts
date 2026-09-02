export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export type PostAuthor = {
  id: number;
  name: string;
  email: string;
};

export type Post = {
  id: number;
  title: string;
  description: string;
  status: PostStatus;
  user_id: number;
  author?: PostAuthor;
  created_at: string;
  updated_at: string;
};

export type ListPostsParams = {
  search?: string;
  from?: string | null;
  to?: string | null;
  page?: number;
  limit?: number;
};
