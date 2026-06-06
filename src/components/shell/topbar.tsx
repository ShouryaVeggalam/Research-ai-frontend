"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Bell,
  Menu,
  X,
  Command,
  ArrowUpRight,
} from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { SidebarContent } from "./sidebar";

export function TopBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Global search */}
          <div className="relative hidden flex-1 items-center sm:flex md:max-w-md">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search markets, competitors, signals…"
              className="h-10 w-full rounded-xl border border-border bg-white/[0.03] pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo/40 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <kbd className="absolute right-3 hidden items-center gap-1 rounded-md border border-border bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted-foreground md:flex">
              <Command className="h-3 w-3" /> K
            </kbd>
          </div>

          {/* Research query input (center, prominent) */}
          <div className="relative hidden flex-1 items-center lg:flex">
            <div className="group relative flex w-full items-center">
              <Sparkles className="pointer-events-none absolute left-3 h-4 w-4 text-indigo" />
              <input
                placeholder="Ask Research AI anything…"
                className="h-10 w-full rounded-xl border border-indigo/25 bg-gradient-to-r from-indigo/[0.07] to-purple/[0.04] pl-9 pr-10 text-sm text-foreground placeholder:text-muted focus:border-indigo/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo/90 text-white transition-transform hover:scale-105">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-muted transition-colors hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose ring-2 ring-background" />
            </button>
            <ThemeSwitcher />
            <button className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] py-1 pl-1 pr-3 transition-colors hover:border-border-strong">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo to-purple text-[11px] font-semibold text-white">
                AV
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs font-medium text-foreground">
                  A. Vega
                </span>
                <span className="block text-[10px] text-muted-foreground">
                  Chief Strategy
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-panel lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
