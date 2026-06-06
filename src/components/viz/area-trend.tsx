"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useChartTheme } from "@/lib/use-theme-colors";
import type { Tone } from "@/lib/data";

interface Series {
  key: string;
  tone: Tone;
  label?: string;
}

export function AreaTrend({
  data,
  series,
  xKey = "month",
  height = 240,
  showGrid = true,
  showAxis = true,
}: {
  data: Record<string, number | string>[];
  series: Series[];
  xKey?: string;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}) {
  const ct = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ct.tones[s.tone]} stopOpacity={0.35} />
              <stop offset="100%" stopColor={ct.tones[s.tone]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={ct.grid} vertical={false} />
        )}
        {showAxis && (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fill: ct.axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: ct.axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            background: ct.tooltipBg,
            border: `1px solid ${ct.tooltipBorder}`,
            borderRadius: 12,
            fontSize: 12,
            color: ct.text,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
          labelStyle={{ color: ct.muted }}
          cursor={{ stroke: ct.tooltipBorder }}
        />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={ct.tones[s.tone]}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
