import { useContext } from 'react';
import { ThemeContext } from '@/context/theme-context';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme needs to be used within a ThemeProvider');
  }

  return context;
}
