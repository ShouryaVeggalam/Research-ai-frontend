import type { Tone } from "@/lib/data";

/* Static class maps so Tailwind's JIT can see every utility at build time.
   Never construct color utilities with template literals. */

export const toneText: Record<Tone, string> = {
  indigo: "text-indigo",
  purple: "text-purple",
  blue: "text-blue",
  emerald: "text-emerald",
  amber: "text-amber",
  rose: "text-rose",
};

export const toneBgSoft: Record<Tone, string> = {
  indigo: "bg-indigo/10",
  purple: "bg-purple/10",
  blue: "bg-blue/10",
  emerald: "bg-emerald/10",
  amber: "bg-amber/10",
  rose: "bg-rose/10",
};

export const toneBgSolid: Record<Tone, string> = {
  indigo: "bg-indigo",
  purple: "bg-purple",
  blue: "bg-blue",
  emerald: "bg-emerald",
  amber: "bg-amber",
  rose: "bg-rose",
};

export const toneBorder: Record<Tone, string> = {
  indigo: "border-indigo/30",
  purple: "border-purple/30",
  blue: "border-blue/30",
  emerald: "border-emerald/30",
  amber: "border-amber/30",
  rose: "border-rose/30",
};

export const toneIconWrap: Record<Tone, string> = {
  indigo: "border-indigo/30 bg-indigo/10 text-indigo",
  purple: "border-purple/30 bg-purple/10 text-purple",
  blue: "border-blue/30 bg-blue/10 text-blue",
  emerald: "border-emerald/30 bg-emerald/10 text-emerald",
  amber: "border-amber/30 bg-amber/10 text-amber",
  rose: "border-rose/30 bg-rose/10 text-rose",
};

export const toneGradient: Record<Tone, string> = {
  indigo: "from-indigo/25 to-purple/10",
  purple: "from-purple/25 to-indigo/10",
  blue: "from-blue/25 to-indigo/10",
  emerald: "from-emerald/25 to-blue/10",
  amber: "from-amber/25 to-rose/10",
  rose: "from-rose/25 to-amber/10",
};

export const toneHex: Record<Tone, string> = {
  indigo: "#6366f1",
  purple: "#a855f7",
  blue: "#3b82f6",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
};
