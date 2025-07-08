'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ThemeOption = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeOption>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as ThemeOption) || 'auto';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (!theme) return;

    localStorage.setItem('theme', theme);

    const apply = (isDark: boolean) => {
      document.documentElement.classList.toggle('dark', isDark);
    };

    if (theme === 'dark') apply(true);
    else if (theme === 'light') apply(false);
    else {
    
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      apply(prefersDark.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      prefersDark.addEventListener('change', handler);
      return () => prefersDark.removeEventListener('change', handler);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
