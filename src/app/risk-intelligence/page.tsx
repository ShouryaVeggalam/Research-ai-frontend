"use client";

import { motion } from "framer-motion";
import { ShieldAlert, TrendingUp, Minus, TrendingDown, AlertTriangle } from "lucide-react";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { risks, type Risk, type Priority } from "@/lib/data";
import { useToneColors } from "@/lib/use-theme-colors";

const levelTone: Record<Priority, "rose" | "amber" | "blue" | "default"> = {
  Critical: "rose",
  High: "rose",
  Medium: "amber",
  Low: "blue",
};

const trendIcon = {
  Rising: TrendingUp,
  Stable: Minus,
  Falling: TrendingDown,
};
const trendColor = {
  Rising: "text-rose",
  Stable: "text-amber",
  Falling: "text-emerald",
};

function RiskMatrix() {
  const toneHex = useToneColors();
  return (
    <Card sheen={false} className="p-5">
      <SectionTitle>Risk Matrix</SectionTitle>
      <div className="relative aspect-square w-full sm:aspect-[4/3]">
        {/* quadrant bg */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-border">
          <div className="bg-emerald/[0.04]" />
          <div className="bg-amber/[0.05]" />
          <div className="bg-amber/[0.05]" />
          <div className="bg-rose/[0.07]" />
        </div>
        {/* axis labels */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] uppercase tracking-wider text-muted-foreground">
          Severity →
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider text-muted-foreground">
          Likelihood →
        </span>
        {/* points */}
        {risks.map((r, i) => {
          const tone = levelTone[r.level];
          return (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.06, type: "spring" }}
              className="group absolute -translate-x-1/2 translate-y-1/2"
              style={{ left: `${r.likelihood}%`, bottom: `${r.severity}%` }}
            >
              <span
                className="block h-3 w-3 rounded-full ring-2 ring-background"
                style={{ background: toneHex[tone === "default" ? "blue" : tone], boxShadow: `0 0 12px ${toneHex[tone === "default" ? "blue" : tone]}` }}
              />
              <span className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[10px] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {r.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function RiskHeatmap() {
  const toneHex = useToneColors();
  const categories = Array.from(new Set(risks.map((r) => r.category)));
  return (
    <Card sheen={false} className="p-5">
      <SectionTitle>Risk Heatmap</SectionTitle>
      <div className="space-y-2">
        {categories.map((cat) => {
          const items = risks.filter((r) => r.category === cat);
          const score = Math.round(
            items.reduce((s, r) => s + (r.likelihood * r.severity) / 100, 0) / items.length,
          );
          const intensity = Math.min(1, score / 70);
          return (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs text-muted">{cat}</span>
              <div className="h-7 flex-1 overflow-hidden rounded-lg border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="flex h-full items-center justify-end pr-2"
                  style={{
                    background: `linear-gradient(90deg, ${toneHex.amber}${Math.round(
                      intensity * 60,
                    ).toString(16).padStart(2, "0")}, ${toneHex.rose})`,
                  }}
                >
                  <span className="tabular text-[10px] font-semibold text-white">{score}</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RiskRow({ r, i }: { r: Risk; i: number }) {
  const TrendI = trendIcon[r.trend];
  return (
    <Reveal i={i}>
      <div className="flex items-center gap-4 border-b border-border px-4 py-3 transition-colors hover:bg-white/[0.02]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose/25 bg-rose/10">
          <AlertTriangle className="h-4 w-4 text-rose" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground">{r.name}</span>
            <Badge variant={levelTone[r.level]}>{r.level}</Badge>
          </div>
          <p className="truncate text-[11px] text-muted-foreground">{r.detail}</p>
        </div>
        <div className="hidden w-28 shrink-0 sm:block">
          <div className="text-[10px] text-muted-foreground">Likelihood / Severity</div>
          <div className="tabular text-xs text-foreground">{r.likelihood} / {r.severity}</div>
        </div>
        <span className={`flex shrink-0 items-center gap-1 text-[11px] ${trendColor[r.trend]}`}>
          <TrendI className="h-3.5 w-3.5" /> {r.trend}
        </span>
      </div>
    </Reveal>
  );
}

export default function RiskIntelligence() {
  const highRisks = risks.filter((r) => r.level === "High" || r.level === "Critical").length;
  const avgExposure = Math.round(
    risks.reduce((s, r) => s + (r.likelihood * r.severity) / 100, 0) / risks.length,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Risk Sentinel"
        title="Risk Intelligence"
        description="Heatmaps, risk matrix, and strategic alerts across regulatory, supply, market, and security vectors."
        icon={ShieldAlert}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Active Risks", v: `${risks.length}`, t: "text-rose" },
          { l: "High / Critical", v: `${highRisks}`, t: "text-amber" },
          { l: "Avg Exposure", v: `${avgExposure}`, t: "text-purple" },
          { l: "Rising Trends", v: `${risks.filter((r) => r.trend === "Rising").length}`, t: "text-blue" },
        ].map((s, i) => (
          <Reveal key={s.l} i={i}>
            <Card className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className={`tabular mt-1.5 text-2xl font-semibold ${s.t}`}>{s.v}</div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal><RiskMatrix /></Reveal>
        <Reveal i={1}><RiskHeatmap /></Reveal>
      </div>

      <Reveal>
        <Card sheen={false} className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Strategic Alerts · Threat Timeline</h3>
            <Badge variant="rose">{highRisks} require attention</Badge>
          </div>
          <div>
            {risks.map((r, i) => (
              <RiskRow key={r.id} r={r} i={i} />
            ))}
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
