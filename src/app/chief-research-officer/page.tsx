"use client";

import { Crown, Sparkles, CheckCircle2, TrendingUp, ShieldAlert, Target, FileText } from "lucide-react";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { AreaTrend } from "@/components/viz/area-trend";
import {
  executive as mockExecutive,
  opportunities as mockOpportunities,
  risks as mockRisks,
  type Tone,
} from "@/lib/data";
import { fetchCROSummary, fetchOpportunities, fetchRisks } from "@/lib/api";
import { useBackendData } from "@/lib/use-backend-data";
import { toneText } from "@/lib/tones";

function ExecGauge({ label, value, tone, invert }: { label: string; value: number; tone: Tone; invert?: boolean }) {
  return (
    <Card className="flex flex-col items-center p-5">
      <ScoreRing value={value} tone={tone} size={108} stroke={8} />
      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className={`text-[11px] ${invert ? "text-emerald" : toneText[tone]}`}>
          {invert ? "Lower is better" : value >= 80 ? "Strong" : value >= 60 ? "Healthy" : "Watch"}
        </div>
      </div>
    </Card>
  );
}

export default function ChiefResearchOfficer() {
  const executive = useBackendData(fetchCROSummary, mockExecutive, () => false);
  const opportunities = useBackendData(fetchOpportunities, mockOpportunities);
  const risks = useBackendData(fetchRisks, mockRisks);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="The Crown Jewel"
        title="Chief Research Officer"
        description="Executive command dashboard — the synthesized strategic state of the business."
        icon={Crown}
        actions={
          <Badge variant="amber">
            <Crown className="h-3 w-3" /> Executive View
          </Badge>
        }
      />

      {/* Executive summary banner */}
      <Reveal>
        <Card className="relative overflow-hidden border-indigo/20 p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-purple/10 blur-[100px]" />
          <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex flex-col items-center">
              <ScoreRing value={executive.researchHealth} tone="indigo" size={150} stroke={10} suffix="" label="Health" />
              <Badge variant="indigo" className="mt-3">Research Health Score</Badge>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-indigo">
                <Sparkles className="h-3.5 w-3.5" /> Executive Summary
              </div>
              <p className="text-[15px] leading-relaxed text-foreground/90">{executive.summary}</p>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* Gauges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { l: "Opportunity Score", v: executive.opportunityScore, t: "emerald" as Tone },
          { l: "Strategic Confidence", v: executive.strategicConfidence, t: "indigo" as Tone },
          { l: "Market Position", v: executive.marketPosition, t: "blue" as Tone },
          { l: "Risk Exposure", v: executive.riskExposure, t: "rose" as Tone, invert: true },
          { l: "Research Health", v: executive.researchHealth, t: "purple" as Tone },
        ].map((g, i) => (
          <Reveal key={g.l} i={i}>
            <ExecGauge label={g.l} value={g.v} tone={g.t} invert={g.invert} />
          </Reveal>
        ))}
      </div>

      {/* Trajectory + Priorities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card sheen={false} className="p-5">
            <SectionTitle
              hint={<span className="text-[11px] text-muted-foreground">6-month trajectory</span>}
            >
              Strategic Trajectory
            </SectionTitle>
            <AreaTrend
              data={executive.trajectory as unknown as Record<string, number | string>[]}
              series={[
                { key: "health", tone: "indigo", label: "Health" },
                { key: "opportunity", tone: "emerald", label: "Opportunity" },
                { key: "risk", tone: "rose", label: "Risk" },
              ]}
              height={260}
            />
          </Card>
        </Reveal>

        <Reveal i={1}>
          <Card className="h-full p-5">
            <SectionTitle>Strategic Priorities</SectionTitle>
            <div className="space-y-4">
              {executive.priorities.map((p) => (
                <div key={p.title}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="text-sm text-foreground">{p.title}</span>
                    <span className={`tabular text-xs font-semibold ${toneText[p.tone]}`}>{p.confidence}%</span>
                  </div>
                  <Progress value={p.confidence} tone={p.tone} />
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>

      {/* Actions + Top Opps + Top Risks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal>
          <Card className="h-full p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald" />
              <h3 className="text-sm font-semibold text-foreground">Recommended Actions</h3>
            </div>
            <ul className="space-y-3">
              {executive.actions.map((a, i) => (
                <li key={a} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-[10px] font-semibold text-emerald">
                    {i + 1}
                  </span>
                  <span className="text-[13px] leading-snug text-foreground/85">{a}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal i={1}>
          <Card className="h-full p-5">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo" />
              <h3 className="text-sm font-semibold text-foreground">Top Opportunities</h3>
            </div>
            <div className="space-y-3">
              {opportunities.slice(0, 4).map((o) => (
                <div key={o.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo/30 bg-indigo/10 text-[11px] font-semibold text-indigo">
                    {o.opportunityScore}
                  </div>
                  <span className="flex-1 truncate text-[13px] text-foreground/85">{o.title}</span>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald" />
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal i={2}>
          <Card className="h-full p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose" />
              <h3 className="text-sm font-semibold text-foreground">Top Risks</h3>
            </div>
            <div className="space-y-3">
              {risks.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose/30 bg-rose/10 text-[11px] font-semibold text-rose">
                    {Math.round((r.likelihood * r.severity) / 100)}
                  </div>
                  <span className="flex-1 truncate text-[13px] text-foreground/85">{r.name}</span>
                  <Badge variant={r.level === "High" ? "rose" : "amber"}>{r.level}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber/30 bg-amber/10">
              <FileText className="h-5 w-5 text-amber" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Generate Board-Ready Briefing</h3>
              <p className="text-[12px] text-muted">Export the full executive intelligence report as a PDF.</p>
            </div>
          </div>
          <button className="rounded-xl bg-gradient-to-r from-indigo to-purple px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_30px_-6px_rgba(99,102,241,0.8)] transition-transform hover:scale-[1.02]">
            Generate Report
          </button>
        </Card>
      </Reveal>
    </div>
  );
}
