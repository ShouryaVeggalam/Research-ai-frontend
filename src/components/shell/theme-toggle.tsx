"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme !== "light-executive";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light-executive" : "dark-command")}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-muted transition-colors hover:border-border-strong hover:text-foreground"
    >
      {mounted && isDark ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
