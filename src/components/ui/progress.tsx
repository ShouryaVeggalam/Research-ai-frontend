"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  indigo: "from-indigo to-blue",
  purple: "from-purple to-indigo",
  blue: "from-blue to-indigo",
  emerald: "from-emerald to-blue",
  amber: "from-amber to-rose",
  rose: "from-rose to-amber",
};

export function Progress({
  value,
  tone = "indigo",
  className,
  trackClassName,
}: {
  value: number;
  tone?: keyof typeof toneMap;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]",
        trackClassName,
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }}
        className={cn(
          "h-full rounded-full bg-gradient-to-r",
          toneMap[tone],
          className,
        )}
      />
    </div>
  );
}
