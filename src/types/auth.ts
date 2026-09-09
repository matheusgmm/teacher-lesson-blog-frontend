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

export type ListUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  role?: UserRole;
};
