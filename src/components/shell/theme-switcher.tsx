"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Palette, Sparkles, Zap } from "lucide-react";
import { themes, defaultThemeId } from "@/lib/themes";
import { useCommandCenter } from "@/components/command-center";
import { cn } from "@/lib/utils";

function Swatch({
  primary,
  secondary,
  accent,
  bg,
  className,
}: {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-white/10",
        className,
      )}
      style={{ background: bg }}
    >
      <span className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${primary}, transparent 70%)` }} />
      <span className="absolute bottom-0 left-0 h-1/2 w-full" style={{ background: `linear-gradient(90deg, ${secondary}, ${accent})`, opacity: 0.85 }} />
    </span>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { enabled: ccEnabled, toggle: toggleCC } = useCommandCenter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const activeId = mounted ? theme ?? defaultThemeId : defaultThemeId;
  const active = themes.find((t) => t.id === activeId) ?? themes[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        className="flex h-9 items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-2.5 text-muted transition-colors hover:border-border-strong hover:text-foreground"
      >
        <Swatch {...active.swatch} className="h-5 w-5" />
        <span className="hidden text-xs font-medium text-foreground sm:block">{active.name}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }}
            className="glass absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border-strong shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Palette className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Intelligence Themes</span>
              <span className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-muted">
                {themes.length}
              </span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {themes.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      isActive ? "bg-primary/10" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <Swatch {...t.swatch} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{t.name}</span>
                        {isActive && (
                          <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                            Active
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {t.description}
                      </span>
                    </span>
                    {isActive ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-full border border-border group-hover:border-border-strong" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Command Center Mode toggle */}
            <button
              onClick={toggleCC}
              className="flex w-full items-center gap-3 border-t border-border px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                {ccEnabled ? <Zap className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">Command Center Mode</span>
                <span className="block text-[11px] text-muted-foreground">Animated grid + intelligence particles</span>
              </span>
              <span
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
                  ccEnabled ? "border-primary/50 bg-primary/30" : "border-border bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    ccEnabled ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
