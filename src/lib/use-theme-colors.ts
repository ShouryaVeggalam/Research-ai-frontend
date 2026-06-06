"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { Tone } from "@/lib/data";
import { toneHex as fallbackTones } from "@/lib/tones";

/* Resolve theme colors to real values for SVG / Recharts.
   We read the literal brand CSS variables (not the var()-chained
   tone aliases) so getComputedStyle returns concrete colors. */

const toneVar: Record<Tone, string> = {
  indigo: "--primary",
  purple: "--accent",
  blue: "--secondary",
  emerald: "--success",
  amber: "--warning",
  rose: "--danger",
};

export interface ChartTheme {
  tones: Record<Tone, string>;
  axis: string;
  grid: string;
  tooltipBg: string;
  tooltipBorder: string;
  text: string;
  muted: string;
}

const fallback: ChartTheme = {
  tones: fallbackTones,
  axis: "#6b6b78",
  grid: "rgba(255,255,255,0.05)",
  tooltipBg: "#111118",
  tooltipBorder: "rgba(255,255,255,0.1)",
  text: "#f4f4f6",
  muted: "#8a8a99",
};

function read(cs: CSSStyleDeclaration, name: string, fb: string): string {
  const v = cs.getPropertyValue(name).trim();
  return v || fb;
}

export function useChartTheme(): ChartTheme {
  const { theme, resolvedTheme } = useTheme();
  const [value, setValue] = useState<ChartTheme>(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cs = getComputedStyle(document.documentElement);
    const tones = {} as Record<Tone, string>;
    (Object.keys(toneVar) as Tone[]).forEach((t) => {
      tones[t] = read(cs, toneVar[t], fallbackTones[t]);
    });
    setValue({
      tones,
      axis: read(cs, "--muted-foreground", fallback.axis),
      grid: read(cs, "--border", fallback.grid),
      tooltipBg: read(cs, "--card", fallback.tooltipBg),
      tooltipBorder: read(cs, "--border-strong", fallback.tooltipBorder),
      text: read(cs, "--text-primary", fallback.text),
      muted: read(cs, "--text-secondary", fallback.muted),
    });
  }, [theme, resolvedTheme]);

  return value;
}

/* Convenience: just the tone → color map. */
export function useToneColors(): Record<Tone, string> {
  return useChartTheme().tones;
}
