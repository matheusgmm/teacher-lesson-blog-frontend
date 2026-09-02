export type ApiSuccess<T> = {
  status: number;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  status: number;
  code: string;
  message: string;
  timestamp?: string;
};
