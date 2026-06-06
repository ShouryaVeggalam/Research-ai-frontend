"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/ui/counter";
import { cn } from "@/lib/utils";
import type { KPI } from "@/lib/data";

const toneText: Record<string, string> = {
  indigo: "text-indigo",
  purple: "text-purple",
  blue: "text-blue",
  emerald: "text-emerald",
  amber: "text-amber",
  rose: "text-rose",
};
const toneBg: Record<string, string> = {
  indigo: "from-indigo/20",
  purple: "from-purple/20",
  blue: "from-blue/20",
  emerald: "from-emerald/20",
  amber: "from-amber/20",
  rose: "from-rose/20",
};

export function MetricCard({ kpi }: { kpi: KPI }) {
  const positive = kpi.delta >= 0;
  return (
    <Card className="relative overflow-hidden p-4">
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br to-transparent blur-2xl",
          toneBg[kpi.tone],
        )}
      />
      <div className="relative">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {kpi.label}
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="tabular text-3xl font-semibold tracking-tight text-foreground">
            <Counter
              value={kpi.value}
              decimals={kpi.decimals ?? 0}
              prefix={kpi.prefix ?? ""}
              suffix={kpi.suffix ?? ""}
            />
          </div>
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-emerald" : "text-rose",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(kpi.delta)}%
          </div>
        </div>
        <div className={cn("mt-3 h-0.5 w-full rounded-full bg-gradient-to-r to-transparent", toneBg[kpi.tone])}>
          <div className={cn("h-full w-1/3 rounded-full", toneText[kpi.tone].replace("text-", "bg-"))} />
        </div>
      </div>
    </Card>
  );
}
