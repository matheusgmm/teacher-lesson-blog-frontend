export type UserRole = 'ADMIN' | 'USER';

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  user: User;
  token: string;
};
