import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'gold' | 'blue' | 'green' | 'purple' | 'rose' | 'orange';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const accentColors: Record<AccentColor, { light: string; dark: string }> = {
  gold: { light: '36 45% 45%', dark: '36 50% 55%' },
  blue: { light: '220 70% 50%', dark: '220 70% 60%' },
  green: { light: '150 60% 40%', dark: '150 60% 50%' },
  purple: { light: '270 60% 50%', dark: '270 60% 60%' },
  rose: { light: '350 65% 55%', dark: '350 65% 65%' },
  orange: { light: '25 90% 50%', dark: '25 90% 60%' },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const stored = localStorage.getItem('accentColor') as AccentColor;
    return stored || 'gold';
  });

  const [compactMode, setCompactModeState] = useState(() => {
    const stored = localStorage.getItem('compactMode');
    return stored === 'true';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem('accentColor', color);
  };

  const setCompactMode = (compact: boolean) => {
    setCompactModeState(compact);
    localStorage.setItem('compactMode', String(compact));
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Handle theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Handle accent color
    const colors = accentColors[accentColor];
    const colorValue = effectiveTheme === 'dark' ? colors.dark : colors.light;
    root.style.setProperty('--primary', colorValue);
    root.style.setProperty('--accent', colorValue);
    root.style.setProperty('--ring', colorValue);
    root.style.setProperty('--sidebar-primary', colorValue);
    root.style.setProperty('--sidebar-ring', colorValue);

    // Handle compact mode
    if (compactMode) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }
  }, [theme, accentColor, compactMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      accentColor, 
      setAccentColor,
      compactMode,
      setCompactMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const ACCENT_COLORS: { value: AccentColor; label: string; preview: string }[] = [
  { value: 'gold', label: 'Gold', preview: 'bg-amber-600' },
  { value: 'blue', label: 'Blue', preview: 'bg-blue-600' },
  { value: 'green', label: 'Green', preview: 'bg-emerald-600' },
  { value: 'purple', label: 'Purple', preview: 'bg-purple-600' },
  { value: 'rose', label: 'Rose', preview: 'bg-rose-500' },
  { value: 'orange', label: 'Orange', preview: 'bg-orange-500' },
];
