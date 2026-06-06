"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Radar, ChevronRight } from "lucide-react";
import { navItems, navGroups } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-indigo/30 bg-gradient-to-br from-indigo/30 to-purple/20">
          <Radar className="h-5 w-5 text-indigo" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald live-dot" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight text-foreground">
            Celestra
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Research AI
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group}>
            <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {group}
            </div>
            <div className="space-y-0.5">
              {navItems
                .filter((i) => i.group === group)
                .map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted hover:bg-white/[0.04] hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-xl border border-indigo/25 bg-gradient-to-r from-indigo/15 to-transparent"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          "relative h-[18px] w-[18px] shrink-0",
                          active ? "text-indigo" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="relative flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="relative rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] tabular text-muted">
                          {item.badge}
                        </span>
                      ) : active ? (
                        <ChevronRight className="relative h-3.5 w-3.5 text-indigo" />
                      ) : null}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* System status */}
      <div className="mx-3 mb-4 rounded-xl border border-border bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium text-foreground">
            Network Status
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Online
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { l: "Signal Ingestion", v: 98 },
            { l: "Model Pipeline", v: 94 },
          ].map((s) => (
            <div key={s.l}>
              <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                <span>{s.l}</span>
                <span className="tabular">{s.v}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald to-blue"
                  style={{ width: `${s.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar-glow fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-panel/80 backdrop-blur-xl lg:block">
      <SidebarContent />
    </aside>
  );
}
