import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SidebarContext } from '@/context/sidebar-context';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SIDEBAR_STORAGE_KEY } from '@/theme/theme';
import { getShortcutLabel } from '@/utils/user-display';

function readCollapsed(): boolean {
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1';
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const shortcut = useMemo(() => getShortcutLabel(), []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setPeeking(false);
    setCollapsed((current) => !current);
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable;

      if (event.key === 'Escape') {
        setPeeking(false);
        setMobileOpen(false);
        return;
      }

      if (typing) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        if (isDesktop) {
          toggleCollapsed();
        } else {
          setMobileOpen((open) => !open);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDesktop, toggleCollapsed]);

  const value = useMemo(
    () => ({
      collapsed: isDesktop ? collapsed : false,
      isDesktop,
      mobileOpen,
      peeking: isDesktop && collapsed && peeking,
      shortcut,
      setPeeking,
      toggleCollapsed,
      openMobile,
      closeMobile,
    }),
    [
      collapsed,
      isDesktop,
      mobileOpen,
      peeking,
      shortcut,
      setPeeking,
      toggleCollapsed,
      openMobile,
      closeMobile,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
