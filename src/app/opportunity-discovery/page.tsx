"use client";

import { Sparkles, TrendingUp, Target, DollarSign, Swords, ArrowUpRight } from "lucide-react";
import { PageHeader, Reveal } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { opportunities, type Opportunity, type Priority } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const priorityTone: Record<Priority, "rose" | "amber" | "blue" | "default"> = {
  Critical: "rose",
  High: "amber",
  Medium: "blue",
  Low: "default",
};

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-3 w-3 ${tone}`} />
        {label}
      </div>
      <div className="tabular mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

function OpportunityCard({ o, i }: { o: Opportunity; i: number }) {
  return (
    <Reveal i={i}>
      <Card className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo/15 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-white/[0.04] text-[11px] font-semibold text-muted">
                #{o.rank}
              </span>
              <Badge variant={priorityTone[o.priority]}>{o.priority}</Badge>
              <span className="text-[11px] text-muted-foreground">{o.category}</span>
            </div>
            <h3 className="text-lg font-semibold leading-tight text-foreground">{o.title}</h3>
          </div>
          <ScoreRing value={o.opportunityScore} size={96} stroke={7} tone="indigo" label="Score" />
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <Stat icon={DollarSign} label="Market Size" value={formatCurrency(o.marketSize)} tone="text-emerald" />
          <Stat icon={TrendingUp} label="Growth" value={`${o.growthRate}%`} tone="text-blue" />
          <Stat icon={Swords} label="Competition" value={`${o.competitionScore}/100`} tone="text-amber" />
          <Stat icon={Target} label="Revenue Pot." value={formatCurrency(o.revenuePotential)} tone="text-purple" />
        </div>

        <div className="relative mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>Market Attractiveness</span>
            <span className="tabular">{o.opportunityScore}%</span>
          </div>
          <Progress value={o.opportunityScore} tone="indigo" />
        </div>

        <div className="relative mt-4 rounded-xl border border-indigo/20 bg-indigo/[0.06] p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-indigo">
            <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">{o.recommendation}</p>
        </div>

        <div className="relative mt-4 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Confidence-weighted opportunity</span>
          <Button variant="secondary" size="sm">
            Build Strategy <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </Reveal>
  );
}

export default function OpportunityCenter() {
  const totalRevenue = opportunities.reduce((s, o) => s + o.revenuePotential, 0);
  const avgScore = Math.round(
    opportunities.reduce((s, o) => s + o.opportunityScore, 0) / opportunities.length,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Opportunity Center"
        title="Opportunity Discovery"
        description="AI-ranked strategic openings — scored by market size, competition, growth, and revenue potential."
        icon={Sparkles}
        actions={
          <Button size="sm">
            <Sparkles className="h-4 w-4" /> Discover New
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Opportunities", v: `${opportunities.length}`, t: "text-indigo" },
          { l: "Avg Score", v: `${avgScore}`, t: "text-emerald" },
          { l: "Total Revenue Potential", v: formatCurrency(totalRevenue), t: "text-purple" },
          { l: "Critical Priority", v: `${opportunities.filter((o) => o.priority === "Critical").length}`, t: "text-rose" },
        ].map((s, i) => (
          <Reveal key={s.l} i={i}>
            <Card className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`tabular mt-1.5 text-2xl font-semibold ${s.t}`}>{s.v}</div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {opportunities.map((o, i) => (
          <OpportunityCard key={o.id} o={o} i={i} />
        ))}
      </div>
    </div>
  );
}
