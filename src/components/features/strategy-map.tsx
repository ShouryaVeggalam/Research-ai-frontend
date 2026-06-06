"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { graphNodes, graphEdges, nodeToneMap, type GraphNode } from "@/lib/data";
import { useChartTheme } from "@/lib/use-theme-colors";
import { Badge } from "@/components/ui/badge";

const typeLabel: Record<GraphNode["type"], string> = {
  core: "Core",
  market: "Market",
  industry: "Industry",
  opportunity: "Opportunity",
  risk: "Risk",
};

export function StrategyMap() {
  const [active, setActive] = useState<string | null>(null);
  const ct = useChartTheme();
  const toneHex = ct.tones;
  const node = (id: string) => graphNodes.find((n) => n.id === id)!;
  const selected = active ? node(active) : null;

  const connected = new Set<string>();
  if (active) {
    graphEdges.forEach((e) => {
      if (e.from === active) connected.add(e.to);
      if (e.to === active) connected.add(e.from);
    });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Global Strategy Map</h3>
          <p className="text-[11px] text-muted-foreground">
            Markets · Industries · Opportunities · Risks
          </p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          {(["market", "industry", "opportunity", "risk"] as const).map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-[10px] text-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: toneHex[nodeToneMap[t]] }}
              />
              {typeLabel[t]}
            </span>
          ))}
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full bg-grid">
        <svg viewBox="0 0 100 62.5" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {graphEdges.map((e, i) => {
            const a = node(e.from);
            const b = node(e.to);
            const isActive =
              active && (e.from === active || e.to === active);
            return (
              <motion.line
                key={i}
                x1={a.x}
                y1={a.y * 0.625}
                x2={b.x}
                y2={b.y * 0.625}
                stroke={isActive ? toneHex[nodeToneMap[a.type]] : ct.tooltipBorder}
                strokeWidth={isActive ? 0.4 : 0.2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isActive ? 0.9 : 0.5 }}
                transition={{ duration: 1, delay: i * 0.04 }}
              />
            );
          })}

          {/* Nodes */}
          {graphNodes.map((n, i) => {
            const color = toneHex[nodeToneMap[n.type]];
            const r = n.size / 8;
            const dim = active && active !== n.id && !connected.has(n.id);
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.05, type: "spring" }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
              >
                {n.type === "core" && (
                  <motion.circle
                    cx={n.x}
                    cy={n.y * 0.625}
                    r={r + 1.5}
                    fill="none"
                    stroke={color}
                    strokeWidth={0.2}
                    animate={{ r: [r + 1, r + 2.5, r + 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
                <circle cx={n.x} cy={n.y * 0.625} r={r} fill={color} fillOpacity={0.18} />
                <circle cx={n.x} cy={n.y * 0.625} r={r * 0.45} fill={color} />
                <text
                  x={n.x}
                  y={n.y * 0.625 + r + 2.2}
                  textAnchor="middle"
                  fontSize={1.8}
                  fill={ct.muted}
                >
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Detail card */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass absolute bottom-3 left-3 rounded-xl border border-border p-3"
          >
            <Badge variant={nodeToneMap[selected.type]}>{typeLabel[selected.type]}</Badge>
            <div className="mt-1.5 text-sm font-semibold text-foreground">{selected.label}</div>
            <div className="text-[11px] text-muted">
              {connected.size} connected node{connected.size === 1 ? "" : "s"}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
