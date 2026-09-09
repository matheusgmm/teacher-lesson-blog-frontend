export function resolvePostsBackPath(from: unknown): string {
  if (typeof from !== 'string' || !from.startsWith('/posts')) {
    return '/posts';
  }

  if (from === '/posts/new' || from.startsWith('/posts/new?')) {
    return '/posts';
  }

  return from;
}
