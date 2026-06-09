"use client";

import { Globe2, ArrowUpRight } from "lucide-react";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkline } from "@/components/viz/sparkline";
import { markets as mockMarkets, type Market } from "@/lib/data";
import { fetchMarkets } from "@/lib/api";
import { useBackendData } from "@/lib/use-backend-data";
import { formatCurrency } from "@/lib/utils";
import { toneText } from "@/lib/tones";

function MarketCard({ m, i }: { m: Market; i: number }) {
  return (
    <Reveal i={i}>
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">{m.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={m.tone}>{formatCurrency(m.size)} TAM</Badge>
              <span className={`text-[11px] font-medium ${toneText[m.tone]}`}>+{m.cagr}% CAGR</span>
            </div>
          </div>
          <Sparkline data={m.signal} tone={m.tone} width={96} height={36} />
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Attractiveness</span>
              <span className="tabular text-foreground">{m.attractiveness}</span>
            </div>
            <Progress value={m.attractiveness} tone={m.tone} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Saturation</span>
              <span className="tabular text-foreground">{m.saturation}</span>
            </div>
            <Progress value={m.saturation} tone="amber" />
          </div>
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-white/[0.02] py-2 text-xs text-muted transition-colors hover:text-foreground">
          Open Market Brief <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </Card>
    </Reveal>
  );
}

export default function MarketIntelligence() {
  const markets = useBackendData(fetchMarkets, mockMarkets);
  const totalTam = markets.reduce((s, m) => s + m.size, 0);
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Macro Index"
        title="Market Intelligence"
        description="Sizing, growth, attractiveness, and saturation across tracked strategic markets."
        icon={Globe2}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Markets Tracked", v: `${markets.length}`, t: "text-indigo" },
          { l: "Combined TAM", v: formatCurrency(totalTam), t: "text-emerald" },
          { l: "Avg CAGR", v: `${Math.round(markets.reduce((s, m) => s + m.cagr, 0) / markets.length)}%`, t: "text-blue" },
          { l: "High Attractiveness", v: `${markets.filter((m) => m.attractiveness >= 85).length}`, t: "text-purple" },
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
        <SectionTitle>Tracked Markets</SectionTitle>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {markets.map((m, i) => (
            <MarketCard key={m.id} m={m} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
