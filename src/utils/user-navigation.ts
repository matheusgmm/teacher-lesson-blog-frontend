export function resolveUsersBackPath(from: unknown): string {
  if (typeof from !== 'string' || !from.startsWith('/users')) {
    return '/users';
  }

  if (from === '/users/new' || from.startsWith('/users/new?')) {
    return '/users';
  }

  return from;
}
