"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useLayoutEffect, useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const themeListeners = new Set<() => void>();

let currentTheme: ThemeMode = "dark";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light";
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    currentTheme = theme;
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
  currentTheme = theme;
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    return isThemeMode(storedTheme) ? storedTheme : "dark";
  } catch {
    return "dark";
  }
}

function setStoredTheme(theme: ThemeMode) {
  applyTheme(theme);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures and keep the in-memory theme in sync.
  }

  notifyThemeChange();
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot() {
  return currentTheme;
}

function getServerThemeSnapshot() {
  return "dark" as const;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useLayoutEffect(() => {
    const storedTheme = readStoredTheme();
    if (storedTheme !== currentTheme) {
      setStoredTheme(storedTheme);
      return;
    }

    applyTheme(storedTheme);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !isThemeMode(event.newValue)) {
        return;
      }

      if (event.newValue === currentTheme) {
        applyTheme(event.newValue);
        return;
      }

      applyTheme(event.newValue);
      notifyThemeChange();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setTheme = (nextTheme: ThemeMode) => {
    setStoredTheme(nextTheme);
  };

  const toggleTheme = () => {
    setStoredTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
