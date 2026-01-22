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

// Define both light and dark variants for each accent color
const accentColors: Record<AccentColor, { 
  light: { primary: string; primaryForeground: string }; 
  dark: { primary: string; primaryForeground: string };
}> = {
  gold: { 
    light: { primary: '36 45% 45%', primaryForeground: '40 30% 98%' },
    dark: { primary: '36 50% 55%', primaryForeground: '30 10% 10%' }
  },
  blue: { 
    light: { primary: '220 70% 50%', primaryForeground: '0 0% 100%' },
    dark: { primary: '220 70% 60%', primaryForeground: '220 70% 10%' }
  },
  green: { 
    light: { primary: '150 60% 40%', primaryForeground: '0 0% 100%' },
    dark: { primary: '150 60% 50%', primaryForeground: '150 60% 10%' }
  },
  purple: { 
    light: { primary: '270 60% 50%', primaryForeground: '0 0% 100%' },
    dark: { primary: '270 60% 60%', primaryForeground: '270 60% 10%' }
  },
  rose: { 
    light: { primary: '350 65% 55%', primaryForeground: '0 0% 100%' },
    dark: { primary: '350 65% 65%', primaryForeground: '350 65% 10%' }
  },
  orange: { 
    light: { primary: '25 90% 50%', primaryForeground: '0 0% 100%' },
    dark: { primary: '25 90% 60%', primaryForeground: '25 90% 10%' }
  },
};

function applyAccentColor(accentColor: AccentColor, isDark: boolean) {
  const root = document.documentElement;
  const colors = accentColors[accentColor];
  const colorSet = isDark ? colors.dark : colors.light;

  // Update all primary-related CSS variables
  root.style.setProperty('--primary', colorSet.primary);
  root.style.setProperty('--primary-foreground', colorSet.primaryForeground);
  root.style.setProperty('--accent', colorSet.primary);
  root.style.setProperty('--accent-foreground', colorSet.primaryForeground);
  root.style.setProperty('--ring', colorSet.primary);
  root.style.setProperty('--sidebar-primary', colorSet.primary);
  root.style.setProperty('--sidebar-primary-foreground', colorSet.primaryForeground);
  root.style.setProperty('--sidebar-ring', colorSet.primary);
}

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

  // Apply theme and accent color
  useEffect(() => {
    const root = document.documentElement;
    
    // Determine effective theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    const isDark = effectiveTheme === 'dark';
    
    // Apply theme class
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Apply accent color with correct theme variant
    applyAccentColor(accentColor, isDark);

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
        const isDark = mediaQuery.matches;
        root.classList.remove('light', 'dark');
        root.classList.add(isDark ? 'dark' : 'light');
        applyAccentColor(accentColor, isDark);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, accentColor]);

  // Apply accent color on initial mount
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    applyAccentColor(accentColor, effectiveTheme === 'dark');
  }, []);

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
