"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <Button
      aria-label={isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onClick={() => setTheme(isDarkMode ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      {isDarkMode ? <Sun /> : <Moon />}
      <span className="sr-only">
        {isDarkMode ? "Mudar para tema claro" : "Mudar para tema escuro"}
      </span>
    </Button>
  );
}
