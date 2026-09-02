import type { AuthSession, User } from '@/types/auth';

const TOKEN_KEY = 'academic-portal-token';
const USER_KEY = 'academic-portal-user';
const PERSIST_KEY = 'academic-portal-persist';

function getStore(persist: boolean): Storage {
  return persist ? window.localStorage : window.sessionStorage;
}

function readUser(raw: string | null): User | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function loadSession(): AuthSession | null {
  const persist = window.localStorage.getItem(PERSIST_KEY) === '1';
  const store = persist ? window.localStorage : window.sessionStorage;
  const token = store.getItem(TOKEN_KEY);
  const user = readUser(store.getItem(USER_KEY));

  if (!token || !user) {
    return null;
  }

  return { token, user };
}

export function saveSession(session: AuthSession, persist: boolean) {
  clearSession();
  window.localStorage.setItem(PERSIST_KEY, persist ? '1' : '0');
  const store = getStore(persist);
  store.setItem(TOKEN_KEY, session.token);
  store.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(PERSIST_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export function getStoredToken(): string | null {
  return loadSession()?.token ?? null;
}
