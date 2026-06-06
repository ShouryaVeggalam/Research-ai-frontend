"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCommandCenter } from "@/components/command-center";

export function CommandCenterLayer() {
  const { enabled } = useCommandCenter();

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: (i * 37) % 100,
        size: 1.5 + ((i * 7) % 4),
        duration: 9 + ((i * 13) % 10),
        delay: (i * 17) % 9,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          {/* Animated intelligence grid */}
          <div className="cc-grid absolute inset-0 opacity-[0.35]" />

          {/* Soft scanning glow */}
          <motion.div
            className="absolute inset-x-0 h-40 opacity-30"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--glow-soft), transparent)",
            }}
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />

          {/* Drifting particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="cc-particle"
              style={{
                left: `${p.left}%`,
                bottom: "-10px",
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                opacity: 0.5,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
