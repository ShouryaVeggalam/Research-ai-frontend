"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { CommandCenterLayer } from "@/components/command-center-layer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="relative min-h-screen app-aurora">
      <CommandCenterLayer />
      <Sidebar />
      <div className="relative z-10 lg:pl-64">
        <TopBar />
        <main className="bg-grid">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
