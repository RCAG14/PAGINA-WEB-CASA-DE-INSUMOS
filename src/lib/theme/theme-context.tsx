"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { THEME_COOKIE } from "@/lib/theme/constants";
import type { Theme } from "@/lib/theme/theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  function setTheme(next: Theme) {
    setThemeState(next);
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000`;
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>.");
  return ctx;
}
