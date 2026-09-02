import { useContext } from 'react';
import { SidebarContext } from '@/context/sidebar-context';

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar precisa ser usado dentro de um SidebarProvider');
  }

  return context;
}
