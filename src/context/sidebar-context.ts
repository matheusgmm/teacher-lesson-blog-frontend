import { createContext } from 'react';

export type SidebarContextValue = {
  collapsed: boolean;
  isDesktop: boolean;
  mobileOpen: boolean;
  peeking: boolean;
  shortcut: string;
  setPeeking: (peeking: boolean) => void;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);
