export const MIN_PASSWORD_LENGTH = 6;

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

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
