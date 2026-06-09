"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Radar,
  Cpu,
  Globe2,
  Activity,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reveal, SectionTitle } from "@/components/ui/section";
import { MetricCard } from "@/components/viz/metric-card";
import { LiveFeed } from "@/components/features/live-feed";
import { StrategyMap } from "@/components/features/strategy-map";
import { Sparkline } from "@/components/viz/sparkline";
import { heroMetrics, opportunities, trends, type KPI } from "@/lib/data";
import { fetchHeroMetrics } from "@/lib/api";
import { toneText } from "@/lib/tones";

export default function MissionControl() {
  const [metrics, setMetrics] = useState<KPI[]>(heroMetrics);

  useEffect(() => {
    let active = true;
    fetchHeroMetrics()
      .then((live) => {
        if (active && live) setMetrics(live);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-panel p-6 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-purple/15 blur-[120px]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Badge variant="indigo" className="mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo live-dot" />
                AI-POWERED STRATEGIC INTELLIGENCE NETWORK
              </Badge>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                Research AI
                <span className="block bg-gradient-to-r from-indigo via-purple to-blue bg-clip-text text-transparent">
                  Mission Control
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                Operate a global intelligence network across markets,
                competitors, trends, opportunities, and risks — synthesized into
                decisions your strategy department can act on.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link href="/strategy-agent">
                  <Button size="lg">
                    <Sparkles className="h-4 w-4" />
                    Ask the Strategy Agent
                  </Button>
                </Link>
                <Link href="/chief-research-officer">
                  <Button variant="secondary" size="lg">
                    Executive Briefing
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Radar visual */}
            <div className="relative hidden h-56 w-56 shrink-0 items-center justify-center lg:flex">
              <div className="absolute inset-0 rounded-full border border-indigo/20" />
              <div className="absolute inset-6 rounded-full border border-indigo/15" />
              <div className="absolute inset-12 rounded-full border border-indigo/10" />
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-0 origin-center"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, rgba(99,102,241,0.35) 40deg, transparent 80deg)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <Radar className="relative h-10 w-10 text-indigo glow-indigo" />
              {[
                { t: "12%", l: "20%" },
                { t: "70%", l: "30%" },
                { t: "40%", l: "78%" },
                { t: "82%", l: "66%" },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-emerald"
                  style={{ top: p.t, left: p.l }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* LIVE METRICS */}
      <div>
        <SectionTitle
          hint={
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-emerald" /> Live · updated 12s ago
            </span>
          }
        >
          Live Metrics
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((kpi, i) => (
            <Reveal key={kpi.label} i={i}>
              <MetricCard kpi={kpi} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* FEED + SIDE */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Reveal>
            <LiveFeed />
          </Reveal>
        </div>
        <div className="space-y-6">
          <Reveal i={1}>
            <Card className="p-5">
              <SectionTitle
                hint={
                  <Link href="/opportunity-discovery" className="text-[11px] text-indigo hover:underline">
                    View all
                  </Link>
                }
              >
                Top Opportunities
              </SectionTitle>
              <div className="space-y-3">
                {opportunities.slice(0, 3).map((o) => (
                  <div key={o.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo/30 bg-indigo/10 text-xs font-semibold text-indigo">
                      {o.opportunityScore}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{o.title}</p>
                      <p className="text-[11px] text-muted-foreground">{o.category}</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-emerald" />
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal i={2}>
            <Card className="p-5">
              <SectionTitle
                hint={
                  <Link href="/trend-intelligence" className="text-[11px] text-indigo hover:underline">
                    View all
                  </Link>
                }
              >
                Surging Trends
              </SectionTitle>
              <div className="space-y-4">
                {trends.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">{t.name}</p>
                      <p className={`text-[11px] ${toneText[t.tone]}`}>+{t.growth}% growth</p>
                    </div>
                    <Sparkline data={t.forecast} tone={t.tone} width={88} height={30} />
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal i={3}>
            <Card className="relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple/30 bg-purple/10">
                  <Cpu className="h-5 w-5 text-purple" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Models Online</p>
                  <p className="text-[11px] text-muted-foreground">14 intelligence agents active</p>
                </div>
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { l: "Sources", v: "2.4K" },
                  { l: "Signals/hr", v: "18K" },
                  { l: "Accuracy", v: "94%" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border border-border bg-white/[0.02] py-2">
                    <div className="tabular text-base font-semibold text-foreground">{s.v}</div>
                    <div className="text-[10px] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* STRATEGY MAP */}
      <Reveal>
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-indigo" />
          <h2 className="text-base font-semibold text-foreground">Global Strategy Map</h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          Interactive intelligence graph — hover any node to trace its strategic connections.
        </p>
        <StrategyMap />
      </Reveal>
    </div>
  );
}
