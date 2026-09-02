import type { ApiErrorBody } from '@/types/api';
import { getStoredToken } from '@/utils/auth-storage';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
};

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

function getBaseUrl(): string {
  return (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
}

function joinUrl(path: string): string {
  const base = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function toApiError(status: number, body: unknown): ApiError {
  const errorBody = body as ApiErrorBody | null;
  return new ApiError(
    errorBody?.status ?? status,
    errorBody?.code ?? 'REQUEST_FAILED',
    errorBody?.message ?? 'Não foi possível concluir a requisição.',
  );
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  const token = auth ? getStoredToken() : null;

  if (body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(joinUrl(path), {
      ...rest,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new ApiError(0, 'NETWORK_ERROR', 'Não foi possível conectar ao servidor.');
  }

  const parsed = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && token && path !== '/api/auth/login') {
      onUnauthorized?.();
    }

    throw toApiError(response.status, parsed);
  }

  return parsed as T;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
