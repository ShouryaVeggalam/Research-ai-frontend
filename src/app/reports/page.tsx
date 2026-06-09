"use client";

import { FileBarChart, Download, Clock, Loader2, FileText } from "lucide-react";
import { PageHeader, Reveal, SectionTitle } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reports as mockReports, type Report } from "@/lib/data";
import { fetchReports } from "@/lib/api";
import { useBackendData } from "@/lib/use-backend-data";
import { toneIconWrap } from "@/lib/tones";
import { cn } from "@/lib/utils";

const statusMap = {
  Ready: { variant: "emerald" as const, icon: Download },
  Generating: { variant: "amber" as const, icon: Loader2 },
  Scheduled: { variant: "blue" as const, icon: Clock },
};

function ReportRow({ r, i }: { r: Report; i: number }) {
  const s = statusMap[r.status];
  const SIcon = s.icon;
  return (
    <Reveal i={i}>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", toneIconWrap[r.tone])}>
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">{r.title}</h3>
            <Badge variant={r.tone}>{r.type}</Badge>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{r.date}</span>
            {r.pages > 0 && <span>· {r.pages} pages</span>}
            {r.confidence > 0 && <span>· {r.confidence}% confidence</span>}
          </div>
        </div>
        <Badge variant={s.variant}>
          <SIcon className={cn("h-3 w-3", r.status === "Generating" && "animate-spin")} />
          {r.status}
        </Badge>
      </div>
    </Reveal>
  );
}

export default function Reports() {
  const reports = useBackendData(fetchReports, mockReports);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Reports"
        description="Generated intelligence reports, briefings, and scheduled deep dives."
        icon={FileBarChart}
        actions={
          <button className="rounded-xl bg-indigo px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_-6px_rgba(99,102,241,0.7)]">
            New Report
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Total Reports", v: `${reports.length}`, t: "text-indigo" },
          { l: "Ready", v: `${reports.filter((r) => r.status === "Ready").length}`, t: "text-emerald" },
          { l: "Generating", v: `${reports.filter((r) => r.status === "Generating").length}`, t: "text-amber" },
          { l: "Scheduled", v: `${reports.filter((r) => r.status === "Scheduled").length}`, t: "text-blue" },
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
        <SectionTitle>All Reports</SectionTitle>
        <div className="space-y-3">
          {reports.map((r, i) => (
            <ReportRow key={r.id} r={r} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
