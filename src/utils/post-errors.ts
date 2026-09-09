import { ApiError } from '@/api/http-client';

const POST_ERROR_MESSAGES: Record<string, string> = {
  TITLE_DESCRIPTION_REQUIRED: 'Preencha o título e o conteúdo da aula.',
  TITLE_TOO_LONG: 'O título ficou longo demais. Enxugue um pouco.',
  DESCRIPTION_TOO_LONG: 'O conteúdo ficou longo demais. Enxugue um pouco.',
  POST_NOT_FOUND: 'Esta aula não está disponível.',
  FORBIDDEN: 'Somente administradores publicam aulas.',
  NETWORK_ERROR: 'Não foi possível conectar ao servidor. Confira se a API está em execução.',
};

export function toPostErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return POST_ERROR_MESSAGES[error.code]
      ?? 'Não foi possível concluir. Tente novamente.';
  }

  return 'Algo deu errado. Tente novamente.';
}
