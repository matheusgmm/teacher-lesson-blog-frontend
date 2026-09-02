import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '@/api/auth.api';
import { setUnauthorizedHandler } from '@/api/http-client';
import { AuthContext } from '@/context/auth-context';
import type { LoginPayload, RegisterPayload, User } from '@/types/auth';
import { clearSession, loadSession, saveSession } from '@/utils/auth-storage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadSession()?.user ?? null);
  const [token, setToken] = useState<string | null>(() => loadSession()?.token ?? null);

  const resetSession = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(resetSession);
    return () => setUnauthorizedHandler(null);
  }, [resetSession]);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    const session = {
      user: response.data.user,
      token: response.data.token,
    };

    saveSession(session, payload.rememberMe);
    setUser(session.user);
    setToken(session.token);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // 
    } finally {
      resetSession();
    }
  }, [resetSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
