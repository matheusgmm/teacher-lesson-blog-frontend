export type ApiSuccess<T> = {
  status: number;
  message: string;
  data: T;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiPaginated<T> = {
  status: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
};

export type ApiErrorBody = {
  status: number;
  code: string;
  message: string;
  timestamp?: string;
};
