"use client";

import { TrendingUp, Gauge, Zap, BadgeCheck, Activity } from "lucide-react";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkline } from "@/components/viz/sparkline";
import { AreaTrend } from "@/components/viz/area-trend";
import { trends, type Trend } from "@/lib/data";
import { toneText } from "@/lib/tones";

const stageTone: Record<Trend["stage"], "emerald" | "indigo" | "amber" | "blue"> = {
  Emerging: "blue",
  Accelerating: "emerald",
  Peaking: "amber",
  Maturing: "indigo",
};

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: Trend["tone"];
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 text-muted">
          <Icon className={`h-3 w-3 ${toneText[tone]}`} /> {label}
        </span>
        <span className="tabular font-semibold text-foreground">{value}</span>
      </div>
      <Progress value={value} tone={tone} />
    </div>
  );
}

function TrendCard({ t, i }: { t: Trend; i: number }) {
  return (
    <Reveal i={i}>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={stageTone[t.stage]}>{t.stage}</Badge>
              <span className="text-[11px] text-muted-foreground">{t.category}</span>
            </div>
            <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
          </div>
          <div className="text-right">
            <div className={`tabular text-2xl font-semibold ${toneText[t.tone]}`}>+{t.growth}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">growth</div>
          </div>
        </div>

        <div className="mt-4">
          <Sparkline data={t.forecast} tone={t.tone} width={400} height={56} />
        </div>

        <div className="mt-4 space-y-3">
          <Metric icon={Activity} label="Momentum" value={t.momentum} tone={t.tone} />
          <Metric icon={Zap} label="Velocity" value={t.velocity} tone={t.tone} />
          <Metric icon={BadgeCheck} label="Confidence" value={t.confidence} tone={t.tone} />
        </div>
      </Card>
    </Reveal>
  );
}

export default function TrendIntelligence() {
  const months = ["Q1'25", "Q2'25", "Q3'25", "Q4'25", "Q1'26", "Q2'26", "Q3'26", "Q4'26", "Q1'27"];
  const forecastData = months.map((m, idx) => ({
    month: m,
    agents: trends[0].forecast[idx],
    eval: trends[2].forecast[idx],
    compliance: trends[4].forecast[idx],
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Signal Mesh"
        title="Trend Intelligence"
        description="Track momentum, velocity, confidence, and forward forecasts across emerging strategic trends."
        icon={TrendingUp}
      />

      {/* Forecast timeline */}
      <Reveal>
        <Card sheen={false} className="p-5">
          <SectionTitle
            hint={
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Gauge className="h-3.5 w-3.5 text-indigo" /> Projected through Q1 2027
              </span>
            }
          >
            Trend Forecast Timeline
          </SectionTitle>
          <AreaTrend
            data={forecastData}
            xKey="month"
            height={280}
            series={[
              { key: "agents", tone: "indigo", label: "Autonomous Agents" },
              { key: "eval", tone: "emerald", label: "AI Evaluation" },
              { key: "compliance", tone: "amber", label: "AI Compliance" },
            ]}
          />
          <div className="mt-3 flex flex-wrap gap-4">
            {[
              { l: "Autonomous Agents", t: "bg-indigo" },
              { l: "AI Evaluation", t: "bg-emerald" },
              { l: "AI Compliance", t: "bg-amber" },
            ].map((s) => (
              <span key={s.l} className="flex items-center gap-1.5 text-[11px] text-muted">
                <span className={`h-2 w-2 rounded-full ${s.t}`} /> {s.l}
              </span>
            ))}
          </div>
        </Card>
      </Reveal>

      <div>
        <SectionTitle>Trend Signals</SectionTitle>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {trends.map((t, i) => (
            <TrendCard key={t.id} t={t} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
