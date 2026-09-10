import { ApiError } from '@/api/http-client';

const COMMENT_ERROR_MESSAGES: Record<string, string> = {
  CONTENT_REQUIRED: 'Escreva o comentário.',
  CONTENT_TOO_SHORT: 'O comentário precisa ter pelo menos 3 caracteres.',
  CONTENT_TOO_LONG: 'O comentário ficou longo demais. Enxugue um pouco.',
  POST_NOT_FOUND: 'Esta aula não está disponível.',
  COMMENT_NOT_FOUND: 'Este comentário não está mais disponível.',
  COMMENT_ID_REQUIRED: 'Este comentário não está mais disponível.',
  FORBIDDEN: 'Você não pode alterar este comentário.',
  NETWORK_ERROR: 'Não foi possível conectar ao servidor. Confira se a API está em execução.',
};

export function toCommentErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.message === 'You are not allowed to update this comment') {
      return 'Somente quem escreveu pode editar o comentário.';
    }

    if (error.message === 'You are not allowed to delete this comment') {
      return 'Você não pode remover este comentário.';
    }

    return COMMENT_ERROR_MESSAGES[error.code]
      ?? 'Não foi possível concluir. Tente novamente.';
  }

  return 'Algo deu errado. Tente novamente.';
}
