"use client";

import { Building2 } from "lucide-react";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/ui/score-ring";
import { industries, type Industry } from "@/lib/data";

function IndustryCard({ ind, i }: { ind: Industry; i: number }) {
  return (
    <Reveal i={i}>
      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">{ind.name}</h3>
            <p className="text-[11px] text-muted-foreground">Industry health & disruption profile</p>
          </div>
          <ScoreRing value={ind.health} tone={ind.tone} size={84} stroke={6} label="Health" />
        </div>
        <div className="mt-4 space-y-3">
          {[
            { l: "Growth", v: ind.growth, suffix: "%" },
            { l: "AI Adoption", v: ind.adoption },
            { l: "Disruption Index", v: ind.disruption },
          ].map((row) => (
            <div key={row.l}>
              <div className="mb-1 flex justify-between text-[11px] text-muted">
                <span>{row.l}</span>
                <span className="tabular text-foreground">
                  {row.v}
                  {row.suffix ?? ""}
                </span>
              </div>
              <Progress value={row.v} tone={ind.tone} />
            </div>
          ))}
        </div>
      </Card>
    </Reveal>
  );
}

export default function IndustryIntelligence() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sector Signals"
        title="Industry Intelligence"
        description="Health, growth, AI adoption, and disruption across monitored industries."
        icon={Building2}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Industries Monitored", v: `${industries.length}`, t: "text-indigo" },
          { l: "Avg Health", v: `${Math.round(industries.reduce((s, x) => s + x.health, 0) / industries.length)}`, t: "text-emerald" },
          { l: "Avg Disruption", v: `${Math.round(industries.reduce((s, x) => s + x.disruption, 0) / industries.length)}`, t: "text-rose" },
          { l: "High Adoption", v: `${industries.filter((x) => x.adoption >= 60).length}`, t: "text-blue" },
        ].map((s, i) => (
          <Reveal key={s.l} i={i}>
            <Card className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`tabular mt-1.5 text-2xl font-semibold ${s.t}`}>{s.v}</div>
            </Card>
          </Reveal>
        ))}
      </div>
      <div>
        <SectionTitle>Monitored Industries</SectionTitle>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((ind, i) => (
            <IndustryCard key={ind.id} ind={ind} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
