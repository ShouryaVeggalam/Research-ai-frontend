"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Swords,
  Building2,
  Banknote,
  Scale,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { feedItems, feedToneMap, type FeedItem, type FeedType } from "@/lib/data";
import { fetchFeed } from "@/lib/api";
import { toneIconWrap, toneText } from "@/lib/tones";
import { cn } from "@/lib/utils";

const typeIcon: Record<FeedType, React.ComponentType<{ className?: string }>> = {
  Competitor: Swords,
  Industry: Building2,
  Funding: Banknote,
  Regulatory: Scale,
  Opportunity: Sparkles,
  Trend: TrendingUp,
  Risk: ShieldAlert,
};

const priorityTone: Record<string, "rose" | "amber" | "blue" | "default"> = {
  Critical: "rose",
  High: "amber",
  Medium: "blue",
  Low: "default",
};

function ScoreBar({ label, value, tone }: { label: string; value: number; tone: string }) {
  const color: Record<string, string> = {
    impact: "bg-indigo",
    conf: "bg-emerald",
  };
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className={cn("h-full rounded-full", color[tone])} style={{ width: `${value}%` }} />
      </div>
      <span className="tabular w-7 text-right text-[10px] text-muted">{value}</span>
    </div>
  );
}

function FeedRow({ item, isNew }: { item: FeedItem; isNew?: boolean }) {
  const Icon = typeIcon[item.type];
  const tone = feedToneMap[item.type];
  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -16, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className="group relative border-b border-border px-4 py-3.5 transition-colors hover:bg-white/[0.02]"
    >
      {isNew && (
        <span className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-indigo to-purple" />
      )}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
            toneIconWrap[tone],
          )}
        >
          <Icon className={cn("h-4 w-4", toneText[tone])} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant={tone}>{item.type}</Badge>
            <Badge variant={priorityTone[item.priority]}>{item.priority}</Badge>
            <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
              {item.time}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-snug text-foreground">{item.title}</p>
          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{item.source}</span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <ScoreBar label="Impact" value={item.impact} tone="impact" />
            <ScoreBar label="Conf." value={item.confidence} tone="conf" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>(feedItems);
  const [newId, setNewId] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  // Try the backend first. If it returns feed items, switch to live mode and
  // poll for updates. Otherwise keep the simulated demo feed below.
  useEffect(() => {
    let active = true;
    fetchFeed(14)
      .then((real) => {
        if (active && real && real.length > 0) {
          setItems(real);
          setNewId(real[0]?.id ?? null);
          setLive(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Live mode: poll the backend feed and surface new items at the top.
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(async () => {
      const real = await fetchFeed(14);
      if (real && real.length > 0) {
        setNewId(real[0]?.id ?? null);
        setItems(real);
      }
    }, 15_000);
    return () => clearInterval(interval);
  }, [live]);

  // Demo mode: synthesize a flowing feed from the mock pool.
  useEffect(() => {
    if (live) return;
    const pool = feedItems;
    let counter = 1000;
    const interval = setInterval(() => {
      const template = pool[Math.floor(Math.random() * pool.length)];
      counter += 1;
      const fresh: FeedItem = {
        ...template,
        id: `live-${counter}`,
        time: "just now",
      };
      setNewId(fresh.id);
      setItems((prev) => [fresh, ...prev].slice(0, 14));
    }, 6000);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald/60" />
            <span className="h-2 w-2 rounded-full bg-emerald" />
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            Live Intelligence Feed
          </h3>
          <Badge variant="emerald">REAL-TIME</Badge>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          <span className="tabular">{items.length} signals</span>
        </div>
      </div>
      <div className="relative max-h-[640px] flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <FeedRow key={item.id} item={item} isNew={item.id === newId} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
