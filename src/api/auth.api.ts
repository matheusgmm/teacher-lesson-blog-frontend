import { http } from '@/api/http-client';
import type { ApiSuccess } from '@/types/api';
import type { LoginPayload, RegisterPayload, User } from '@/types/auth';

type LoginResponse = ApiSuccess<{
  user: User;
  token: string;
}>;

type RegisterResponse = ApiSuccess<User>;

type LogoutResponse = {
  status: number;
  message: string;
};

export function login(payload: LoginPayload) {
  return http<LoginResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: {
      email: payload.email,
      password: payload.password,
      rememberMe: payload.rememberMe,
    },
  });
}

export function register(payload: RegisterPayload) {
  return http<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });
}

export function logout() {
  return http<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
  });
}
