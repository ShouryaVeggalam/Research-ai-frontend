"use client";

import {
  Radar as RadarChartIcon,
  Users,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { segments, customerNeeds, type Segment } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { toneText } from "@/lib/tones";
import { useChartTheme } from "@/lib/use-theme-colors";

function SegmentCard({ s, i }: { s: Segment; i: number }) {
  const churnTone = s.churnRisk > 35 ? "rose" : s.churnRisk > 25 ? "amber" : "emerald";
  return (
    <Reveal i={i}>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
          <Badge variant={s.tone}>{formatNumber(s.size)} accounts</Badge>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Demand Intensity</span>
              <span className="tabular text-foreground">{s.demand}</span>
            </div>
            <Progress value={s.demand} tone={s.tone} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Satisfaction</span>
              <span className="tabular text-foreground">{s.satisfaction}</span>
            </div>
            <Progress value={s.satisfaction} tone="blue" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Churn Risk</span>
              <span className={`tabular ${toneText[churnTone]}`}>{s.churnRisk}%</span>
            </div>
            <Progress value={s.churnRisk} tone={churnTone} />
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

export default function CustomerIntelligence() {
  const ct = useChartTheme();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Demand Signals"
        title="Customer Intelligence"
        description="Segment demand, satisfaction, churn risk, and the needs driving buying decisions."
        icon={Users}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <Card sheen={false} className="p-5">
            <SectionTitle
              hint={<RadarChartIcon className="h-3.5 w-3.5 text-indigo" />}
            >
              Customer Needs
            </SectionTitle>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={customerNeeds} outerRadius="72%">
                <PolarGrid stroke={ct.grid} />
                <PolarAngleAxis
                  dataKey="need"
                  tick={{ fill: ct.muted, fontSize: 10 }}
                />
                <Radar
                  dataKey="intensity"
                  stroke={ct.tones.indigo}
                  strokeWidth={2}
                  fill={ct.tones.indigo}
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
          {segments.map((s, i) => (
            <SegmentCard key={s.id} s={s} i={i} />
          ))}
        </div>
      </div>

      <Reveal>
        <Card className="p-5">
          <SectionTitle>Top Need Drivers</SectionTitle>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {customerNeeds
              .slice()
              .sort((a, b) => b.intensity - a.intensity)
              .map((n) => (
                <div key={n.need}>
                  <div className="mb-1 flex justify-between text-[12px]">
                    <span className="text-foreground/85">{n.need}</span>
                    <span className="tabular text-muted">{n.intensity}</span>
                  </div>
                  <Progress value={n.intensity} tone="indigo" />
                </div>
              ))}
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
