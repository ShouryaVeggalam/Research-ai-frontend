"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Bell, Globe2, Cpu, ShieldCheck, Palette } from "lucide-react";
import { PageHeader, Reveal } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { cn } from "@/lib/utils";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative h-6 w-11 rounded-full border transition-colors",
        on ? "border-indigo/50 bg-indigo/30" : "border-border bg-white/[0.04]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          on ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function Row({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/[0.02]">
          <Icon className="h-4 w-4 text-muted" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="text-[12px] text-muted-foreground">{desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [alerts, setAlerts] = useState(true);
  const [autonomous, setAutonomous] = useState(true);
  const [digest, setDigest] = useState(false);
  const [security, setSecurity] = useState(true);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Configure your intelligence network, agents, alerts, and appearance."
        icon={SettingsIcon}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Reveal>
            <Card className="p-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Intelligence & Agents</h3>
              <Row
                icon={Cpu}
                title="Autonomous Agent Monitoring"
                desc="Let agents continuously scan markets and competitors."
              >
                <Toggle on={autonomous} onToggle={() => setAutonomous((v) => !v)} />
              </Row>
              <Row
                icon={Bell}
                title="Real-time Alerts"
                desc="Push critical intelligence signals as they happen."
              >
                <Toggle on={alerts} onToggle={() => setAlerts((v) => !v)} />
              </Row>
              <Row
                icon={Globe2}
                title="Daily Executive Digest"
                desc="Summarized strategic briefing delivered each morning."
              >
                <Toggle on={digest} onToggle={() => setDigest((v) => !v)} />
              </Row>
              <Row
                icon={ShieldCheck}
                title="Security Monitoring"
                desc="Watch for security and regulatory exposure signals."
              >
                <Toggle on={security} onToggle={() => setSecurity((v) => !v)} />
              </Row>
            </Card>
          </Reveal>

          <Reveal i={1}>
            <Card className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Appearance</h3>
              <Row icon={Palette} title="Theme" desc="Dark mode is recommended for the command center.">
                <ThemeToggle />
              </Row>
            </Card>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal i={2}>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-purple text-sm font-semibold text-white">
                  AV
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground">A. Vega</div>
                  <div className="text-[12px] text-muted-foreground">Chief Strategy Officer</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-[12px]">
                {[
                  { l: "Plan", v: "Enterprise" },
                  { l: "Seats", v: "24 / 50" },
                  { l: "Data Sources", v: "2,418" },
                  { l: "Renewal", v: "Jan 2027" },
                ].map((r) => (
                  <div key={r.l} className="flex justify-between border-b border-border pb-2 last:border-0">
                    <span className="text-muted">{r.l}</span>
                    <span className="text-foreground">{r.v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal i={3}>
            <Card className="border-indigo/20 p-5">
              <h3 className="text-sm font-semibold text-foreground">Network Capacity</h3>
              <p className="mt-1 text-[12px] text-muted">You are using 68% of your signal ingestion capacity.</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo to-purple" />
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
