export const MIN_PASSWORD_LENGTH = 6;
export const POST_TITLE_MIN = 3;
export const POST_TITLE_MAX = 191;
export const POST_DESCRIPTION_MIN = 20;
export const POST_DESCRIPTION_MAX = 8000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name: string): string | undefined {
  const value = name.trim();

  if (!value) {
    return 'Informe o seu nome.';
  }

  if (value.length < 2) {
    return 'O nome precisa ter pelo menos 2 caracteres.';
  }

  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const value = email.trim();

  if (!value) {
    return 'Informe o seu e-mail.';
  }

  if (!EMAIL_PATTERN.test(value)) {
    return 'Digite um e-mail válido.';
  }

  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Informe a senha.';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return undefined;
}

export function validatePasswordConfirm(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) {
    return 'Confirme a senha.';
  }

  if (password !== confirm) {
    return 'As senhas não coincidem.';
  }

  return undefined;
}

export function validateOptionalPassword(password: string): string | undefined {
  if (!password) {
    return undefined;
  }

  return validatePassword(password);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validatePostTitle(title: string): string | undefined {
  const value = title.trim();

  if (!value) {
    return 'Informe o título da aula.';
  }

  if (value.length < POST_TITLE_MIN) {
    return `O título precisa ter pelo menos ${POST_TITLE_MIN} caracteres.`;
  }

  if (value.length > POST_TITLE_MAX) {
    return `O título pode ter no máximo ${POST_TITLE_MAX} caracteres.`;
  }

  return undefined;
}

export function validatePostDescription(description: string): string | undefined {
  const value = description.trim();

  if (!value) {
    return 'Escreva o conteúdo da aula.';
  }

  if (value.length < POST_DESCRIPTION_MIN) {
    return `O conteúdo precisa ter pelo menos ${POST_DESCRIPTION_MIN} caracteres.`;
  }

  if (value.length > POST_DESCRIPTION_MAX) {
    return `O conteúdo pode ter no máximo ${POST_DESCRIPTION_MAX} caracteres.`;
  }

  return undefined;
}
