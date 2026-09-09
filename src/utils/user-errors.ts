import { ApiError } from '@/api/http-client';

const USER_ERROR_MESSAGES: Record<string, string> = {
  NAME_EMAIL_PASSWORD_REQUIRED: 'Preencha nome, e-mail e senha.',
  EMAIL_ALREADY_EXISTS: 'Este e-mail já está cadastrado.',
  USER_NOT_FOUND: 'Esta pessoa não está disponível.',
  INVALID_ROLE: 'Escolha um perfil válido.',
  CURRENT_PASSWORD_REQUIRED: 'Informe a senha atual.',
  CURRENT_PASSWORD_INVALID: 'A senha atual não confere.',
  FORBIDDEN: 'Esta ação não é permitida.',
  NETWORK_ERROR: 'Não foi possível conectar ao servidor. Confira se a API está em execução.',
};

export function toUserErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.message === 'Cannot delete the last administrator') {
      return 'Não é possível remover o último administrador da comunidade.';
    }

    if (error.message === 'You are not allowed to delete yourself') {
      return 'Você não pode remover a própria conta por aqui.';
    }

    return USER_ERROR_MESSAGES[error.code]
      ?? 'Não foi possível concluir. Tente novamente.';
  }

  return 'Algo deu errado. Tente novamente.';
}
