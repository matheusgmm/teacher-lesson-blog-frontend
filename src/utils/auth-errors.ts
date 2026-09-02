import { ApiError } from '@/api/http-client';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos.',
  EMAIL_ALREADY_EXISTS: 'Este e-mail já está cadastrado. Tente entrar.',
  NAME_EMAIL_PASSWORD_REQUIRED: 'Preencha nome, e-mail e senha.',
  NETWORK_ERROR: 'Não foi possível conectar ao servidor. Confira se a API está em execução.',
  FORBIDDEN: 'Você não tem permissão para criar esta conta.',
};

export function toAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return AUTH_ERROR_MESSAGES[error.code]
      ?? 'Não foi possível concluir. Tente novamente.';
  }

  return 'Algo deu errado. Tente novamente.';
}
