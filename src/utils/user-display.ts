import type { User, UserRole } from '@/types/auth';

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRoleLabel(role: UserRole): string {
  return role === 'ADMIN' ? 'Administrador' : 'Membro';
}

export function getShortcutLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Ctrl+B';
  }

  const platform = navigator.userAgent.toLowerCase();
  return /mac|iphone|ipad/.test(platform) ? '⌘B' : 'Ctrl+B';
}

export function getFirstName(user: User | null): string {
  return user?.name.trim().split(/\s+/)[0] ?? 'visitante';
}
