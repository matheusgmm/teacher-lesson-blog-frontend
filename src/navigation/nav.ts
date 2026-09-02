import type { UserRole } from '@/types/auth';

export type NavIconName = 'home' | 'posts' | 'write' | 'users';

export type NavItem = {
  to: string;
  label: string;
  description: string;
  icon: NavIconName;
  roles: UserRole[];
  end?: boolean;
};

/**
 * Fonte única das rotas autenticadas.
 * USER: só lê postagens (GET /api/post).
 * ADMIN: CRUD de postagens + gestão da comunidade.
 */
export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Início',
    description: 'Visão geral do portal',
    icon: 'home',
    roles: ['ADMIN'],
    end: true,
  },
  {
    to: '/posts',
    label: 'Postagens',
    description: 'Aulas publicadas pela comunidade',
    icon: 'posts',
    roles: ['USER', 'ADMIN'],
    end: true,
  },
  {
    to: '/posts/new',
    label: 'Nova aula',
    description: 'Publicar uma nova lição',
    icon: 'write',
    roles: ['ADMIN'],
  },
  {
    to: '/users',
    label: 'Comunidade',
    description: 'Docentes e estudantes cadastrados',
    icon: 'users',
    roles: ['ADMIN'],
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function getHomePath(role: UserRole): string {
  return role === 'ADMIN' ? '/' : '/posts';
}

export function getTitleForPath(pathname: string): string {
  const exact = NAV_ITEMS.find((item) => item.to === pathname);

  if (exact) {
    return exact.label;
  }

  const prefix = NAV_ITEMS
    .filter((item) => item.to !== '/' && pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0];

  return prefix?.label ?? 'Portal Acadêmico';
}
