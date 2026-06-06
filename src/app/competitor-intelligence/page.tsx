"use client";

import { Swords, Users, Banknote, Newspaper, ArrowUpRight, Boxes } from "lucide-react";
import { PageHeader, Reveal } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkline } from "@/components/viz/sparkline";
import { competitors, type Competitor, type Priority } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

const threatTone: Record<Priority, "rose" | "amber" | "blue" | "default"> = {
  Critical: "rose",
  High: "amber",
  Medium: "blue",
  Low: "default",
};
const threatProgress: Record<Priority, "rose" | "amber" | "blue" | "indigo"> = {
  Critical: "rose",
  High: "amber",
  Medium: "blue",
  Low: "indigo",
};

function CompetitorCard({ c, i }: { c: Competitor; i: number }) {
  return (
    <Reveal i={i}>
      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-purple/20 to-indigo/10 text-sm font-semibold text-purple">
            {c.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-base font-semibold text-foreground">{c.name}</h3>
              <Badge variant={threatTone[c.threat]}>{c.threat} Threat</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">{c.category}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-lg border border-border bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Banknote className="h-3 w-3 text-emerald" /> Funding
            </div>
            <div className="tabular mt-1 text-sm font-semibold text-foreground">{formatCurrency(c.funding)}</div>
          </div>
          <div className="rounded-lg border border-border bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Users className="h-3 w-3 text-blue" /> Employees
            </div>
            <div className="tabular mt-1 text-sm font-semibold text-foreground">{formatNumber(c.employees)}</div>
          </div>
          <div className="rounded-lg border border-border bg-white/[0.02] p-2.5">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-indigo" /> Momentum
            </div>
            <div className="tabular mt-1 text-sm font-semibold text-emerald">+{c.momentum}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-white/[0.02] px-3 py-2">
          <span className="text-[11px] text-muted-foreground">Pricing</span>
          <span className="text-xs text-foreground">{c.pricing}</span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-muted">Threat Level</span>
            <span className="tabular font-semibold text-foreground">{c.threatLevel}/100</span>
          </div>
          <Progress value={c.threatLevel} tone={threatProgress[c.threat]} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Boxes className="h-3.5 w-3.5" /> Product Changes
          </div>
          <Sparkline data={c.spark} tone="purple" width={88} height={28} />
        </div>
        <ul className="mt-2 space-y-1">
          {c.productChanges.map((ch) => (
            <li key={ch} className="flex items-start gap-2 text-[12px] text-foreground/85">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple" />
              {ch}
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Newspaper className="h-3.5 w-3.5" /> Recent News
          </div>
          <div className="space-y-2">
            {c.recentNews.map((n) => (
              <div key={n.title} className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-foreground/85">{n.title}</span>
                <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

export default function CompetitorIntelligence() {
  const critical = competitors.filter((c) => c.threat === "Critical").length;
  const totalFunding = competitors.reduce((s, c) => s + c.funding, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Competitive Landscape"
        title="Competitor Intelligence"
        description="Track funding, headcount, pricing, product velocity, and threat levels across the landscape."
        icon={Swords}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Competitors Tracked", v: `${competitors.length}`, t: "text-purple" },
          { l: "Critical Threats", v: `${critical}`, t: "text-rose" },
          { l: "Combined Funding", v: formatCurrency(totalFunding), t: "text-emerald" },
          { l: "Avg Threat Level", v: `${Math.round(competitors.reduce((s, c) => s + c.threatLevel, 0) / competitors.length)}`, t: "text-amber" },
        ].map((s, i) => (
          <Reveal key={s.l} i={i}>
            <Card className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`tabular mt-1.5 text-2xl font-semibold ${s.t}`}>{s.v}</div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {competitors.map((c, i) => (
          <CompetitorCard key={c.id} c={c} i={i} />
        ))}
      </div>
    </div>
  );
}
