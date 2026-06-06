"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ArrowUp, Sparkles, User, Loader2, Brain } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { strategyPrompts, strategyAnswers } from "@/lib/data";

interface Msg {
  role: "user" | "agent";
  text: string;
  thinking?: boolean;
}

const answers: Record<string, string> = {
  "Which market should we enter next?":
    "Highest conviction: **AI compliance tooling for mid-market fintech** (Opportunity Score 94). A $12.4B market with low competition (28/100), 47% growth, and strong regulatory tailwinds from the EU AI Act. Buyers face an urgent, mandatory need — which compresses sales cycles and supports premium pricing.",
  "What should we build next?":
    "Build an **AI evaluation & observability suite**. Demand is spiking among Series B+ startups, the category is fragmenting before incumbents consolidate, and it creates a durable developer-infrastructure moat. Pair it with eval primitives competitors lack (regression tracking, agent trace replay).",
  "Where is demand growing fastest?":
    "Three vectors are accelerating: **On-device inference** (+61% market CAGR), **AI security & governance** (+52%), and **AI developer infrastructure** (+47%). On-device is the fastest-growing but earliest; governance offers the best risk-adjusted entry today.",
  "What are competitors missing?":
    "Competitors are over-indexing on model capability and under-investing in **reliability, compliance, and integration depth**. Anthropic and Mistral lead on raw capability but leave white space in vertical compliance workflows and enterprise observability — exactly where regulated buyers feel the most pain.",
  "What opportunities exist right now?":
    "Six ranked opportunities are live. The top three: (1) AI compliance tooling for fintech (94), (2) AI evaluation & observability (89), (3) vertical AI for healthcare revenue-cycle (86). Combined revenue potential exceeds $730M.",
  "What's our biggest strategic risk?":
    "**EU AI Act compliance exposure** (likelihood 82, severity 74) paired with **HBM supply concentration** (severity 86). Both are rising. Mitigation: stand up a regulatory affairs function now and secure secondary memory supply agreements before enforcement timelines tighten.",
};

export default function StrategyAgent() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setMessages((m) => [...m, { role: "agent", text: "", thinking: true }]);

    const answer = answers[text] ?? strategyAnswers.default;
    setTimeout(() => {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "agent", text: answer };
        return copy;
      });
      setBusy(false);
    }, 1400);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Autonomous Strategist"
        title="Strategy Agent"
        description="A reasoning agent grounded in your live intelligence network. Ask it anything strategic."
        icon={Bot}
        actions={<Badge variant="emerald"><span className="h-1.5 w-1.5 rounded-full bg-emerald live-dot" /> Online</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat */}
        <div className="flex h-[640px] flex-col overflow-hidden rounded-2xl border border-border bg-card lg:col-span-2">
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo/30 bg-gradient-to-br from-indigo/20 to-purple/10">
                  <Brain className="h-7 w-7 text-indigo" />
                  <span className="absolute inset-0 rounded-2xl border border-indigo/20 float-slow" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">How can I advise you today?</h3>
                <p className="mt-1 max-w-sm text-sm text-muted">
                  I synthesize markets, competitors, trends, and risks into strategic recommendations.
                </p>
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                      m.role === "user"
                        ? "border-border bg-white/[0.04]"
                        : "border-indigo/30 bg-indigo/10"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="h-4 w-4 text-muted" />
                    ) : (
                      <Bot className="h-4 w-4 text-indigo" />
                    )}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo/90 text-white"
                        : "border border-border bg-white/[0.02] text-foreground/90"
                    }`}
                  >
                    {m.thinking ? (
                      <span className="flex items-center gap-2 text-muted">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing intelligence network…
                      </span>
                    ) : (
                      <FormattedText text={m.text} />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-2 focus-within:border-indigo/40"
            >
              <Sparkles className="h-4 w-4 text-indigo" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a strategic question…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo text-white transition-transform hover:scale-105 disabled:opacity-50"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Suggested Questions</h3>
          {strategyPrompts.map((p, i) => (
            <motion.button
              key={p}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => send(p)}
              disabled={busy}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground/90 transition-colors hover:border-indigo/30 hover:bg-indigo/[0.05] disabled:opacity-50"
            >
              <span>{p}</span>
              <ArrowUp className="h-3.5 w-3.5 rotate-45 text-muted-foreground transition-colors group-hover:text-indigo" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}
